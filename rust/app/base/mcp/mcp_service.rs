use std::net::IpAddr;

use base64::{Engine, engine::general_purpose};
use color_eyre::eyre::{Result, eyre};
use generated::common::auth::auth_dao::get_auth_model_by_token;
use generated::common::auth::auth_model::{AUTHORIZATION, AuthModel};
use generated::common::context::{
  Ctx,
};
use generated::common::tenant::tenant_model::GetLoginTenants;
use generated::common::tenant::tenant_service;
use generated::common::usr::usr_model::LoginInput;
use generated::common::usr::usr_service;
use poem::http::{HeaderValue, StatusCode, header};
use poem::{Request, Response};
use serde::Deserialize;
use serde_json::{Map, Value, json};
use sha2::{Digest, Sha256};

use super::mcp_model::{
  OAuthAuthorizeForm,
  OAuthAuthorizeQuery,
  OAuthRegisterInput,
  OAuthRevokeForm,
  OAuthTokenForm,
};
use super::oauth_store;

const MCP_SCOPE_TOOLS: &str = "mcp:tools";
const LEGACY_DYNAMIC_CLIENT_ID_PREFIX: &str = "mcp_client_";
const MCP_CLIENT_ID_MAX_LENGTH: usize = 256;
const VSCODE_CLIENT_METADATA_URL: &str = "https://vscode.dev/oauth/client-metadata.json";
const GENERIC_CUSTOM_SCHEME_ALLOWLIST: [&str; 2] = ["workbuddy", "cursor"];

#[derive(Clone)]
struct AuthorizeContext {
  client: oauth_store::OAuthClient,
  redirect_uri: String,
  scopes: Vec<String>,
  resource: String,
  code_challenge: String,
  state: Option<String>,
}

#[derive(Debug, Deserialize)]
struct OAuthClientMetadataDocument {
  pub client_id: String,
  pub redirect_uris: Vec<String>,
  #[serde(default)]
  pub client_name: Option<String>,
  #[serde(default)]
  pub grant_types: Vec<String>,
  #[serde(default)]
  pub response_types: Vec<String>,
  #[serde(default)]
  pub token_endpoint_auth_method: Option<String>,
  #[serde(default)]
  pub scope: Option<String>,
  #[serde(default)]
  pub client_uri: Option<String>,
}

pub async fn login(
  input: LoginInput,
  ip: String,
) -> Response {
  match usr_service::login(ip, input).await {
    Ok(model) => json_response(
      StatusCode::OK,
      serde_json::to_value(model).unwrap_or_else(|_| json!({})),
    ),
    Err(err) => json_response(
      StatusCode::UNAUTHORIZED,
      json!({
        "message": err.to_string(),
      }),
    ),
  }
}

pub fn auth_error_response(
  req: &Request,
  request_id: Option<Value>,
  err_msg: String,
) -> Response {
  let has_token = extract_bearer_token(req.header(AUTHORIZATION)).is_some();
  let (status, message) = if err_msg.contains("token_empty") {
    (StatusCode::UNAUTHORIZED, "缺少 authorization token")
  } else if err_msg.contains("refresh_token_expired")
    || err_msg.contains("token解析失败")
    || err_msg.contains("oauth_token_invalid")
    || err_msg.contains("authorization token 无效或已过期")
    || has_token
  {
    (StatusCode::UNAUTHORIZED, "authorization token 无效或已过期")
  } else {
    (StatusCode::FORBIDDEN, "当前请求无权访问 MCP")
  };
  let mut response = jsonrpc_error_response_with_req(
    Some(req),
    status,
    request_id,
    -32001,
    message,
    Some(json!({
      "detail": err_msg,
    })),
  );
  if status == StatusCode::UNAUTHORIZED
    && let Ok(value) = build_www_authenticate(req, status, &err_msg) {
      response.headers_mut().insert(header::WWW_AUTHENTICATE, value);
    }
  inject_cors_headers(&mut response, Some(req));
  response
}

pub fn internal_error_response(
  req: Option<&Request>,
  request_id: Option<Value>,
  err_msg: String,
) -> Response {
  let mut response = jsonrpc_error_response_with_req(
    req,
    StatusCode::INTERNAL_SERVER_ERROR,
    request_id,
    -32603,
    "MCP 服务内部错误",
    Some(json!({
      "detail": err_msg,
    })),
  );
  inject_cors_headers(&mut response, req);
  response
}

pub fn normalize_auth_header(response: &mut Response) {
  let current = response.headers()
    .get(AUTHORIZATION)
    .and_then(|value| value.to_str().ok())
    .map(|value| value.to_owned());
  let Some(current) = current else {
    return;
  };
  if current.eq_ignore_ascii_case("Bearer ") || current.starts_with("Bearer ") || current.starts_with("bearer ") {
    return;
  }
  if let Ok(header_value) = format!("Bearer {current}").parse::<HeaderValue>() {
    response.headers_mut().insert(AUTHORIZATION, header_value);
  }
}
pub async fn auth_model_from_authorization_header(
  authorization: Option<&str>,
) -> Result<AuthModel> {
  let Some(token) = extract_bearer_token(authorization) else {
    return Err(eyre!("token_empty"));
  };
  if oauth_store::is_oauth_access_token(&token) {
    let session = oauth_store::oauth_store()
      .find_session_by_access_token(&token)
      .await?;
    let Some(session) = session else {
      return Err(eyre!("oauth_token_invalid"));
    };
    return Ok(session.auth_model);
  }
  get_auth_model_by_token(&token)
    .map_err(|err| eyre!(err.to_string()))
}

pub async fn oauth_auth_model_from_authorization_header(
  authorization: Option<&str>,
) -> Result<Option<AuthModel>> {
  let Some(token) = extract_bearer_token(authorization) else {
    return Ok(None);
  };
  if !oauth_store::is_oauth_access_token(&token) {
    return Ok(None);
  }
  let session = oauth_store::oauth_store()
    .find_session_by_access_token(&token)
    .await?;
  Ok(session.map(|session| session.auth_model))
}

pub async fn oauth_auth_model_from_request(
  req: &Request,
) -> Result<Option<AuthModel>> {
  oauth_auth_model_from_authorization_header(req.header(AUTHORIZATION)).await
}

pub fn oauth_protected_resource_metadata(
  req: &Request,
) -> Response {
  let resource = mcp_resource_url(req);
  json_response(
    StatusCode::OK,
    json!({
      "resource": resource,
      "authorization_servers": [request_origin(req)],
      "scopes_supported": [MCP_SCOPE_TOOLS],
    }),
  )
}

