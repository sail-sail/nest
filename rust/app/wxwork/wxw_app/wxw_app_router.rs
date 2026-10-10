use color_eyre::eyre::Result;

use poem::{
  handler, Request, Response,
};
use poem::web::Query;

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
    }).await
}

#[handler]
pub async fn wxwork_app_notify_post(
  req: &Request,
  Query(notify_query): Query<NotifyQuery>,
  body: String,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .build()
    .resful_scope({
      wxw_app_resolver::wxwork_app_notify_post(
        notify_query,
        body,
        None,
      )
    }).await
}
