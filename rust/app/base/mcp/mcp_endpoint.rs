use std::collections::HashMap;
use std::env;
use std::sync::{Arc, OnceLock};
use std::time::Duration;

use async_graphql::{Request as GraphqlRequest, Variables};
use async_graphql::parser::{
  parse_query,
  types::{DocumentOperations, ExecutableDocument, OperationDefinition, Selection, SelectionSet},
};
use base64::{Engine, engine::general_purpose};
use color_eyre::eyre::{Result, eyre};
use futures_util::Stream;
use generated::common::auth::auth_dao::get_token_by_auth_model;
use generated::common::auth::auth_model::{AUTHORIZATION, AuthModel, AuthToken, ClientTenantId};
use generated::common::context::{
  Ctx,
  get_now,
  get_server_tokentimeout,
  get_short_uuid,
  id_to_string,
  normalize_page_query_values,
};
use generated::common::gql::model::Ip;
use generated::common::oss::oss_service;
use generated::common::usr::usr_service;
use http_body_util::BodyExt;
use poem::http::StatusCode;
use poem::endpoint::make;
use poem::{Body, Endpoint, Request, Response, ResponseParts};
use rmcp::service::RequestContext;
use rmcp::transport::WorkerTransport;
use rmcp::transport::streamable_http_server::session::local::{LocalSessionManager, LocalSessionWorker};
use rmcp::transport::streamable_http_server::session::{
  EventStore,
  RestoreOutcome,
  ServerSseMessage,
  SessionId,
  SessionManager,
  SessionStore,
};
use rmcp::transport::streamable_http_server::{StreamableHttpServerConfig, StreamableHttpService};
use rmcp::{
  ErrorData,
  RoleServer,
  ServerHandler,
  model::{
    CallToolRequestParams,
    CallToolResponse,
    CallToolResult,
    ClientJsonRpcMessage,
    Implementation,
    JsonObject,
    ListToolsResult,
    PaginatedRequestParams,
    ServerCapabilities,
    ServerConfig,
    ServerJsonRpcMessage,
    Tool,
  },
};
use serde::{Serialize, de::DeserializeOwned};
use serde_json::{Map, Value, json};
use tokio::time::Instant;

use super::mcp_model::{
  McpGraphqlInput,
  McpOssDownloadUrlInput,
  McpOssImageUrlInput,
  McpSchemaGetInput,
  McpSchemaSearchInput,
  McpOssUploadInput,
};
use super::mcp_service;
use super::rmcp_session_store::RmcpSessionStore;
use super::schema_search;

const INSTRUCTIONS: &str = "这是内嵌在 rust 后端里的 MCP 调试入口。先调用 session_me 确认当前登录态；如果不清楚 GraphQL 的 Query、Mutation、Input 或返回类型，先用 schema_search 搜索 schema；如果已经定位到精确类型名，再用 schema_get 查看完整 SDL；过大的聚合类型不会直接返回；最后再用 graphql_execute 调试业务接口。对任何 findAll* 查询，都要显式传 page；缺 page 会被直接拒绝，pgSize 缺省按 20，超过 2000 自动降到 2000。附件上传走 oss_upload，下载和图片预览分别用 oss_download_url / oss_image_url。标准客户端可直接走 OAuth 授权码流程；手工调试也可以先调用 POST /mcp/login，得到 authorization 后放到 Authorization: Bearer <token> 请求头里。";
const SESSION_SWEEP_INTERVAL: Duration = Duration::from_secs(5);

type McpHttpService = StreamableHttpService<McpServer, McpSessionManager>;

static MCP_HTTP_SERVICE: OnceLock<Arc<McpHttpService>> = OnceLock::new();

#[derive(Clone)]
struct McpAuthContext {
  auth_model: AuthModel,
  request_origin: String,
  real_ip: String,
}

#[derive(Clone)]
struct McpServer {
  schema: crate::QuerySchema,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct GraphqlExecutePageGuard {
  field: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  requested_pg_size: Option<i64>,
  applied_pg_size: i64,
  page_size_capped: bool,
  page_size_defaulted: bool,
}

struct McpSessionManager {
  inner: LocalSessionManager,
  last_active: tokio::sync::RwLock<HashMap<SessionId, Instant>>,
  session_timeout: Duration,
  session_store: Arc<RmcpSessionStore>,
}

pub fn mcp_get() -> impl Endpoint<Output = Response> {
  make(|req: Request| async move { handle_mcp(req).await })
}

pub fn mcp_post() -> impl Endpoint<Output = Response> {
  make(|req: Request| async move { handle_mcp(req).await })
}

pub fn mcp_delete() -> impl Endpoint<Output = Response> {
  make(|req: Request| async move { handle_mcp(req).await })
}

impl McpSessionManager {
  fn new(session_store: Arc<RmcpSessionStore>) -> Arc<Self> {
    let manager = Arc::new(Self {
      inner: LocalSessionManager::default(),
      last_active: tokio::sync::RwLock::new(HashMap::new()),
      session_timeout: session_store.session_timeout(),
      session_store,
    });
    Self::spawn_reaper(manager.clone());
    manager
  }

