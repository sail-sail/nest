use color_eyre::eyre::Result;
use generated::common::context::Ctx;
use generated::common::usr::usr_model::LoginInput;
use poem::{Request, Response};

use super::mcp_model::{
  OAuthAuthorizeForm,
  OAuthAuthorizeQuery,
  OAuthRegisterInput,
  OAuthRevokeForm,
  OAuthTokenForm,
};
use super::mcp_service;

pub async fn login(
  req: &Request,
  input: LoginInput,
) -> Result<Response> {
  let ip = req.header("x-real-ip")
    .map(|value| value.to_owned())
    .unwrap_or_else(|| "127.0.0.1".to_owned());
  Ctx::resful_builder(Some(req))
    .with_tran()
    .build()
    .resful_scope({
      mcp_service::login(input, ip)
    }).await
}

pub async fn oauth_protected_resource_metadata(
  req: &Request,
) -> Result<Response> {
  Ok(mcp_service::oauth_protected_resource_metadata(req))
}

pub async fn oauth_authorization_server_metadata(
  req: &Request,
) -> Result<Response> {
  Ok(mcp_service::oauth_authorization_server_metadata(req))
}

pub async fn oauth_authorize_get(
  req: &Request,
  query: OAuthAuthorizeQuery,
) -> Result<Response> {
  Ok(mcp_service::oauth_authorize_get(req, query).await)
}

pub async fn oauth_authorize_post(
  req: &Request,
  query: OAuthAuthorizeQuery,
  form: OAuthAuthorizeForm,
) -> Result<Response> {
  Ok(mcp_service::oauth_authorize_post(req, query, form).await)
}

pub async fn oauth_token(
  req: &Request,
  form: OAuthTokenForm,
) -> Result<Response> {
  Ok(mcp_service::oauth_token(req, form).await)
}

pub async fn oauth_register(
  req: &Request,
  input: OAuthRegisterInput,
) -> Result<Response> {
  Ok(mcp_service::oauth_register(req, input).await)
}

pub async fn oauth_revoke(
  req: &Request,
  form: OAuthRevokeForm,
) -> Result<Response> {
  Ok(mcp_service::oauth_revoke(req, form).await)
}