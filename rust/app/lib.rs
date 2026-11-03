#![forbid(unsafe_code)]
#![recursion_limit="512"]

pub mod base;

use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  
  base::BaseAppQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
  
  base::BaseAppMutation,
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