pub fn oauth_authorization_server_metadata(
  req: &Request,
) -> Response {
  let origin = request_origin(req);
  json_response(
    StatusCode::OK,
    json!({
      "issuer": origin,
      "authorization_endpoint": format!("{}/authorize", request_origin(req)),
      "token_endpoint": format!("{}/token", request_origin(req)),
      "registration_endpoint": format!("{}/register", request_origin(req)),
      "revocation_endpoint": format!("{}/revoke", request_origin(req)),
      "response_types_supported": ["code"],
      "grant_types_supported": ["authorization_code", "refresh_token"],
      "token_endpoint_auth_methods_supported": ["none"],
      "code_challenge_methods_supported": ["S256"],
      "scopes_supported": [MCP_SCOPE_TOOLS],
      "client_id_metadata_document_supported": true,
    }),
  )
}

pub async fn oauth_authorize_get(
  req: &Request,
  query: OAuthAuthorizeQuery,
) -> Response {
  let ctx = match validate_authorize_query(req, &query).await {
    Ok(ctx) => ctx,
    Err(err) => return html_response(
      StatusCode::BAD_REQUEST,
      render_error_page("OAuth 授权请求无效", &err),
    ),
  };
  let tenants = load_login_tenants(req).await;
  let tenant_id = default_tenant_id(&tenants, None);
  if tenant_id.trim().is_empty() {
    return html_response(
      StatusCode::BAD_REQUEST,
      render_error_page(
        "无法继续授权",
        "当前环境没有可用的 tenant_id，无法登录 MCP。请联系管理员确认租户配置后再试。",
      ),
    );
  }
  html_response(
    StatusCode::OK,
    render_authorize_page(req, &ctx, &tenants, None, &tenant_id, ""),
  )
}

pub async fn oauth_authorize_post(
  req: &Request,
  query: OAuthAuthorizeQuery,
  form: OAuthAuthorizeForm,
) -> Response {
  let ctx = match validate_authorize_query(req, &query).await {
    Ok(ctx) => ctx,
    Err(err) => return html_response(
      StatusCode::BAD_REQUEST,
      render_error_page("OAuth 授权请求无效", &err),
    ),
  };

  if form.decision != "approve" {
    return redirect_with_params(
      &ctx.redirect_uri,
      &[("error", "access_denied"), ("error_description", "用户拒绝授权")],
      ctx.state.as_deref(),
    );
  }

  let tenants = load_login_tenants(req).await;
  let tenant_id = default_tenant_id(&tenants, form.tenant_id.as_deref());
  if tenant_id.trim().is_empty() {
    return html_response(
      StatusCode::BAD_REQUEST,
      render_authorize_page(req, &ctx, &tenants, Some("请选择或输入有效的 tenant_id，当前租户信息为空，无法登录"), "", form.username.as_str()),
    );
  }
  if form.username.trim().is_empty() || form.password.is_empty() {
    return html_response(
      StatusCode::BAD_REQUEST,
      render_authorize_page(req, &ctx, &tenants, Some("请输入完整的用户名和密码"), tenant_id.as_str(), form.username.as_str()),
    );
  }

  let ip = real_ip(req);
  let login_input = LoginInput {
    username: form.username.clone(),
    password: form.password,
    tenant_id: tenant_id.clone().into(),
    org_id: None,
  };
  let login_model = match Ctx::test_builder()
    .with_tran()
    .build()
    .scope({
      usr_service::login(ip, login_input)
    }).await {
      Ok(login_model) => login_model,
      Err(err) => {
        let err_msg = err.to_string();
        return html_response(
          StatusCode::UNAUTHORIZED,
          render_authorize_page(req, &ctx, &tenants, Some(&err_msg), tenant_id.as_str(), form.username.as_str()),
        );
      },
    };

  let auth_model = match get_auth_model_by_token(&login_model.authorization) {
    Ok(auth_model) => auth_model,
    Err(err) => {
      return html_response(
        StatusCode::INTERNAL_SERVER_ERROR,
        render_error_page("OAuth 授权失败", &format!("登录成功但无法生成授权上下文: {err}")),
      );
    },
  };

  let code = match oauth_store::oauth_store()
    .create_authorization_code(
      ctx.client.client_id.clone(),
      ctx.redirect_uri.clone(),
      ctx.code_challenge.clone(),
      ctx.scopes.clone(),
      ctx.resource.clone(),
      auth_model,
    ).await {
      Ok(code) => code,
      Err(err) => {
        return html_response(
          StatusCode::INTERNAL_SERVER_ERROR,
          render_error_page("OAuth 授权失败", &format!("授权码存储失败: {err}")),
        );
      },
    };

  redirect_with_params(
    &ctx.redirect_uri,
    &[("code", code.code.as_str())],
    ctx.state.as_deref(),
  )
}

pub async fn oauth_token(
  req: &Request,
  form: OAuthTokenForm,
) -> Response {
  let _ = req;
  match form.grant_type.as_str() {
    "authorization_code" => oauth_token_authorization_code(form).await,
    "refresh_token" => oauth_token_refresh(form).await,
    _ => oauth_token_error_response(
      StatusCode::BAD_REQUEST,
      "unsupported_grant_type",
      "仅支持 authorization_code 和 refresh_token",
    ),
  }
}

pub async fn oauth_register(
  _req: &Request,
  input: OAuthRegisterInput,
) -> Response {
  tracing::info!(
    request_body = %serde_json::to_string(&input).unwrap_or_else(|_| "serialize_failed".to_owned()),
    "oauth_register received"
  );
  if input.redirect_uris.is_empty() {
    return oauth_token_error_response(
      StatusCode::BAD_REQUEST,
      "invalid_client_metadata",
      "redirect_uris 不能为空",
    );
  }
  if input.token_endpoint_auth_method.as_deref().unwrap_or("none") != "none" {
    return oauth_token_error_response(
      StatusCode::BAD_REQUEST,
      "invalid_client_metadata",
      "当前只支持 token_endpoint_auth_method=none 的公开客户端",
    );
  }
  if let Some(grant_types) = input.grant_types.as_ref()
    && grant_types.iter().any(|item| item != "authorization_code" && item != "refresh_token") {
      return oauth_token_error_response(
        StatusCode::BAD_REQUEST,
        "invalid_client_metadata",
        "grant_types 仅支持 authorization_code 和 refresh_token",
      );
    }
  if let Some(response_types) = input.response_types.as_ref()
    && response_types.iter().any(|item| item != "code") {
      return oauth_token_error_response(
        StatusCode::BAD_REQUEST,
        "invalid_client_metadata",
        "response_types 仅支持 code",
      );
    }

  let client = match oauth_store::oauth_store().register_client(input).await {
    Ok(client) => client,
    Err(err) => {
      return oauth_token_error_response(
        StatusCode::INTERNAL_SERVER_ERROR,
        "server_error",
        &format!("client 存储失败: {err}"),
      );
    },
  };

  let response_body = client_registration_json(&client);
  tracing::info!(status = 201, response_body = %response_body, "oauth_register response");
  json_response(StatusCode::CREATED, response_body)
}

