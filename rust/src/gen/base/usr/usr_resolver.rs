
use anyhow::Result;
use poem::http::HeaderName;

use async_graphql::{Context, Object};

use crate::common::auth::auth_model::{AUTHORIZATION, AuthToken};
use crate::common::context::{CtxImpl, Ctx};

use crate::gen::base::usr::usr_model::UsrModel;
use crate::gen::base::usr::usr_service;

#[derive(Default)]
pub struct UsrQuery;

#[Object]
impl UsrQuery {
  
  async fn hello<'a>(
    &self,
    gql_ctx: &Context<'a>,
  ) -> Result<Vec<UsrModel>> {
    let mut ctx = CtxImpl::new()
      .set_auth_token(
        gql_ctx.data_opt::<AuthToken>()
          .map(ToString::to_string)
      )
      .set_is_tran(true)
      ;
    match ctx.verify_auth_token()? {
      None => { },
      Some(auth_token2) => {
        gql_ctx.insert_http_header(AUTHORIZATION, auth_token2.parse::<HeaderName>()?);
      },
    }
    let res = usr_service::hello(&mut ctx).await;
    ctx.ok(res).await
  }
  
}