  fn spawn_reaper(manager: Arc<Self>) {
    tokio::spawn(async move {
      let mut interval = tokio::time::interval(SESSION_SWEEP_INTERVAL);
      loop {
        interval.tick().await;
        let now = Instant::now();
        let stale_sessions = {
          let last_active = manager.last_active.read().await;
          last_active.iter()
            .filter_map(|(session_id, last_active_at)| {
              if now.duration_since(*last_active_at) >= manager.session_timeout {
                Some(session_id.clone())
              } else {
                None
              }
            })
            .collect::<Vec<_>>()
        };

        for session_id in stale_sessions {
          if let Err(err) = manager.close_session(&session_id).await {
            tracing::warn!(session_id = session_id.as_ref(), error = %err, "mcp session cleanup failed");
          }
        }
      }
    });
  }

  async fn touch(
    &self,
    session_id: &SessionId,
  ) {
    self.last_active.write().await.insert(session_id.clone(), Instant::now());
    if let Err(err) = self.session_store.touch(session_id.as_ref()).await {
      tracing::warn!(session_id = session_id.as_ref(), error = %err, "mcp session store touch failed");
    }
  }

  async fn forget(
    &self,
    session_id: &SessionId,
  ) {
    self.last_active.write().await.remove(session_id);
    if let Err(err) = self.session_store.purge(session_id.as_ref()).await {
      tracing::warn!(session_id = session_id.as_ref(), error = %err, "mcp session store purge failed");
    }
  }
}

impl SessionManager for McpSessionManager {
  type Error = std::io::Error;
  type Transport = WorkerTransport<LocalSessionWorker>;

  async fn create_session(
    &self,
  ) -> std::result::Result<(SessionId, Self::Transport), Self::Error> {
    let (session_id, transport) = self.inner.create_session().await
      .map_err(local_session_error)?;
    self.last_active.write().await.insert(session_id.clone(), Instant::now());
    Ok((session_id, transport))
  }

  async fn initialize_session(
    &self,
    session_id: &SessionId,
    message: ClientJsonRpcMessage,
  ) -> std::result::Result<ServerJsonRpcMessage, Self::Error> {
    self.touch(session_id).await;
    self.inner.initialize_session(session_id, message).await
      .map_err(local_session_error)
  }

  async fn has_session(
    &self,
    session_id: &SessionId,
  ) -> std::result::Result<bool, Self::Error> {
    let ret = self.inner.has_session(session_id).await
      .map_err(local_session_error)?;
    if ret {
      self.touch(session_id).await;
    }
    Ok(ret)
  }

  async fn close_session(
    &self,
    session_id: &SessionId,
  ) -> std::result::Result<(), Self::Error> {
    self.forget(session_id).await;
    self.inner.close_session(session_id).await
      .map_err(local_session_error)
  }

  async fn create_stream(
    &self,
    session_id: &SessionId,
    message: ClientJsonRpcMessage,
  ) -> std::result::Result<impl Stream<Item = ServerSseMessage> + Send + 'static, Self::Error> {
    self.touch(session_id).await;
    self.inner.create_stream(session_id, message).await
      .map_err(local_session_error)
  }

  async fn accept_message(
    &self,
    session_id: &SessionId,
    message: ClientJsonRpcMessage,
  ) -> std::result::Result<(), Self::Error> {
    self.touch(session_id).await;
    self.inner.accept_message(session_id, message).await
      .map_err(local_session_error)
  }

  async fn create_standalone_stream(
    &self,
    session_id: &SessionId,
  ) -> std::result::Result<impl Stream<Item = ServerSseMessage> + Send + 'static, Self::Error> {
    self.touch(session_id).await;
    self.inner.create_standalone_stream(session_id).await
      .map_err(local_session_error)
  }

  async fn resume(
    &self,
    session_id: &SessionId,
    last_event_id: String,
  ) -> std::result::Result<impl Stream<Item = ServerSseMessage> + Send + 'static, Self::Error> {
    self.touch(session_id).await;
    self.inner.resume(session_id, last_event_id).await
      .map_err(local_session_error)
  }

  async fn restore_session(
    &self,
    session_id: SessionId,
  ) -> std::result::Result<RestoreOutcome<Self::Transport>, Self::Error> {
    let ret = self.inner.restore_session(session_id.clone()).await
      .map_err(local_session_error)?;
    if !matches!(ret, RestoreOutcome::NotSupported) {
      self.touch(&session_id).await;
    }
    Ok(ret)
  }

  fn event_store(&self) -> Option<Arc<dyn EventStore>> {
    self.inner.event_store()
  }
}