/// RFC 7591 动态注册响应体。
///
/// 可选字段为空时**必须整体省略**，不能序列化成 `null`：MCP 官方 TS SDK 拿到这份响应后
/// 会用 `OAuthClientInformationFullSchema`（Zod）严格 parse，而 Zod 的 `.optional()`
/// 只接受 `undefined`，遇到 `null` 会抛 `invalid_type`。实测部分客户端（如 VS Code）
/// 会忽略该字段、流程照走，但也有客户端（如 WorkBuddy）会在此直接中断授权且前端不报错、
/// 表现为「点击鉴权没有任何反应」。这里统一按「有值才写」构造 JSON。
fn client_registration_json(
  client: &oauth_store::OAuthClient,
) -> Value {
  let mut ret = Map::<String, Value>::new();
  ret.insert("client_id".to_owned(), json!(client.client_id));
  ret.insert("client_id_issued_at".to_owned(), json!(client.client_id_issued_at));
  ret.insert("redirect_uris".to_owned(), json!(client.redirect_uris));
  ret.insert("grant_types".to_owned(), json!(client.grant_types));
  ret.insert("response_types".to_owned(), json!(client.response_types));
  ret.insert(
    "token_endpoint_auth_method".to_owned(),
    json!(client.token_endpoint_auth_method),
  );
  if let Some(client_name) = client.client_name.as_ref() {
    ret.insert("client_name".to_owned(), json!(client_name));
  }
  if let Some(scope) = client.scope.as_ref() {
    ret.insert("scope".to_owned(), json!(scope));
  }
  if let Some(client_uri) = client.client_uri.as_ref() {
    ret.insert("client_uri".to_owned(), json!(client_uri));
  }
  Value::Object(ret)
}

pub async fn oauth_revoke(
  _req: &Request,
  form: OAuthRevokeForm,
) -> Response {
  if !form.token.trim().is_empty()
    && let Err(err) = oauth_store::oauth_store()
      .revoke_token(form.token.trim(), form.client_id.as_deref())
      .await {
      return oauth_token_error_response(
        StatusCode::INTERNAL_SERVER_ERROR,
        "server_error",
        &format!("token 撤销失败: {err}"),
      );
    }
  let mut response = Response::builder()
    .status(StatusCode::OK)
    .header(header::CACHE_CONTROL, "no-store")
    .header(header::PRAGMA, "no-cache")
    .finish();
  inject_cors_headers(&mut response, None);
  response
}

fn real_ip(req: &Request) -> String {
  real_ip_from_headers(req.headers())
}

pub fn real_ip_from_headers(
  headers: &http::HeaderMap,
) -> String {
  first_header_value(headers, "x-forwarded-for")
    .or_else(|| first_header_value(headers, "x-real-ip"))
    .unwrap_or_else(|| "127.0.0.1".to_owned())
}

pub fn request_origin(req: &Request) -> String {
  request_origin_from_headers(req.headers())
}

pub fn request_origin_from_headers(
  headers: &http::HeaderMap,
) -> String {
  let protocol = forwarded_header_value(headers, "proto")
    .or_else(|| first_header_value(headers, "x-forwarded-proto"))
    .or_else(|| first_header_value(headers, "x-forwarded-protocol"))
    .or_else(|| first_header_value(headers, "x-original-proto"))
    .unwrap_or_else(|| "http".to_owned());

  let mut host = forwarded_header_value(headers, "host")
    .or_else(|| first_header_value(headers, "x-forwarded-host"))
    .or_else(|| first_header_value(headers, "x-original-host"))
    .or_else(|| first_header_value(headers, "host"))
    .unwrap_or_else(|| "localhost".to_owned());

  if let Some(port) = first_header_value(headers, "x-forwarded-port")
    && !host.contains(':') && !host.starts_with('[') {
      host.push(':');
      host.push_str(port.trim());
    }

  if let Some(port) = first_header_value(headers, "x-original-port")
    && !host.contains(':') && !host.starts_with('[') {
      host.push(':');
      host.push_str(port.trim());
    }

  let normalized = strip_default_port(&host, &protocol);
  
  // tracing::info!("request_origin_from_headers: {protocol}://{normalized}");
  
  format!("{protocol}://{normalized}")
}

fn strip_default_port(host: &str, protocol: &str) -> String {
  let is_default_https = protocol.eq_ignore_ascii_case("https") && host.ends_with(":443");
  let is_default_http = protocol.eq_ignore_ascii_case("http") && host.ends_with(":80");
  if is_default_https || is_default_http {
    return host.trim_end_matches(':').rsplit_once(':').map_or(host.to_owned(), |(hostname, _)| hostname.to_owned());
  }
  host.to_owned()
}

fn first_header_value(
  headers: &http::HeaderMap,
  name: &str,
) -> Option<String> {
  let value = headers.get(name)?.to_str().ok()?;
  let value = value.split(',').next()?.trim();
  if value.is_empty() {
    return None;
  }
  Some(value.to_owned())
}

fn forwarded_header_value(
  headers: &http::HeaderMap,
  key: &str,
) -> Option<String> {
  let forwarded = first_header_value(headers, "forwarded")?;
  for part in forwarded.split(',') {
    for segment in part.split(';') {
      let Some((name, value)) = segment.split_once('=') else {
        continue;
      };
      if name.trim().eq_ignore_ascii_case(key) {
        let value = value.trim().trim_matches('"');
        if !value.is_empty() {
          return Some(value.to_owned());
        }
      }
    }
  }
  None
}

pub fn extract_bearer_token(
  authorization: Option<&str>,
) -> Option<String> {
  let authorization = authorization?.trim();
  if authorization.is_empty() {
    return None;
  }
  let Some((scheme, token)) = authorization.split_once(char::is_whitespace) else {
    return Some(authorization.to_owned());
  };
  if scheme.eq_ignore_ascii_case("Bearer") {
    let token = token.trim();
    if token.is_empty() {
      return None;
    }
    return Some(token.to_owned());
  }
  Some(authorization.to_owned())
}

fn jsonrpc_error_response_with_req(
  req: Option<&Request>,
  status: StatusCode,
  id: Option<Value>,
  code: i64,
  message: impl Into<String>,
  data: Option<Value>,
) -> Response {
  let mut error = json!({
    "code": code,
    "message": message.into(),
  });
  if let Some(data) = data {
    error["data"] = data;
  }
  let response = json_response(
    status,
    json!({
      "jsonrpc": "2.0",
      "id": id.unwrap_or(Value::Null),
      "error": error,
    }),
  );
  let _ = req;
  response
}

