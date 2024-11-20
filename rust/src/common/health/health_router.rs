use serde::Deserialize;

use anyhow::Result;

use poem::{
  handler, web::Query, Response,
};

use crate::common::context::Ctx;

use super::health_resful;

#[derive(Deserialize)]
pub struct HealthQuery {
  key: Option<String>,
}

#[handler]
pub async fn health(
  req: &poem::Request,
  Query(HealthQuery {
    key,
  }): Query<HealthQuery>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth()?
    .build()
    .resful_scope({
      health_resful::health_check(key)
    }).await
}