impl ServerHandler for McpServer {
  fn get_info(&self) -> ServerConfig {
    let server_name = env::var("server_title")
      .unwrap_or_else(|_| "pms".to_owned());

    ServerConfig::new(ServerCapabilities::builder().enable_tools().build())
      .with_server_info(Implementation::new(format!("{server_name}-mcp"), env!("CARGO_PKG_VERSION")))
      .with_instructions(INSTRUCTIONS)
  }

  async fn list_tools(
    &self,
    _request: Option<PaginatedRequestParams>,
    _context: RequestContext<RoleServer>,
  ) -> std::result::Result<ListToolsResult, ErrorData> {
    Ok(ListToolsResult {
      tools: tool_definitions(),
      ..Default::default()
    })
  }

  fn get_tool(
    &self,
    name: &str,
  ) -> Option<Tool> {
    tool_definitions().into_iter()
      .find(|tool| tool.name.as_ref() == name)
  }

  async fn call_tool(
    &self,
    request: CallToolRequestParams,
    context: RequestContext<RoleServer>,
  ) -> std::result::Result<CallToolResponse, ErrorData> {
    let auth = auth_context_from_request_context(&context).await
      .map_err(|err| ErrorData::internal_error(err.to_string(), None))?;

    Ctx::test_builder()
      .with_auth_model(auth.auth_model.clone())
      .map_err(|err| ErrorData::internal_error(err.to_string(), None))?
      .build()
      .scope(async {
        _call_tool(self, &auth, request).await.map_err(|err| eyre!(err.to_string()))
      }).await.map_err(|err| ErrorData::internal_error(err.to_string(), None))
  }
}

async fn _call_tool(
  this: &McpServer,
  auth: &McpAuthContext,
  request: CallToolRequestParams,
) -> std::result::Result<CallToolResponse, ErrorData> {
  match request.name.as_ref() {
    "session_me" => Ok(this.session_me(auth).await),
    "schema_search" => Ok(this.schema_search(request.arguments).await),
    "schema_get" => Ok(this.schema_get(request.arguments).await),
    "graphql_execute" => Ok(this.graphql_execute(auth, request.arguments).await),
    "oss_upload" => Ok(this.oss_upload(auth, request.arguments).await),
    "oss_download_url" => Ok(this.oss_download_url(auth, request.arguments).await),
    "oss_image_url" => Ok(this.oss_image_url(auth, request.arguments).await),
    _ => Ok(tool_error_response(format!("tool '{}' not found", request.name), None)),
  }
}

impl McpServer {
  async fn session_me(
    &self,
    auth: &McpAuthContext,
  ) -> CallToolResponse {
    let builder = match Ctx::test_builder().with_auth_model(auth.auth_model.clone()) {
      Ok(builder) => builder,
      Err(err) => return tool_error_response(err.to_string(), None),
    };

    match builder
      .build()
      .scope({
        usr_service::get_login_info()
      }).await {
      Ok(login_info) => tool_success_response(json!({
        "loginInfo": login_info,
        "authModel": auth.auth_model,
        "serverTokenTimeoutSeconds": get_server_tokentimeout(),
      })),
      Err(err) => tool_error_response(err.to_string(), None),
    }
  }

  async fn graphql_execute(
    &self,
    auth: &McpAuthContext,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpGraphqlInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };
    if input.query.trim().is_empty() {
      return tool_error_response("query 不能为空".to_owned(), None);
    }

    if let Some(fields) = find_all_fields_missing_page(
      &input.query,
      input.operation_name.as_deref(),
    ) {
      return tool_error_response(
        "已拦截：顶层 findAll* 必须显式传 page。".to_owned(),
        Some(json!({
          "fields": fields,
          "action": "先查对应 findCount*，再为每个 findAll* 传 page: { pgOffset, pgSize, isResultLimit: true }。",
        })),
      );
    }

    let page_guards = collect_top_level_find_all_page_guards(
      &input.query,
      input.operation_name.as_deref(),
      input.variables.as_ref(),
    );