fn json_response(
  status: StatusCode,
  value: Value,
) -> Response {
  let mut response = Response::builder()
    .status(status)
    .header(header::CONTENT_TYPE, "application/json; charset=utf-8")
    .body(value.to_string());
  inject_cors_headers(&mut response, None);
  response
}

fn json_response_no_store(
  status: StatusCode,
  value: Value,
) -> Response {
  let mut response = Response::builder()
    .status(status)
    .header(header::CONTENT_TYPE, "application/json; charset=utf-8")
    .header(header::CACHE_CONTROL, "no-store")
    .header(header::PRAGMA, "no-cache")
    .body(value.to_string());
  inject_cors_headers(&mut response, None);
  response
}

fn html_response(
  status: StatusCode,
  html: String,
) -> Response {
  let mut response = Response::builder()
    .status(status)
    .header(header::CONTENT_TYPE, "text/html; charset=utf-8")
    .body(html);
  inject_cors_headers(&mut response, None);
  response
}

fn oauth_token_error_response(
  status: StatusCode,
  error: &str,
  description: &str,
) -> Response {
  tracing::warn!(%status, %error, %description, "oauth error response");
  json_response_no_store(
    status,
    json!({
      "error": error,
      "error_description": description,
    }),
  )
}

fn oauth_token_success_response(
  session: oauth_store::OAuthSession,
) -> Response {
  let now_sec = get_now_sec();
  json_response_no_store(
    StatusCode::OK,
    json!({
      "access_token": session.access_token,
      "refresh_token": session.refresh_token,
      "token_type": "Bearer",
      "expires_in": (session.access_expires_at - now_sec).max(0),
      "scope": session.scopes.join(" "),
    }),
  )
}

async fn oauth_token_authorization_code(
  form: OAuthTokenForm,
) -> Response {
  let client_id = match required_string(form.client_id.as_deref(), "client_id") {
    Ok(client_id) => client_id,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", &err),
  };
  let code = match required_string(form.code.as_deref(), "code") {
    Ok(code) => code,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_request", &err),
  };
  let redirect_uri = match required_string(form.redirect_uri.as_deref(), "redirect_uri") {
    Ok(redirect_uri) => redirect_uri,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_request", &err),
  };
  let code_verifier = match required_string(form.code_verifier.as_deref(), "code_verifier") {
    Ok(code_verifier) => code_verifier,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_request", &err),
  };

  let client = match resolve_token_client(&client_id, Some(&redirect_uri)).await {
    Ok(client) => client,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", &err),
  };
  let Some(client) = client else {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", "未知的 client_id");
  };
  if client.token_endpoint_auth_method != "none" {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", "当前只支持公开客户端");
  }

  let record = match oauth_store::oauth_store().take_authorization_code(&code).await {
    Ok(record) => record,
    Err(err) => {
      return oauth_token_error_response(
        StatusCode::INTERNAL_SERVER_ERROR,
        "server_error",
        &format!("authorization code 存储读取失败: {err}"),
      );
    },
  };
  let Some(record) = record else {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_grant", "authorization code 无效或已过期");
  };
  if record.client_id != client_id {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_grant", "authorization code 与 client_id 不匹配");
  }
  if record.redirect_uri != redirect_uri {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_grant", "redirect_uri 与授权请求不匹配");
  }
  if !verify_pkce(&code_verifier, &record.code_challenge) {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_grant", "code_verifier 校验失败");
  }
  if let Some(resource) = form.resource.as_deref()
    && resource != record.resource {
      return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_target", "resource 与授权请求不匹配");
    }
  let scopes = match requested_scopes_subset(form.scope.as_deref(), &record.scopes) {
    Ok(scopes) => scopes,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_scope", &err),
  };

  let session = match oauth_store::oauth_store()
    .create_session(
      client.client_id,
      scopes,
      record.resource,
      record.auth_model,
    ).await {
      Ok(session) => session,
      Err(err) => {
        return oauth_token_error_response(
          StatusCode::INTERNAL_SERVER_ERROR,
          "server_error",
          &format!("session 存储失败: {err}"),
        );
      },
    };
  oauth_token_success_response(session)
}

async fn oauth_token_refresh(
  form: OAuthTokenForm,
) -> Response {
  let client_id = match required_string(form.client_id.as_deref(), "client_id") {
    Ok(client_id) => client_id,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", &err),
  };
  let refresh_token = match required_string(form.refresh_token.as_deref(), "refresh_token") {
    Ok(refresh_token) => refresh_token,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_request", &err),
  };

  let client = match resolve_token_client(&client_id, None).await {
    Ok(client) => client,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", &err),
  };
  let Some(client) = client else {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", "未知的 client_id");
  };
  if client.token_endpoint_auth_method != "none" {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_client", "当前只支持公开客户端");
  }

  let session = match oauth_store::oauth_store().find_session_by_refresh_token(&refresh_token).await {
    Ok(session) => session,
    Err(err) => {
      return oauth_token_error_response(
        StatusCode::INTERNAL_SERVER_ERROR,
        "server_error",
        &format!("refresh token 存储读取失败: {err}"),
      );
    },
  };
  let Some(session) = session else {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_grant", "refresh_token 无效或已过期");
  };
  if session.client_id != client_id {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_grant", "refresh_token 与 client_id 不匹配");
  }
  if let Some(resource) = form.resource.as_deref()
    && resource != session.resource {
      return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_target", "resource 与原授权不匹配");
    }
  let scopes = match requested_scopes_subset(form.scope.as_deref(), &session.scopes) {
    Ok(scopes) => scopes,
    Err(err) => return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_scope", &err),
  };

  let rotated = match oauth_store::oauth_store()
    .rotate_session(&session.session_id, scopes, session.resource)
    .await {
      Ok(rotated) => rotated,
      Err(err) => {
        return oauth_token_error_response(
          StatusCode::INTERNAL_SERVER_ERROR,
          "server_error",
          &format!("session 刷新失败: {err}"),
        );
      },
    };
  let Some(rotated) = rotated else {
    return oauth_token_error_response(StatusCode::BAD_REQUEST, "invalid_grant", "refresh_token 已失效");
  };
  oauth_token_success_response(rotated)
}

