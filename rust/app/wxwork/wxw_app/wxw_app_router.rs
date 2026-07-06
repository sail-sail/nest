use color_eyre::eyre::Result;

use poem::{
  handler, IntoResponse, Request, Response,
};
use poem::web::Query;
use tracing::info;

use generated::common::context::Ctx;

use super::wxw_app_model::NotifyQuery;
use super::wxw_app_resolver;

#[handler]
pub async fn wxwork_app_notify_get(
  req: &Request,
  Query(notify_query): Query<NotifyQuery>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .build()
    .resful_scope({
      wxw_app_resolver::wxwork_app_notify_get(
        notify_query,
        None,
      )
    })
    .await
}

#[handler]
pub async fn wxwork_app_notify_post(
  req: &poem::Request,
) -> impl IntoResponse {
  info!("企业微信应用回调通知 POST: req={:?}", req);
  "ok"
}
