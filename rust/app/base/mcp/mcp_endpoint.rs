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
  naive_local_timestamp,
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
  McpRestCallInput,
  McpSchemaGetInput,
  McpSchemaSearchInput,
  McpOssUploadInput,
};
use super::mcp_service;
use super::rest_search;
use super::rmcp_session_store::RmcpSessionStore;
use super::schema_search;

const INSTRUCTIONS: &str = "这是内嵌在 rust 后端里的 MCP 调试入口。先调用 session_me 确认当前登录态；如果不清楚 GraphQL 的 Query、Mutation、Input 或返回类型，先用 schema_search 搜索 schema；如果已经定位到精确类型名，再用 schema_get 查看完整 SDL；过大的聚合类型不会直接返回；最后再用 graphql_execute 调试业务接口。非 GraphQL 的 HTTP 接口由 openapi 规范描述，先用 schema_search 且 source=rest 找到 method 和 path，再用 rest_call 调用。对任何 findAll* 查询，都要显式传 page；缺 page 会被直接拒绝，pgSize 缺省按 20，超过 2000 自动降到 2000。附件上传走 oss_upload，下载和图片预览分别用 oss_download_url / oss_image_url。标准客户端可直接走 OAuth 授权码流程；手工调试也可以先调用 POST /mcp/login，得到 authorization 后放到 Authorization: Bearer <token> 请求头里。";
const SESSION_SWEEP_INTERVAL: Duration = Duration::from_secs(5);
/// rest_call 自调用的超时时间
const MCP_REST_CALL_TIMEOUT: Duration = Duration::from_secs(30);
/// rest_call 非 JSON 响应的最大保留字符数
const MCP_REST_CALL_MAX_CHARS: usize = 4000;

type McpHttpService = StreamableHttpService<McpServer, McpSessionManager>;

static MCP_HTTP_SERVICE: OnceLock<Arc<McpHttpService>> = OnceLock::new();

/// 解析后的 openapi 索引, 规范不会变化, 只解析一次
///
/// 每次 schema_search / rest_call 都重新反序列化整份规范会随模块数量线性变慢
static REST_INDEX: OnceLock<rest_search::RestIndex> = OnceLock::new();

/// rest_call 自调用复用的 HTTP 客户端
static REST_CLIENT: OnceLock<reqwest::Client> = OnceLock::new();

#[derive(Clone)]
struct McpAuthContext {
  auth_model: AuthModel,
  request_origin: String,
  real_ip: String,
}

#[derive(Clone)]
struct McpServer {
  schema: crate::QuerySchema,
  /// 解析后的 openapi 索引, 供 rest 接口的搜索与调用使用
  rest_index: &'static rest_search::RestIndex,
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
    "rest_call" => Ok(this.rest_call(auth, request.arguments).await),
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

