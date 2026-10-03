use color_eyre::eyre::Result;
use generated::common::usr::usr_model::LoginInput;
use poem::{Request, Response, handler, web::{Form, Json, Query}};

use super::mcp_model::{
  OAuthAuthorizeForm,
  OAuthAuthorizeQuery,
  OAuthRegisterInput,
  OAuthRevokeForm,
  OAuthTokenForm,
};
use super::mcp_resful;

#[handler]
pub async fn login(
  req: &Request,
  Json(input): Json<LoginInput>,
) -> Result<Response> {
  mcp_resful::login(req, input).await
}

#[handler]
pub async fn mcp_options(
  req: &Request,
) -> Result<Response> {
  Ok(super::mcp_service::preflight_response(req))
}

#[handler]
pub async fn oauth_protected_resource_metadata_mcp(
  req: &Request,
) -> Result<Response> {
  mcp_resful::oauth_protected_resource_metadata(req).await
}

#[handler]
pub async fn oauth_protected_resource_metadata_root(
  req: &Request,
) -> Result<Response> {
  mcp_resful::oauth_protected_resource_metadata(req).await
}

#[handler]
pub async fn oauth_authorization_server_metadata(
  req: &Request,
) -> Result<Response> {
  mcp_resful::oauth_authorization_server_metadata(req).await
}

#[handler]
pub async fn oauth_authorize_get(
  req: &Request,
  Query(query): Query<OAuthAuthorizeQuery>,
) -> Result<Response> {
  mcp_resful::oauth_authorize_get(req, query).await
}

#[handler]
pub async fn oauth_authorize_post(
  req: &Request,
  Query(query): Query<OAuthAuthorizeQuery>,
  Form(form): Form<OAuthAuthorizeForm>,
) -> Result<Response> {
  mcp_resful::oauth_authorize_post(req, query, form).await
}

#[handler]
pub async fn oauth_token(
  req: &Request,
  Form(form): Form<OAuthTokenForm>,
) -> Result<Response> {
  mcp_resful::oauth_token(req, form).await
}

#[handler]
pub async fn oauth_register(
  req: &Request,
  Json(input): Json<OAuthRegisterInput>,
) -> Result<Response> {
  mcp_resful::oauth_register(req, input).await
}

#[handler]
pub async fn oauth_revoke(
  req: &Request,
  Form(form): Form<OAuthRevokeForm>,
) -> Result<Response> {
  mcp_resful::oauth_revoke(req, form).await
}