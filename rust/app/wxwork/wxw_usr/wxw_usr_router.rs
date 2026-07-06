use color_eyre::eyre::Result;

use poem::{
  handler, IntoResponse, Request, Response,
};
use poem::web::Query;
use tracing::info;

use generated::common::context::Ctx;

use super::wxw_usr_model::NotifyQuery;
use super::wxw_usr_resolver;

#[handler]
pub async fn wxwork_usr_notify_get(
  req: &Request,
  Query(notify_query): Query<NotifyQuery>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .build()
    .resful_scope({
      wxw_usr_resolver::wxwork_usr_notify_get(
        notify_query,
        None,
      )
    })
    .await
}

#[handler]
pub async fn wxwork_usr_notify_post(
  req: &poem::Request,
) -> impl IntoResponse {
  info!("企业微信通讯录回调通知 POST: req={:?}", req);
  "ok"
}