async fn validate_authorize_query(
  req: &Request,
  query: &OAuthAuthorizeQuery,
) -> std::result::Result<AuthorizeContext, String> {
  if query.response_type != "code" {
    return Err("response_type 仅支持 code".to_owned());
  }
  if query.client_id.trim().is_empty() {
    return Err("client_id 不能为空".to_owned());
  }
  if query.redirect_uri.trim().is_empty() {
    return Err("redirect_uri 不能为空".to_owned());
  }
  let code_challenge = query.code_challenge
    .as_deref()
    .map(str::trim)
    .filter(|value| !value.is_empty())
    .ok_or_else(|| "缺少 code_challenge".to_owned())?
    .to_owned();
  if query.code_challenge_method.as_deref() != Some("S256") {
    return Err("当前仅支持 code_challenge_method=S256".to_owned());
  }

  let client = resolve_authorize_client(query).await?;
  let Some(client) = client else {
    return Err("未注册的 client_id，请先调用 /register".to_owned());
  };
  if client.token_endpoint_auth_method != "none" {
    return Err("当前仅支持公开客户端".to_owned());
  }
  if !client.grant_types.iter().any(|item| item == "authorization_code") {
    return Err("客户端未声明 authorization_code grant".to_owned());
  }
  if !client.response_types.iter().any(|item| item == "code") {
    return Err("客户端未声明 code response type".to_owned());
  }
  if !client.redirect_uris.iter().any(|item| redirect_uri_matches(query.redirect_uri.as_str(), item)) {
    return Err("redirect_uri 未注册".to_owned());
  }

  let scopes = parse_scope_values(query.scope.as_deref())?;
  let resource = resolve_resource(req, query.resource.as_deref())?;
  Ok(AuthorizeContext {
    client,
    redirect_uri: query.redirect_uri.clone(),
    scopes,
    resource,
    code_challenge,
    state: query.state.clone(),
  })
}

async fn resolve_authorize_client(
  query: &OAuthAuthorizeQuery,
) -> std::result::Result<Option<oauth_store::OAuthClient>, String> {
  let client = lookup_oauth_client(&query.client_id).await?;
  if client.is_some() {
    return Ok(client);
  }
  if let Some(client) = recover_legacy_dynamic_client(
    &query.client_id,
    &query.redirect_uri,
    query.scope.as_deref(),
  ) {
    let client = oauth_store::oauth_store()
      .ensure_client(client)
      .await
      .map_err(|err| format!("client 注册回填失败: {err}"))?;
    return Ok(Some(client));
  }
  let Some(client) = recover_dynamic_client(&query.client_id, &query.redirect_uri, query.scope.as_deref()) else {
    return Ok(None);
  };
  let client = oauth_store::oauth_store()
    .ensure_client(client)
    .await
    .map_err(|err| format!("client 注册回填失败: {err}"))?;
  Ok(Some(client))
}

async fn resolve_token_client(
  client_id: &str,
  redirect_uri: Option<&str>,
) -> std::result::Result<Option<oauth_store::OAuthClient>, String> {
  let client = lookup_oauth_client(client_id).await?;
  if client.is_some() {
    return Ok(client);
  }
  let Some(redirect_uri) = redirect_uri else {
    return Ok(None);
  };
  if let Some(client) = recover_legacy_dynamic_client(client_id, redirect_uri, None) {
    let client = oauth_store::oauth_store()
      .ensure_client(client)
      .await
      .map_err(|err| format!("client 注册回填失败: {err}"))?;
    return Ok(Some(client));
  }
  let Some(client) = recover_dynamic_client(client_id, redirect_uri, None) else {
    return Ok(None);
  };
  let client = oauth_store::oauth_store()
    .ensure_client(client)
    .await
    .map_err(|err| format!("client 注册回填失败: {err}"))?;
  Ok(Some(client))
}

async fn lookup_oauth_client(
  client_id: &str,
) -> std::result::Result<Option<oauth_store::OAuthClient>, String> {
  let client = oauth_store::oauth_store()
    .get_client(client_id)
    .await
    .map_err(|err| format!("client 存储读取失败: {err}"))?;
  if client.is_some() {
    return Ok(client);
  }
  if is_client_metadata_document_url(client_id) {
    return fetch_client_metadata_document(client_id).await.map(Some);
  }
  Ok(None)
}

async fn fetch_client_metadata_document(
  client_id: &str,
) -> std::result::Result<oauth_store::OAuthClient, String> {
  let fallback = resolve_known_client_metadata_document(client_id);

  let document = match reqwest::get(client_id).await {
    Ok(response) => {
      if !response.status().is_success() {
        if let Some(fallback) = fallback {
          fallback
        } else {
          return Err(format!("client_id metadata 获取失败: HTTP {}", response.status().as_u16()));
        }
      } else {
        response
          .json::<OAuthClientMetadataDocument>()
          .await
          .map_err(|err| format!("client_id metadata 解析失败: {err}"))?
      }
    },
    Err(err) => {
      if let Some(fallback) = fallback {
        fallback
      } else {
        return Err(format!("client_id metadata 获取失败: {err}"));
      }
    },
  };

  if document.client_id != client_id {
    return Err("client_id metadata 文档里的 client_id 与授权请求不匹配".to_owned());
  }
  if document.redirect_uris.is_empty() {
    return Err("client_id metadata 文档缺少 redirect_uris".to_owned());
  }

  Ok(oauth_store::OAuthClient {
    client_id: document.client_id,
    client_id_issued_at: get_now_sec(),
    client_name: document.client_name.filter(|item| !item.trim().is_empty()),
    redirect_uris: document.redirect_uris,
    grant_types: if document.grant_types.is_empty() {
      vec!["authorization_code".to_owned(), "refresh_token".to_owned()]
    } else {
      document.grant_types
    },
    response_types: if document.response_types.is_empty() {
      vec!["code".to_owned()]
    } else {
      document.response_types
    },
    token_endpoint_auth_method: document.token_endpoint_auth_method
      .filter(|item| !item.trim().is_empty())
      .unwrap_or_else(|| "none".to_owned()),
    scope: document.scope.filter(|item| !item.trim().is_empty()),
    client_uri: document.client_uri.filter(|item| !item.trim().is_empty()),
  })
}

fn resolve_known_client_metadata_document(
  client_id: &str,
) -> Option<OAuthClientMetadataDocument> {
  if client_id == VSCODE_CLIENT_METADATA_URL {
    return Some(OAuthClientMetadataDocument {
      client_id: VSCODE_CLIENT_METADATA_URL.to_owned(),
      redirect_uris: vec![
        "http://127.0.0.1:33418/".to_owned(),
        "https://vscode.dev/redirect".to_owned(),
      ],
      client_name: Some("Visual Studio Code".to_owned()),
      grant_types: vec![
        "authorization_code".to_owned(),
        "refresh_token".to_owned(),
        "urn:ietf:params:oauth:grant-type:device_code".to_owned(),
      ],
      response_types: vec!["code".to_owned()],
      token_endpoint_auth_method: Some("none".to_owned()),
      scope: None,
      client_uri: Some("https://vscode.dev/product".to_owned()),
    });
  }

  None
}

