use anyhow::Result;

use crate::common::context::Ctx;

use super::health_service;

pub async fn health_check() -> Result<()> {
  Ctx::resful_builder()
    .build()
    .scope({
      health_service::health_check()
    }).await
}
