#![forbid(unsafe_code)]
#![recursion_limit="512"]

pub mod base;
pub mod wxwork;

use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  
  base::BaseAppQuery,
  wxwork::WxworkAppQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
  
  base::BaseAppMutation,
  wxwork::WxworkAppMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;

#[allow(unused_imports)]
use poem::{Route, get, post};

pub fn init() {
  
  base::init();
  
}

/// 注册 业务路由
#[allow(unused_mut, clippy::let_and_return)]
pub fn register_routes(app: Route) -> Route {
  let mut app = app;

  app = app.at(
    "/.well-known/oauth-protected-resource/mcp",
    get(base::mcp::mcp_router::oauth_protected_resource_metadata_mcp)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/.well-known/oauth-protected-resource",
    get(base::mcp::mcp_router::oauth_protected_resource_metadata_root)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/.well-known/oauth-authorization-server",
    get(base::mcp::mcp_router::oauth_authorization_server_metadata)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/authorize",
    get(base::mcp::mcp_router::oauth_authorize_get)
      .post(base::mcp::mcp_router::oauth_authorize_post)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/token",
    post(base::mcp::mcp_router::oauth_token)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/register",
    post(base::mcp::mcp_router::oauth_register)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/revoke",
    post(base::mcp::mcp_router::oauth_revoke)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/mcp",
    get(base::mcp::mcp_endpoint::mcp_get())
      .post(base::mcp::mcp_endpoint::mcp_post())
      .delete(base::mcp::mcp_endpoint::mcp_delete())
      .options(base::mcp::mcp_router::mcp_options),
  );

  app = app.at(
    "/mcp/login",
    post(base::mcp::mcp_router::login)
      .options(base::mcp::mcp_router::mcp_options),
  );

  app
}

/// 注册 openapi 业务路由
///
/// 新增业务模块时, 在这里加一行 `nest`, 同时在 `oai_modules` 里加一行 spec
#[allow(unused_mut, clippy::let_and_return)]
pub fn register_oai_routes(app: Route) -> Route {
  let mut app = app;
  
  app = app.nest(
    "/api/oai/system",
    base::oai::system::service(),
  );
  
  app
}

/// 收集所有 openapi 模块的 spec
///
/// 合并后供 `/openapi.json` 和 MCP 搜索使用
pub fn oai_modules() -> Vec<base::oai::OaiModule> {
  vec![
    base::oai::OaiModule::new(
      "system",
      base::oai::system::service().spec(),
    ),
  ]
}

static OAI_SPEC_CACHE: std::sync::OnceLock<std::result::Result<String, String>> = std::sync::OnceLock::new();

/// 生成合并后的 openapi 规范
fn build_oai_spec() -> std::result::Result<String, String> {
  let modules = oai_modules();
  let spec = base::oai::merge_specs(&modules).map_err(|err| err.to_string())?;
  serde_json::to_string(&spec).map_err(|err| err.to_string())
}

/// 合并后的 openapi 规范
///
/// 规范在进程内不会变化, 因此只生成一次; 结果同时提供给 `/openapi.json` 和 MCP 索引。
/// 失败时打日志, 避免 MCP 侧把空规范静默当成「接口不存在」
pub fn oai_spec() -> std::result::Result<&'static str, &'static str> {
  OAI_SPEC_CACHE.get_or_init(|| {
    let result = build_oai_spec();
    if let Err(err) = &result {
      tracing::error!("openapi 规范生成失败, /openapi.json 与 rest 接口工具将不可用: {err}");
    }
    result
  }).as_ref().map(String::as_str).map_err(String::as_str)
}