fn recover_dynamic_client(
  client_id: &str,
  redirect_uri: &str,
  scope: Option<&str>,
) -> Option<oauth_store::OAuthClient> {
  if !is_acceptable_client_id(client_id) || redirect_uri.trim().is_empty() {
    return None;
  }
  Some(oauth_store::OAuthClient {
    client_id: client_id.to_owned(),
    client_id_issued_at: get_now_sec(),
    client_name: Some("Recovered public client".to_owned()),
    redirect_uris: vec![redirect_uri.to_owned()],
    grant_types: vec!["authorization_code".to_owned(), "refresh_token".to_owned()],
    response_types: vec!["code".to_owned()],
    token_endpoint_auth_method: "none".to_owned(),
    scope: scope
      .map(str::trim)
      .filter(|item| !item.is_empty())
      .map(ToOwned::to_owned),
    client_uri: None,
  })
}

fn is_acceptable_client_id(
  client_id: &str,
) -> bool {
  if client_id.is_empty() || client_id.len() > MCP_CLIENT_ID_MAX_LENGTH {
    return false;
  }
  client_id.bytes().all(|byte| (0x21..=0x7E).contains(&byte))
}

fn recover_legacy_dynamic_client(
  client_id: &str,
  redirect_uri: &str,
  scope: Option<&str>,
) -> Option<oauth_store::OAuthClient> {
  if !client_id.starts_with(LEGACY_DYNAMIC_CLIENT_ID_PREFIX) {
    return None;
  }
  if !is_native_redirect_uri(redirect_uri) {
    return None;
  }
  Some(oauth_store::OAuthClient {
    client_id: client_id.to_owned(),
    client_id_issued_at: get_now_sec(),
    client_name: Some("Recovered public client".to_owned()),
    redirect_uris: vec![redirect_uri.to_owned()],
    grant_types: vec!["authorization_code".to_owned(), "refresh_token".to_owned()],
    response_types: vec!["code".to_owned()],
    token_endpoint_auth_method: "none".to_owned(),
    scope: scope
      .map(str::trim)
      .filter(|item| !item.is_empty())
      .map(ToOwned::to_owned),
    client_uri: None,
  })
}

fn is_client_metadata_document_url(
  client_id: &str,
) -> bool {
  let Ok(url) = url::Url::parse(client_id) else {
    return false;
  };
  if url.scheme() != "https" {
    return false;
  }
  if url.host_str().is_none() || url.path().is_empty() || url.path() == "/" {
    return false;
  }
  if !url.username().is_empty() || url.password().is_some() || url.fragment().is_some() {
    return false;
  }
  true
}

fn is_native_redirect_uri(
  redirect_uri: &str,
) -> bool {
  let Ok(url) = url::Url::parse(redirect_uri) else {
    return false;
  };

  if url.scheme() == "https" {
    return url.host_str().is_some() && !url.path().is_empty();
  }
  if url.scheme() == "http" {
    return url.host_str().is_some_and(is_loopback_host);
  }

  // 通用兼容策略：允许已知的自定义 scheme（如 workbuddy://...、cursor://...）
  // 作为原生应用回调，直接用已注册的 redirect_uri 进行精确匹配和后续校验。
  let scheme = url.scheme();
  if scheme.is_empty() {
    return false;
  }
  GENERIC_CUSTOM_SCHEME_ALLOWLIST.iter().any(|item| scheme.eq_ignore_ascii_case(item))
    || !url.host_str().is_none() && !url.path().is_empty()
}

fn redirect_uri_matches(
  requested: &str,
  registered: &str,
) -> bool {
  if requested == registered {
    return true;
  }

  let Ok(requested) = url::Url::parse(requested) else {
    return false;
  };
  let Ok(registered) = url::Url::parse(registered) else {
    return false;
  };

  if requested.scheme() != registered.scheme() {
    return false;
  }
  if requested.path() != registered.path() {
    return false;
  }
  if requested.query() != registered.query() {
    return false;
  }
  if requested.fragment() != registered.fragment() {
    return false;
  }
  if requested.username() != registered.username() {
    return false;
  }
  if requested.password() != registered.password() {
    return false;
  }

  let requested_host = requested.host_str();
  let registered_host = registered.host_str();

  // 自定义 scheme（如 workbuddy://...）优先按“同 scheme + 同 path/query/fragment”放行。
  // http/https 仍保留 host/port 兼容判断，以免一味放开导致非本地回调被误接受。
  if requested.scheme() != "http" && requested.scheme() != "https" {
    return true;
  }

  let Some(requested_host) = requested_host else {
    return false;
  };
  let Some(registered_host) = registered_host else {
    return false;
  };

  if requested_host.eq_ignore_ascii_case(registered_host)
    && requested.port_or_known_default() == registered.port_or_known_default() {
    return true;
  }

  is_loopback_host(requested_host)
    && is_loopback_host(registered_host)
    && requested.scheme() == "http"
    && registered.scheme() == "http"
}

fn is_loopback_host(
  host: &str,
) -> bool {
  if host.eq_ignore_ascii_case("localhost") {
    return true;
  }
  host.parse::<IpAddr>()
    .map(|ip| ip.is_loopback())
    .unwrap_or(false)
}

async fn load_login_tenants(
  req: &Request,
) -> Vec<GetLoginTenants> {
  let host = req.header("x-forwarded-host")
    .or_else(|| req.header("host"))
    .map(|value| value.to_owned())
    .unwrap_or_else(|| "localhost".to_owned());
  Ctx::test_builder()
    .build()
    .scope({
      tenant_service::get_login_tenants(host)
    }).await
    .unwrap_or_default()
}

fn default_tenant_id(
  tenants: &[GetLoginTenants],
  tenant_id: Option<&str>,
) -> String {
  if let Some(tenant_id) = tenant_id
    && !tenant_id.trim().is_empty() {
      return tenant_id.trim().to_owned();
    }
  tenants.iter()
    .find_map(|item| {
      let tenant_id = item.id.to_string();
      let tenant_id = tenant_id.trim();
      if tenant_id.is_empty() {
        None
      } else {
        Some(tenant_id.to_owned())
      }
    })
    .unwrap_or_default()
}

fn parse_scope_values(
  scope: Option<&str>,
) -> std::result::Result<Vec<String>, String> {
  let mut scopes = scope.unwrap_or(MCP_SCOPE_TOOLS)
    .split(' ')
    .map(str::trim)
    .filter(|item| !item.is_empty())
    .map(ToOwned::to_owned)
    .collect::<Vec<_>>();
  if scopes.is_empty() {
    scopes.push(MCP_SCOPE_TOOLS.to_owned());
  }
  if scopes.iter().any(|item| item != MCP_SCOPE_TOOLS) {
    return Err("当前只支持 mcp:tools scope".to_owned());
  }
  scopes.sort();
  scopes.dedup();
  Ok(scopes)
}