    let authorization = match current_authorization_token(&auth.auth_model) {
      Ok(token) => token,
      Err(err) => return tool_error_response(err.to_string(), None),
    };

    let mut gql_req = GraphqlRequest::new(input.query);
    gql_req = gql_req.data::<AuthToken>(authorization);
    gql_req = gql_req.data::<Ip>(Ip(auth.real_ip.clone()));

    if let Some(operation_name) = input.operation_name {
      gql_req = gql_req.operation_name(operation_name);
    }

    if let Some(client_tenant_id) = input.client_tenant_id {
      gql_req = gql_req.data::<ClientTenantId>(client_tenant_id);
    }

    if let Some(variables) = input.variables {
      gql_req = gql_req.variables(Variables::from_json(variables));
    }

    let gql_response = self.schema.execute(gql_req).await;
    let response_headers = header_map_to_json(&gql_response.http_headers);
    let data = serde_json::to_value(&gql_response.data)
      .unwrap_or(Value::Null);
    let errors = serde_json::to_value(&gql_response.errors)
      .unwrap_or_else(|_| json!([]));
    let extensions = serde_json::to_value(&gql_response.extensions)
      .unwrap_or(Value::Null);
    let has_errors = gql_response.is_err();

    let payload = build_graphql_execute_payload(
      data,
      errors,
      extensions,
      response_headers,
      has_errors,
      &page_guards,
    );

    if has_errors {
      tool_error_response("GraphQL 执行返回错误".to_owned(), Some(payload))
    } else {
      tool_success_response(payload)
    }
  }

  async fn schema_search(
    &self,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpSchemaSearchInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };

    match schema_search::search_schema(&self.schema, input) {
      Ok(payload) => tool_success_response(payload),
      Err(err) => tool_error_response(err.to_string(), None),
    }
  }

  async fn schema_get(
    &self,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpSchemaGetInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };

    match schema_search::get_schema(&self.schema, input) {
      Ok(payload) => tool_success_response(payload),
      Err(err) => tool_error_response(err.to_string(), None),
    }
  }

  async fn oss_upload(
    &self,
    auth: &McpAuthContext,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpOssUploadInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };
    if input.filename.trim().is_empty() {
      return tool_error_response("filename 不能为空".to_owned(), None);
    }
    if input.content_base64.trim().is_empty() {
      return tool_error_response("contentBase64 不能为空".to_owned(), None);
    }

    let content = match general_purpose::STANDARD.decode(input.content_base64.as_bytes()) {
      Ok(content) => content,
      Err(err) => return tool_error_response(format!("contentBase64 解析失败: {err}"), None),
    };

    let is_public = input.is_public.unwrap_or(false);
    let id = input.id.unwrap_or_else(|| id_to_string(&get_short_uuid()));
    let content_type = input.content_type
      .unwrap_or_else(|| "application/octet-stream".to_owned());
    let tenant_id = if is_public {
      None
    } else {
      Some(auth.auth_model.tenant_id)
    };

    match oss_service::put_object(
      id.as_str(),
      &content,
      &content_type,
      &input.filename,
      Some(if is_public { "1" } else { "0" }),
      tenant_id,
      input.db.as_deref(),
      Some(id.as_str()),
    ).await {
      Ok(_) => {
        let authorization = match current_authorization_token(&auth.auth_model) {
          Ok(token) => token,
          Err(err) => return tool_error_response(err.to_string(), None),
        };
        let download = build_download_url(
          &auth.request_origin,
          &authorization,
          &id,
          Some(input.filename.clone()),
          Some("0".to_owned()),
        );
        let image = build_image_url(
          &auth.request_origin,
          &authorization,
          &id,
          Some(input.filename),
          None,
          None,
          None,
          None,
          Some("1".to_owned()),
        );
        tool_success_response(json!({
          "id": id,
          "download": download,
          "image": image,
          "contentType": content_type,
          "bytes": content.len(),
          "isPublic": is_public,
        }))
      },
      Err(err) => tool_error_response(err.to_string(), None),
    }
  }

  async fn oss_download_url(
    &self,
    auth: &McpAuthContext,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpOssDownloadUrlInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };
    if input.id.trim().is_empty() {
      return tool_error_response("id 不能为空".to_owned(), None);
    }
    let authorization = match current_authorization_token(&auth.auth_model) {
      Ok(token) => token,
      Err(err) => return tool_error_response(err.to_string(), None),
    };
    tool_success_response(build_download_url(
      &auth.request_origin,
      &authorization,
      &input.id,
      input.filename,
      input.inline,
    ))
  }

  async fn oss_image_url(
    &self,
    auth: &McpAuthContext,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpOssImageUrlInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };
    if input.id.trim().is_empty() {
      return tool_error_response("id 不能为空".to_owned(), None);
    }
    let authorization = match current_authorization_token(&auth.auth_model) {
      Ok(token) => token,
      Err(err) => return tool_error_response(err.to_string(), None),
    };
    tool_success_response(build_image_url(
      &auth.request_origin,
      &authorization,
      &input.id,
      input.filename,
      input.format,
      input.width,
      input.height,
      input.quality,
      input.inline,
    ))
  }
}

