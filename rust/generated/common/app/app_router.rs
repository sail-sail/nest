use color_eyre::eyre::Result;

use poem::{
  handler, web::Query, Request, Response,
};

use crate::common::context::Ctx;

use super::app_resful::{
  self,
  RedirectQuery,
};

/// 统一跳转: 按 User-Agent 决定跳电脑端还是手机端, 不需要登录校验
#[handler]
pub async fn redirect(
  req: &Request,
  Query(query): Query<RedirectQuery>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .build()
    .resful_scope({
      app_resful::redirect(req, query)
    }).await
}