    let source = input.source.as_deref().unwrap_or("all").trim().to_lowercase();
    match source.as_str() {
      "rest" => match self.rest_index.search(input) {
        Ok(payload) => tool_success_response(payload),
        Err(err) => tool_error_response(err.to_string(), None),
      },
      "graphql" => match schema_search::search_schema(&self.schema, input) {
        Ok(payload) => tool_success_response(payload),
        Err(err) => tool_error_response(err.to_string(), None),
      },
      _ => self.search_all(input),
    }
  }

  /// 同时搜索 GraphQL 与 REST 接口
  fn search_all(
    &self,
    input: McpSchemaSearchInput,
  ) -> CallToolResponse {
    let limit = input.limit.unwrap_or(8).clamp(1, 20);
    let keyword = input.keyword.clone();

    // REST 接口数量少、命名规范, 命中时优先占位;
    // 否则 GraphQL 的模糊匹配很容易把 REST 结果挤掉, AI 就再也搜不到 HTTP 接口
    let rest_items = if self.rest_index.is_empty() {
      Vec::new()
    } else {
      let mut rest_input = input.clone();
      rest_input.limit = Some(limit.div_ceil(2));
      self.rest_index.search(rest_input)
        .ok()
        .and_then(|result| result.get("items").and_then(Value::as_array).cloned())
        .unwrap_or_default()
    };

    let graphql_limit = limit.saturating_sub(rest_items.len()).max(1);
    let mut graphql_input = input;
    graphql_input.limit = Some(graphql_limit);

    let mut items = rest_items;
    let mut query_tips = Vec::new();
    if let Ok(result) = schema_search::search_schema(&self.schema, graphql_input) {
      if let Some(result_items) = result.get("items").and_then(Value::as_array) {
        items.extend(result_items.iter().map(|item| {
          let mut item = item.clone();
          if let Value::Object(map) = &mut item {
            map.entry("source").or_insert_with(|| json!("graphql"));
          }
          item
        }));
      }
      if let Some(result_tips) = result.get("queryTips").and_then(Value::as_array) {
        query_tips.extend(result_tips.iter().cloned());
      }
    }
    items.truncate(limit);

    let mut payload = json!({
      "query": keyword,
      "source": "all",
      "items": items,
    });
    if !query_tips.is_empty() {
      payload["queryTips"] = Value::Array(query_tips);
    }

    tool_success_response(payload)
  }

  async fn schema_get(
    &self,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpSchemaGetInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };

    let kind = input.kind.as_deref().unwrap_or("").trim().to_lowercase();
    let is_endpoint = kind == "endpoint" || kind == "rest" || input.name.contains('/');

    if is_endpoint && !self.rest_index.is_empty() {
      return match self.rest_index.get(&input.name) {
        Ok(payload) => tool_success_response(payload),
        Err(err) => tool_error_response(err.to_string(), None),
      };
    }

    match schema_search::get_schema(&self.schema, input.clone()) {
      Ok(payload) => tool_success_response(payload),
      Err(err) => {
        if !self.rest_index.is_empty()
          && let Ok(payload) = self.rest_index.get(&input.name)
        {
          return tool_success_response(payload);
        }
        tool_error_response(err.to_string(), None)
      },
    }
  }

  /// 调用 openapi 规范里的 HTTP 接口
  async fn rest_call(
    &self,
    auth: &McpAuthContext,
    arguments: Option<JsonObject>,
  ) -> CallToolResponse {
    let input = match parse_arguments::<McpRestCallInput>(arguments) {
      Ok(input) => input,
      Err(err) => return tool_error_response(err.to_string(), None),
    };

    let path = input.path.trim().to_owned();
    if !path.starts_with('/') || path.starts_with("//") {
      return tool_error_response(
        "path 必须以 / 开头, 例如 /api/oai/system/ping".to_owned(),
        None,
      );
    }

    let method = input.method.as_deref().unwrap_or("GET").trim().to_ascii_uppercase();
    let method = match reqwest::Method::from_bytes(method.as_bytes()) {
      Ok(method) => method,
      Err(_) => return tool_error_response(format!("不支持的 method: {method}"), None),
    };

    if !self.rest_index.has_endpoint(method.as_str(), &path) {
      return tool_error_response(
        format!("{} {} 不在 openapi 规范里", method.as_str(), path),
        Some(json!({
          "action": "先用 schema_search 且 source=rest 搜到准确 path 再调用",
        })),
      );
    }

    let token = match current_authorization_token(&auth.auth_model) {
      Ok(token) => token,
      Err(err) => return tool_error_response(err.to_string(), None),
    };

    let server_port = env::var("server_port").unwrap_or_else(|_| "4001".to_owned());
    let query = input.query.and_then(|value| value.as_object().cloned());

    let mut last_error = String::new();
    let mut response = None;
    for base in rest_call_base_urls(&server_port) {
      let url = format!("{base}{path}");
      match send_rest_request(
        method.clone(),
        url,
        token.clone(),
        query.clone(),
        input.body.clone(),
      ).await {
        Ok(item) => {
          response = Some(item);
          break;
        },
        Err(err) => last_error = err,
      }
    }

    let response = match response {
      Some(response) => response,
      None => return tool_error_response(format!("请求失败: {last_error}"), None),
    };

    if !response.content_type.contains("json") {
      return tool_success_response(json!({
        "status": response.status,
        "contentType": response.content_type,
        "body": truncate_text(response.body, MCP_REST_CALL_MAX_CHARS),
      }));
    }

    match serde_json::from_str::<Value>(&response.body) {
      Ok(body) => tool_success_response(json!({
        "status": response.status,
        "body": body,
      })),
      Err(err) => tool_error_response(format!("响应解析失败: {err}"), None),
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

  let rest_index = REST_INDEX.get_or_init(|| {
    let spec = crate::oai_spec().unwrap_or_default();
    if spec.is_empty() {
      return rest_search::RestIndex::empty();
    }
    match rest_search::RestIndex::parse(spec) {
      Ok(index) => index,
      Err(err) => {
        tracing::error!(error = %err, "openapi 规范解析失败, rest 接口工具不可用");
        rest_search::RestIndex::empty()
      },
    }
  });
  
  StreamableHttpService::new(
    move || Ok(McpServer {
      schema: schema.clone(),
      rest_index,
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
  let now_sec = naive_local_timestamp(get_now());
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

struct RestCallResponse {
  status: u16,
  content_type: String,
  body: String,
}

/// rest_call 的自调用基地址
///
/// 服务的监听地址来自 `server_host`, 解析结果可能只落在 IPv4 或 IPv6 回环上,
/// 所以这里给出候选地址, 由调用方依次尝试, 避免只连一种协议导致连接失败
fn rest_call_base_urls(server_port: &str) -> Vec<String> {
  let host = env::var("server_host").unwrap_or_else(|_| "localhost".to_owned());
  let host = host.trim().trim_matches('"').to_owned();

  let mut hosts = Vec::new();
  match host.as_str() {
    "" | "localhost" => {
      hosts.push("localhost".to_owned());
      hosts.push("127.0.0.1".to_owned());
      hosts.push("[::1]".to_owned());
    },
    "0.0.0.0" => {
      hosts.push("127.0.0.1".to_owned());
      hosts.push("[::1]".to_owned());
    },
    "::" | "[::]" => {
      hosts.push("[::1]".to_owned());
      hosts.push("127.0.0.1".to_owned());
    },
    other => {
      if other.contains(':') && !other.starts_with('[') {
        hosts.push(format!("[{other}]"));
      } else {
        hosts.push(other.to_owned());
      }
    },
  }

  hosts.into_iter()
    .map(|host| format!("http://{host}:{server_port}"))
    .collect()
}

/// 复用的 HTTP 客户端
///
/// 每次 rest_call 都新建 Client 会反复建连接池, 这里只建一次
fn rest_client() -> &'static reqwest::Client {
  REST_CLIENT.get_or_init(reqwest::Client::new)
}

/// 发送 rest_call 请求
///
/// 服务本身跑在 current_thread runtime 上, 直接在同一个 runtime 里自发自收
/// 依赖协作式调度的时序假设; 放到 blocking 线程的独立 runtime 里发送, 行为是确定的
async fn send_rest_request(
  method: reqwest::Method,
  url: String,
  token: String,
  query: Option<Map<String, Value>>,
  body: Option<Value>,
) -> std::result::Result<RestCallResponse, String> {
  let client = rest_client().clone();
  tokio::task::spawn_blocking(move || {
    let runtime = tokio::runtime::Builder::new_current_thread()
      .enable_all()
      .build()
      .map_err(|err| err.to_string())?;
    runtime.block_on(async move {
      let mut request = client
        .request(method, &url)
        .header(AUTHORIZATION, &token)
        .timeout(MCP_REST_CALL_TIMEOUT);

      if let Some(query) = query {
        let pairs = query.iter()
          .filter_map(|(key, value)| {
            let value = match value {
              Value::String(value) => value.clone(),
              Value::Null => return None,
              other => other.to_string(),
            };
            Some((key.clone(), value))
          })
          .collect::<Vec<_>>();
        if !pairs.is_empty() {
          request = request.query(&pairs);
        }
      }

      if let Some(body) = body {
        request = request.json(&body);
      }

      let response = request.send().await.map_err(|err| err.to_string())?;
      let status = response.status().as_u16();
      let content_type = response.headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("")
        .to_owned();
      let body = response.text().await.map_err(|err| err.to_string())?;

      Ok(RestCallResponse {
        status,
        content_type,
        body,
      })
    })
  }).await.map_err(|err| err.to_string())?
}

#[cfg(test)]
mod tests {
  use std::time::Duration;

  use super::*;

  #[poem::handler]
  async fn ping() -> &'static str {
    "pong"
  }

  /// 服务跑在 current_thread runtime 上, 这里固化自调用不会死锁的行为
  #[tokio::test(flavor = "current_thread")]
  async fn rest_call_self_request_on_current_thread_runtime() {
    // 先占一个空闲端口, 再交给 poem 绑定
    let port = {
      let temp = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
      temp.local_addr().unwrap().port()
    };
    let listener = poem::listener::TcpListener::bind(("127.0.0.1", port));

    let app = poem::Route::new().at("/ping", poem::get(ping));
    tokio::spawn(async move {
      poem::Server::new(listener).run(app).await.ok();
    });
    tokio::time::sleep(Duration::from_millis(200)).await;

    let response = send_rest_request(
      reqwest::Method::GET,
      format!("http://127.0.0.1:{port}/ping"),
      "test-token".to_owned(),
      None,
      None,
    ).await.unwrap();

    assert_eq!(response.status, 200);
    assert_eq!(response.body, "pong");
  }
}

fn truncate_text(
  text: String,
  max_chars: usize,
) -> String {
  if text.chars().count() <= max_chars {
    return text;
  }
  let mut truncated = text.chars().take(max_chars).collect::<String>();
  truncated.push_str("...(已截断)");
  truncated
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
      "搜索当前服务的接口。默认同时搜索 GraphQL schema 和 openapi 描述的 HTTP 接口：GraphQL 用于定位 Query、Mutation、Input、返回类型和字段签名；HTTP 接口用于定位 method 和 path。搜索结果会过滤 AI 无用的 Ok 冗余接口与字段注释接口。遇到 findAll* 时务必显式传 page，最好先查 findCount*。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "keyword": {
            "type": "string",
            "description": "关键字，可按中文注释、字段名、类型名、Query、Mutation、接口路径搜索"
          },
          "source": {
            "type": "string",
            "enum": ["all", "graphql", "rest"],
            "description": "接口来源；rest 表示 openapi 里的 HTTP 接口，默认 all 同时搜索两边"
          },
          "kind": {
            "type": "string",
            "enum": ["type", "input", "enum", "scalar", "interface", "union", "directive", "schema", "object", "endpoint"],
            "description": "可选类型过滤；object 会映射为 type，endpoint 表示 HTTP 接口"
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
      "按名字精确返回完整定义。GraphQL 类型返回完整 SDL；HTTP 接口传 `GET /path` 或 path 本身，返回参数与响应 schema；过大的聚合类型会直接拒绝返回。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "精确类型名（Query、PageInput）或接口标识（GET /api/oai/system/ping）"
          },
          "kind": {
            "type": "string",
            "enum": ["type", "input", "enum", "scalar", "interface", "union", "directive", "schema", "object", "endpoint"],
            "description": "可选类型过滤；object 会映射为 type，endpoint 表示 HTTP 接口"
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
          // "clientTenantId": {
          //   "type": "string",
          //   "description": "可选 client_tenant_id，只有需要覆盖当前租户上下文时才传"
          // }
        },
        "required": ["query"],
      })),
    ),
    Tool::new(
      "rest_call",
      "调用 openapi 规范里的 HTTP 接口（非 GraphQL）。path 必须来自 schema_search(source=rest) 的结果，返回状态码和 JSON 响应体。附件上传下载请继续用 oss_* 工具。",
      schema_object(json!({
        "type": "object",
        "properties": {
          "path": {
            "type": "string",
            "description": "完整路径，例如 /api/oai/system/ping"
          },
          "method": {
            "type": "string",
            "enum": ["GET", "POST", "PUT", "DELETE", "PATCH"],
            "description": "请求方法，默认 GET"
          },
          "query": {
            "type": "object",
            "description": "query 参数，值会被转成字符串"
          },
          "body": {
            "type": "object",
            "description": "JSON 请求体"
          }
        },
        "required": ["path"],
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