async fn handle_mcp(
  req: Request,
) -> Response {
  if let Err(response) = validate_mcp_authorization(&req).await {
    return *response;
  }

  let origin = req.header("origin")
    .map(str::to_owned);
  let schema = match req.data::<crate::QuerySchema>() {
    Some(schema) => schema.clone(),
    None => {
      let mut response = Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body("MCP schema not found in request data");
      mcp_service::inject_cors_headers_with_origin(&mut response, origin.as_deref());
      return response;
    },
  };
  let http_response = mcp_http_service(schema)
    .handle(req.into())
    .await;
  let (parts, body) = http_response.into_parts();
  let body = body
    .map_frame(|frame| frame.map_data(Into::into))
    .map_err(std::io::Error::other)
    .boxed();
  let mut response = Response::from_parts(
    ResponseParts {
      status: parts.status,
      version: parts.version,
      headers: parts.headers,
      extensions: parts.extensions,
    },
    Body::from(body),
  );
  mcp_service::inject_cors_headers_with_origin(&mut response, origin.as_deref());
  response
}

fn mcp_http_service(
  schema: crate::QuerySchema,
) -> &'static Arc<McpHttpService> {
  MCP_HTTP_SERVICE.get_or_init(|| {
    let session_store = Arc::new(RmcpSessionStore::new());
    let session_manager = McpSessionManager::new(session_store.clone());
    Arc::new(build_mcp_http_service(schema, session_manager, session_store))
  })
}

fn build_mcp_http_service(
  schema: crate::QuerySchema,
  session_manager: Arc<McpSessionManager>,
  session_store: Arc<RmcpSessionStore>,
) -> McpHttpService {
  let mut config = StreamableHttpServerConfig::default()
    .with_legacy_session_mode(true);
  config = apply_host_origin_policy(config);

  let session_store_trait: Arc<dyn SessionStore + Send + Sync + 'static> = session_store.clone();
  config.session_store = Some(session_store_trait);

  StreamableHttpService::new(
    move || Ok(McpServer {
      schema: schema.clone(),
    }),
    session_manager,
    config,
  )
}

fn apply_host_origin_policy(
  config: StreamableHttpServerConfig,
) -> StreamableHttpServerConfig {
  let config = match env_list("mcp_allowed_hosts") {
    Some(hosts) if !hosts.is_empty() => config.with_allowed_hosts(hosts),
    _ => config.disable_allowed_hosts(),
  };
  match env_list("mcp_allowed_origins") {
    Some(origins) if !origins.is_empty() => config.with_allowed_origins(origins),
    _ => config.disable_allowed_origins(),
  }
}

fn env_list(
  key: &str,
) -> Option<Vec<String>> {
  let value = env::var(key).ok()?;
  let values = value.split(',')
    .map(|item| item.trim().to_owned())
    .filter(|item| !item.is_empty())
    .collect::<Vec<_>>();
  Some(values)
}

async fn validate_mcp_authorization(
  req: &Request,
) -> std::result::Result<(), Box<Response>> {
  match mcp_service::auth_model_from_authorization_header(req.header(AUTHORIZATION)).await {
    Ok(_) => Ok(()),
    Err(err) => Err(Box::new(mcp_service::auth_error_response(req, None, err.to_string()))),
  }
}

async fn auth_context_from_request_context(
  context: &RequestContext<RoleServer>,
) -> Result<McpAuthContext> {
  let parts = context.extensions.get::<http::request::Parts>()
    .ok_or_else(|| eyre!("mcp_missing_http_parts"))?;
  let auth_model = mcp_service::auth_model_from_authorization_header(
    parts.headers.get(AUTHORIZATION)
      .and_then(|value| value.to_str().ok()),
  ).await?;

  Ok(McpAuthContext {
    auth_model,
    request_origin: mcp_service::request_origin_from_headers(&parts.headers),
    real_ip: mcp_service::real_ip_from_headers(&parts.headers),
  })
}

fn local_session_error(
  err: impl std::fmt::Display,
) -> std::io::Error {
  std::io::Error::other(err.to_string())
}