fn requested_scopes_subset(
  scope: Option<&str>,
  granted: &[String],
) -> std::result::Result<Vec<String>, String> {
  let Some(scope) = scope else {
    return Ok(granted.to_vec());
  };
  let requested = parse_scope_values(Some(scope))?;
  if requested.iter().any(|item| !granted.contains(item)) {
    return Err("请求的 scope 超出了原始授权范围".to_owned());
  }
  Ok(requested)
}

fn resolve_resource(
  req: &Request,
  resource: Option<&str>,
) -> std::result::Result<String, String> {
  let expected = mcp_resource_url(req);
  if let Some(resource) = resource
    && resource != expected {
      return Err(format!("当前仅支持 resource={expected}"));
    }
  Ok(expected)
}

fn mcp_resource_url(
  req: &Request,
) -> String {
  format!("{}/mcp", request_origin(req))
}

fn verify_pkce(
  code_verifier: &str,
  code_challenge: &str,
) -> bool {
  let mut hasher = Sha256::new();
  hasher.update(code_verifier.as_bytes());
  let digest = hasher.finalize();
  general_purpose::URL_SAFE_NO_PAD.encode(digest) == code_challenge
}

fn required_string(
  value: Option<&str>,
  field: &str,
) -> std::result::Result<String, String> {
  let value = value
    .map(str::trim)
    .filter(|item| !item.is_empty())
    .ok_or_else(|| format!("{field} 不能为空"))?;
  Ok(value.to_owned())
}

fn build_www_authenticate(
  req: &Request,
  status: StatusCode,
  err_msg: &str,
) -> std::result::Result<HeaderValue, poem::http::header::InvalidHeaderValue> {
  let resource_metadata = format!("{}/.well-known/oauth-protected-resource/mcp", request_origin(req));
  let mut value = format!(
    "Bearer realm=\"mcp\", resource_metadata=\"{resource_metadata}\""
  );
  if status == StatusCode::UNAUTHORIZED {
    if err_msg.contains("token_empty") {
      return value.parse::<HeaderValue>();
    }
    let description = sanitize_header_value(err_msg);
    value.push_str(", error=\"invalid_token\"");
    value.push_str(&format!(", error_description=\"{description}\""));
  }
  value.parse::<HeaderValue>()
}

fn sanitize_header_value(
  value: &str,
) -> String {
  value.replace('"', "'")
}