fn current_authorization_token(
  auth_model: &AuthModel,
) -> Result<String> {
  let mut auth_model = auth_model.clone();
  let now_sec = get_now().and_utc().timestamp_millis() / 1000;
  auth_model.exp = now_sec + get_server_tokentimeout();
  get_token_by_auth_model(&auth_model)
}

fn parse_arguments<T>(
  arguments: Option<JsonObject>,
) -> Result<T>
where
  T: DeserializeOwned,
{
  serde_json::from_value(Value::Object(arguments.unwrap_or_default()))
    .map_err(|err| eyre!(format!("参数解析失败: {err}")))
}

fn tool_definitions() -> Vec<Tool> {
  vec![
    Tool::new(
      "session_me",
      "返回当前 MCP 请求绑定的登录用户、租户和 token 过期信息。",
      schema_object(json!({
        "type": "object",
        "properties": {},
      })),
    ),
    Tool::new(
      "schema_search",
      "搜索当前服务的 GraphQL schema，优先用于定位 Query、Mutation、Input、返回类型和字段签名，避免先拉整份 introspection；搜索结果会过滤 AI 无用的 Ok 冗余接口与字段注释接口。遇到 findAll* 时务必显式传 page，最好先查 findCount*。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "keyword": {
            "type": "string",
            "description": "关键字，可按中文注释、字段名、类型名、Query、Mutation 搜索"
          },
          "kind": {
            "type": "string",
            "enum": ["type", "input", "enum", "scalar", "interface", "union", "directive", "schema", "object"],
            "description": "可选类型过滤；object 会映射为 type"
          },
          "scope": {
            "type": "string",
            "enum": ["all", "definition", "member", "field"],
            "description": "definition 表示类型定义，member/field 表示字段或 enum 成员"
          },
          "limit": {
            "type": "integer",
            "description": "最多返回多少条，默认 8，最大 20"
          },
          "includeSdl": {
            "type": "boolean",
            "description": "是否把匹配项对应的 SDL 片段放回结果；完整类型定义请优先改用 schema_get"
          }
        },
        "required": ["keyword"],
      })),
    ),
    Tool::new(
      "schema_get",
      "按类型名精确返回完整 SDL，适合在 schema_search 定位到类型名后查看具体 Input、Model 等定义；过大的聚合类型会直接拒绝返回。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "精确类型名，例如 Query、Mutation、PageInput、ClientCheckinModel"
          },
          "kind": {
            "type": "string",
            "enum": ["type", "input", "enum", "scalar", "interface", "union", "directive", "schema", "object"],
            "description": "可选类型过滤；object 会映射为 type"
          }
        },
        "required": ["name"],
      })),
    ),
    Tool::new(
      "graphql_execute",
      "直接在 rust 进程内执行 GraphQL query 或 mutation，用于调试后端接口。顶层 findAll* 缺 page 会被直接拒绝；pgSize 缺省按 20，超过 2000 自动降到 2000。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "完整的 GraphQL 查询或 mutation 文本"
          },
          "variables": {
            "type": "object",
            "description": "GraphQL variables"
          },
          "operationName": {
            "type": "string",
            "description": "可选 operationName"
          },
          "clientTenantId": {
            "type": "string",
            "description": "可选 client_tenant_id，只有需要覆盖当前租户上下文时才传"
          }
        },
        "required": ["query"],
      })),
    ),
    Tool::new(
      "oss_upload",
      "把 base64 内容上传到现有 OSS 附件体系，返回附件 id 和可用 URL。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "filename": { "type": "string" },
          "contentBase64": { "type": "string" },
          "contentType": { "type": "string" },
          "isPublic": { "type": "boolean" },
          "db": { "type": "string" },
          "id": { "type": "string" }
        },
        "required": ["filename", "contentBase64"],
      })),
    ),
    Tool::new(
      "oss_download_url",
      "生成带 authorization 参数的附件下载 URL。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "filename": { "type": "string" },
          "inline": {
            "type": "string",
            "enum": ["0", "1"]
          }
        },
        "required": ["id"],
      })),
    ),
    Tool::new(
      "oss_image_url",
      "生成带 authorization 参数的图片预览 URL，并支持宽高与质量参数。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "filename": { "type": "string" },
          "inline": {
            "type": "string",
            "enum": ["0", "1"]
          },
          "format": {
            "type": "string",
            "enum": ["webp", "png", "jpeg", "jpg"]
          },
          "width": { "type": "integer" },
          "height": { "type": "integer" },
          "quality": { "type": "integer" }
        },
        "required": ["id"],
      })),
    ),
  ]
}

fn schema_object(
  value: Value,
) -> Arc<JsonObject> {
  Arc::new(value.as_object().cloned().unwrap_or_default())
}

fn tool_success_response(
  payload: Value,
) -> CallToolResponse {
  CallToolResult::structured(payload).into()
}

fn build_graphql_execute_payload(
  data: Value,
  errors: Value,
  extensions: Value,
  response_headers: Value,
  has_errors: bool,
  page_guards: &[GraphqlExecutePageGuard],
) -> Value {
  let mut payload = Map::new();

  if !has_errors || !data.is_null() {
    payload.insert("data".to_owned(), data);
  }
  if has_errors || !is_empty_json_array(&errors) {
    payload.insert("errors".to_owned(), errors);
  }
  if !is_empty_json_object(&extensions) {
    payload.insert("extensions".to_owned(), extensions);
  }
  if !is_empty_json_object(&response_headers) {
    payload.insert("responseHeaders".to_owned(), response_headers);
  }
  if !page_guards.is_empty() {
    if page_guards.iter().any(|item| item.page_size_capped) {
      payload.insert("pageSizeCapped".to_owned(), Value::Bool(true));
    }
    if page_guards.iter().any(|item| item.page_size_defaulted) {
      payload.insert("pageSizeDefaulted".to_owned(), Value::Bool(true));
    }
    payload.insert("pageGuards".to_owned(), json!(page_guards));
  }

  Value::Object(payload)
}

fn find_all_fields_missing_page(
  query: &str,
  operation_name: Option<&str>,
) -> Option<Vec<String>> {
  let document = parse_query(query).ok()?;
  let operation = target_operation(&document, operation_name)?;
  let mut fields = Vec::new();
  collect_find_all_fields_missing_page(
    &operation.node.selection_set.node,
    &mut fields,
  );
  (!fields.is_empty()).then_some(fields)
}

fn target_operation<'a>(
  document: &'a ExecutableDocument,
  operation_name: Option<&str>,
) -> Option<&'a async_graphql::Positioned<OperationDefinition>> {
  match (&document.operations, operation_name) {
    (DocumentOperations::Single(operation), _) => Some(operation),
    (DocumentOperations::Multiple(operations), Some(operation_name)) => operations.iter()
      .find(|(name, _)| name.as_str() == operation_name)
      .map(|(_, operation)| operation),
    (DocumentOperations::Multiple(_), None) => None,
  }
}

fn collect_find_all_fields_missing_page(
  selection_set: &SelectionSet,
  fields: &mut Vec<String>,
) {
  for selection in &selection_set.items {
    let Selection::Field(field) = &selection.node else {
      continue;
    };
    let field_name = field.node.name.node.to_string();
    if !field_name.starts_with("findAll") {
      continue;
    }
    if field.node.arguments.iter().any(|(name, _)| name.node.as_str() == "page") {
      continue;
    }
    fields.push(field_name);
  }
}

fn collect_top_level_find_all_page_guards(
  query: &str,
  operation_name: Option<&str>,
  variables: Option<&Value>,
) -> Vec<GraphqlExecutePageGuard> {
  let Ok(document) = parse_query(query) else {
    return Vec::new();
  };
  let Some(operation) = target_operation(&document, operation_name) else {
    return Vec::new();
  };

  let mut guards = Vec::new();
  for selection in &operation.node.selection_set.node.items {
    let Selection::Field(field) = &selection.node else {
      continue;
    };
    let field_name = field.node.name.node.to_string();
    if !field_name.starts_with("findAll") {
      continue;
    }
    let page_argument = field.node.arguments.iter()
      .find(|(name, _)| name.node.as_str() == "page")
      .map(|(_, value)| value.node.to_string());
    let Some(page_argument) = page_argument else {
      continue;
    };
    let requested_pg_size = extract_requested_pg_size_from_page_argument(
      &page_argument,
      variables,
    );
    let normalized = normalize_page_query_values(None, requested_pg_size);
    if !normalized.pg_size_capped && !normalized.pg_size_defaulted {
      continue;
    }
    guards.push(GraphqlExecutePageGuard {
      field: field_name,
      requested_pg_size,
      applied_pg_size: normalized.pg_size,
      page_size_capped: normalized.pg_size_capped,
      page_size_defaulted: normalized.pg_size_defaulted,
    });
  }

  guards
}