fn render_authorize_page(
  req: &Request,
  ctx: &AuthorizeContext,
  tenants: &[GetLoginTenants],
  error_message: Option<&str>,
  tenant_id: &str,
  username: &str,
) -> String {
  let client_name = ctx.client.client_name
    .clone()
    .unwrap_or_else(|| ctx.client.client_id.clone());
  let action = escape_html(&req.uri().to_string());
  let scopes = escape_html(&ctx.scopes.join(" "));
  let resource = escape_html(&ctx.resource);
  let username = escape_html(username);
  let tenant_control = if tenants.is_empty() {
    format!(
      "<label>tenant_id</label><input name=\"tenant_id\" value=\"{}\" autocomplete=\"organization\" />",
      escape_html(tenant_id),
    )
  } else {
    let options = tenants.iter().map(|item| {
      let selected = if item.id.to_string() == tenant_id { " selected" } else { "" };
      format!(
        "<option value=\"{}\"{}>{} ({})</option>",
        escape_html(item.id.as_str()),
        selected,
        escape_html(&item.lbl),
        escape_html(&item.title),
      )
    }).collect::<Vec<_>>().join("");
    format!(
      "<label>租户</label><select name=\"tenant_id\">{options}</select>"
    )
  };
  let error_html = error_message.map(|message| {
    format!("<div class=\"error\">{}</div>", escape_html(message))
  }).unwrap_or_default();

  format!(
    "<!doctype html>
<html lang=\"zh-CN\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />
  <title>MCP OAuth 授权</title>
  <style>
    :root {{ color-scheme: light; --bg:#f4f1eb; --panel:#fffdfa; --line:#d8ccb8; --text:#1f1a15; --muted:#675c52; --brand:#8a5b37; --brand2:#6f4425; --danger:#b94a37; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background:radial-gradient(circle at top left, rgba(138,91,55,.16), transparent 28%), linear-gradient(160deg,#f7f2ea 0%,#ecdfd0 100%); font-family:\"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif; color:var(--text); }}
    .wrap {{ width:min(920px,100%); display:grid; grid-template-columns:minmax(260px,340px) minmax(340px,480px); background:var(--panel); border:1px solid rgba(255,255,255,.85); border-radius:28px; overflow:hidden; box-shadow:0 30px 80px rgba(78,52,27,.12); }}
    .intro {{ padding:36px 32px; background:linear-gradient(170deg, rgba(138,91,55,.12), rgba(255,255,255,.2)); border-right:1px solid var(--line); }}
    .intro h1 {{ margin:0 0 12px; font-size:28px; line-height:1.1; }}
    .intro p {{ margin:0 0 14px; color:var(--muted); line-height:1.6; }}
    .intro dl {{ margin:20px 0 0; display:grid; gap:10px; }}
    .intro dt {{ font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }}
    .intro dd {{ margin:4px 0 0; font-size:14px; word-break:break-all; }}
    .panel {{ padding:34px 30px; }}
    .panel h2 {{ margin:0 0 10px; font-size:24px; }}
    .panel p {{ margin:0 0 18px; color:var(--muted); line-height:1.6; }}
    form {{ display:grid; gap:14px; }}
    label {{ display:block; margin-bottom:6px; font-size:13px; color:var(--muted); }}
    input,select {{ width:100%; border:1px solid var(--line); border-radius:14px; padding:12px 14px; font-size:15px; background:#fff; color:var(--text); }}
    input:focus,select:focus {{ outline:none; border-color:var(--brand); box-shadow:0 0 0 3px rgba(138,91,55,.12); }}
    .error {{ border:1px solid rgba(185,74,55,.18); background:rgba(185,74,55,.08); color:var(--danger); border-radius:14px; padding:12px 14px; font-size:14px; }}
    .buttons {{ display:flex; gap:12px; margin-top:8px; }}
    button {{ flex:1; border:0; border-radius:14px; padding:13px 14px; font-size:15px; cursor:pointer; }}
    .approve {{ background:linear-gradient(135deg,var(--brand),var(--brand2)); color:#fff; }}
    .deny {{ background:#f3ece2; color:var(--text); }}
    @media (max-width: 760px) {{ .wrap {{ grid-template-columns:1fr; }} .intro {{ border-right:0; border-bottom:1px solid var(--line); }} }}
  </style>
</head>
<body>
  <div class=\"wrap\">
    <section class=\"intro\">
      <h1>允许 MCP 客户端访问</h1>
      <p>当前客户端正在申请访问内嵌在 rust 服务中的 MCP 端点。登录后会以标准 OAuth 授权码流程返回授权结果。</p>
      <dl>
        <div>
          <dt>客户端</dt>
          <dd>{}</dd>
        </div>
        <div>
          <dt>Scope</dt>
          <dd>{}</dd>
        </div>
        <div>
          <dt>Resource</dt>
          <dd>{}</dd>
        </div>
      </dl>
    </section>
    <section class=\"panel\">
      <h2>登录并授权</h2>
      <p>这里复用当前系统的用户名、密码和租户登录逻辑。授权完成后，客户端会自动跳回自己的回调地址。</p>
      {}
      <form method=\"post\" action=\"{}\">
        {}
        <div>
          <label>用户名</label>
          <input name=\"username\" value=\"{}\" autocomplete=\"username\" />
        </div>
        <div>
          <label>密码</label>
          <input name=\"password\" type=\"password\" autocomplete=\"current-password\" />
        </div>
        <div class=\"buttons\">
          <button class=\"approve\" type=\"submit\" name=\"decision\" value=\"approve\">登录并授权</button>
          <button class=\"deny\" type=\"submit\" name=\"decision\" value=\"deny\">拒绝</button>
        </div>
      </form>
    </section>
  </div>
</body>
</html>",
    escape_html(&client_name),
    scopes,
    resource,
    error_html,
    action,
    tenant_control,
    username,
  )
}

fn render_error_page(
  title: &str,
  message: &str,
) -> String {
  format!(
    "<!doctype html><html lang=\"zh-CN\"><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" /><title>{}</title><style>body{{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f4f1eb;font-family:\"Segoe UI\",\"PingFang SC\",sans-serif;color:#1f1a15}}main{{max-width:720px;background:#fff;border:1px solid #d8ccb8;border-radius:24px;padding:28px 30px;box-shadow:0 20px 60px rgba(78,52,27,.08)}}h1{{margin:0 0 12px;font-size:26px}}p{{margin:0;color:#675c52;line-height:1.7;word-break:break-word}}</style></head><body><main><h1>{}</h1><p>{}</p></main></body></html>",
    escape_html(title),
    escape_html(title),
    escape_html(message),
  )
}

fn escape_html(
  input: &str,
) -> String {
  input
    .replace('&', "&amp;")
    .replace('<', "&lt;")
    .replace('>', "&gt;")
    .replace('"', "&quot;")
    .replace('\'', "&#39;")
}

fn redirect_with_params(
  redirect_uri: &str,
  pairs: &[(&str, &str)],
  state: Option<&str>,
) -> Response {
  let location = append_query_params(redirect_uri, pairs, state);
  let mut response = Response::builder()
    .status(StatusCode::FOUND)
    .header(header::LOCATION, location)
    .finish();
  inject_cors_headers(&mut response, None);
  response
}

fn append_query_params(
  redirect_uri: &str,
  pairs: &[(&str, &str)],
  state: Option<&str>,
) -> String {
  if let Ok(mut url) = url::Url::parse(redirect_uri) {
    {
      let mut query = url.query_pairs_mut();
      for (key, value) in pairs {
        query.append_pair(key, value);
      }
      if let Some(state) = state {
        query.append_pair("state", state);
      }
    }
    return url.to_string();
  }

  let mut parts = Vec::<String>::new();
  for (key, value) in pairs {
    parts.push(format!("{}={}", urlencoding::encode(key), urlencoding::encode(value)));
  }
  if let Some(state) = state {
    parts.push(format!("state={}", urlencoding::encode(state)));
  }
  let delimiter = if redirect_uri.contains('?') { '&' } else { '?' };
  format!("{redirect_uri}{delimiter}{}", parts.join("&"))
}

pub fn preflight_response(
  req: &Request,
) -> Response {
  let mut response = Response::builder()
    .status(StatusCode::NO_CONTENT)
    .finish();
  inject_cors_headers(&mut response, Some(req));
  response
}

pub(crate) fn inject_cors_headers_with_origin(
  response: &mut Response,
  origin: Option<&str>,
) {
  let origin = origin
    .filter(|value| !value.trim().is_empty())
    .unwrap_or("*");
  let allow_origin = HeaderValue::from_str(origin)
    .unwrap_or_else(|_| HeaderValue::from_static("*"));
  response.headers_mut().insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, allow_origin);
  response.headers_mut().insert(
    header::ACCESS_CONTROL_ALLOW_METHODS,
    HeaderValue::from_static("GET, POST, PUT, DELETE, PATCH, OPTIONS"),
  );
  response.headers_mut().insert(
    header::ACCESS_CONTROL_ALLOW_HEADERS,
    HeaderValue::from_static("Authorization, Content-Type, TenantId, X-Requested-With, X-Request-Id, Mcp-Session-Id, MCP-Protocol-Version, Mcp-Method, Mcp-Name"),
  );
  response.headers_mut().insert(
    header::ACCESS_CONTROL_EXPOSE_HEADERS,
    HeaderValue::from_static("Mcp-Session-Id, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Authorization"),
  );
  response.headers_mut().insert(
    header::ACCESS_CONTROL_MAX_AGE,
    HeaderValue::from_static("86400"),
  );
}

pub(crate) fn inject_cors_headers(
  response: &mut Response,
  req: Option<&Request>,
) {
  inject_cors_headers_with_origin(
    response,
    req.and_then(|req| req.header("origin")),
  );
}

fn get_now_sec() -> i64 {
  std::time::SystemTime::now()
    .duration_since(std::time::UNIX_EPOCH)
    .unwrap_or_default()
    .as_secs() as i64
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn request_origin_from_headers_supports_original_proxy_headers() {
    let mut headers = http::HeaderMap::new();
    headers.insert("x-original-proto", HeaderValue::from_static("https"));
    headers.insert("x-original-host", HeaderValue::from_static("mcp.example.com"));
    assert_eq!(request_origin_from_headers(&headers), "https://mcp.example.com");
  }

  #[test]
  fn request_origin_from_headers_supports_forwarded_header_and_port() {
    let mut headers = http::HeaderMap::new();
    headers.insert("forwarded", HeaderValue::from_static("proto=https;host=app.example.com:443"));
    assert_eq!(request_origin_from_headers(&headers), "https://app.example.com");
  }

  #[test]
  fn request_origin_from_headers_supports_standard_https_port_stripping() {
    let mut headers = http::HeaderMap::new();
    headers.insert("x-forwarded-proto", HeaderValue::from_static("https"));
    headers.insert("x-forwarded-host", HeaderValue::from_static("cloud.pomeas.cn:443"));
    assert_eq!(request_origin_from_headers(&headers), "https://cloud.pomeas.cn");
  }
}