fn extract_requested_pg_size_from_page_argument(
  page_argument: &str,
  variables: Option<&Value>,
) -> Option<i64> {
  let page_argument = page_argument.trim();
  if let Some(variable_name) = page_argument.strip_prefix('$') {
    return variables
      .and_then(Value::as_object)
      .and_then(|variables| variables.get(variable_name.trim()))
      .and_then(extract_requested_pg_size_from_json_page);
  }
  extract_requested_pg_size_from_inline_page(page_argument)
}

fn extract_requested_pg_size_from_json_page(
  value: &Value,
) -> Option<i64> {
  value.as_object()
    .and_then(|page| page.get("pgSize"))
    .and_then(Value::as_i64)
}

fn extract_requested_pg_size_from_inline_page(
  page_argument: &str,
) -> Option<i64> {
  extract_named_i64_from_literal(page_argument, "pgSize")
}

fn extract_named_i64_from_literal(
  raw: &str,
  key: &str,
) -> Option<i64> {
  let key_index = raw.find(key)?;
  let raw = &raw[key_index + key.len()..];
  let colon_index = raw.find(':')?;
  let raw = raw[colon_index + 1..].trim_start();
  let end_index = raw.find(|ch: char| ch == ',' || ch == '}' || ch.is_whitespace())
    .unwrap_or(raw.len());
  raw[..end_index].trim().parse::<i64>().ok()
}

fn is_empty_json_array(
  value: &Value,
) -> bool {
  value.as_array().is_some_and(|array| array.is_empty())
}

fn is_empty_json_object(
  value: &Value,
) -> bool {
  value.is_null() || value.as_object().is_some_and(|object| object.is_empty())
}

fn tool_error_response(
  message: String,
  data: Option<Value>,
) -> CallToolResponse {
  let payload = if let Some(data) = data {
    json!({
      "message": message,
      "data": data,
    })
  } else {
    json!({
      "message": message,
    })
  };
  CallToolResult::structured_error(payload).into()
}

fn build_download_url(
  origin: &str,
  authorization: &str,
  id: &str,
  filename: Option<String>,
  inline: Option<String>,
) -> Value {
  let filename_for_path = filename.clone().unwrap_or_default();
  let path = if filename_for_path.is_empty() {
    "/api/oss/download/".to_owned()
  } else {
    format!(
      "/api/oss/download/{}",
      urlencoding::encode(&filename_for_path),
    )
  };
  let mut query_params = Vec::<String>::new();
  query_params.push(format!("id={}", urlencoding::encode(id)));
  if let Some(filename) = filename {
    query_params.push(format!("filename={}", urlencoding::encode(&filename)));
  }
  if let Some(inline) = inline {
    query_params.push(format!("inline={}", urlencoding::encode(&inline)));
  }
  if !authorization.is_empty() {
    query_params.push(format!("authorization={}", urlencoding::encode(authorization)));
  }
  let relative_url = format!("{path}?{}", query_params.join("&"));
  json!({
    "path": path,
    "url": format!("{origin}{relative_url}"),
    "relativeUrl": relative_url,
  })
}

#[allow(clippy::too_many_arguments)]
fn build_image_url(
  origin: &str,
  authorization: &str,
  id: &str,
  filename: Option<String>,
  format: Option<String>,
  width: Option<u32>,
  height: Option<u32>,
  quality: Option<u8>,
  inline: Option<String>,
) -> Value {
  let mut query_params = Vec::<String>::new();
  query_params.push(format!("id={}", urlencoding::encode(id)));
  if let Some(filename) = filename {
    query_params.push(format!("filename={}", urlencoding::encode(&filename)));
  }
  if let Some(inline) = inline {
    query_params.push(format!("inline={}", urlencoding::encode(&inline)));
  }
  if let Some(format) = format {
    query_params.push(format!("f={}", urlencoding::encode(&format)));
  }
  if let Some(width) = width {
    query_params.push(format!("w={width}"));
  }
  if let Some(height) = height {
    query_params.push(format!("h={height}"));
  }
  if let Some(quality) = quality {
    query_params.push(format!("q={quality}"));
  }
  if !authorization.is_empty() {
    query_params.push(format!("authorization={}", urlencoding::encode(authorization)));
  }
  let path = "/api/oss/img".to_owned();
  let relative_url = format!("{path}?{}", query_params.join("&"));
  json!({
    "path": path,
    "url": format!("{origin}{relative_url}"),
    "relativeUrl": relative_url,
  })
}

fn header_map_to_json(
  headers: &http::HeaderMap,
) -> Value {
  let mut ret = Map::<String, Value>::new();
  for (key, value) in headers {
    if let Ok(value) = value.to_str() {
      ret.insert(key.to_string(), Value::String(value.to_owned()));
    }
  }
  Value::Object(ret)
}