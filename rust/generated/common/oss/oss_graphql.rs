use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::oss_model::GetStatsOss;
use super::oss_resolver;

#[derive(Default)]
pub struct OssQuery;

#[Object(rename_args = "snake_case")]
impl OssQuery {
  
  async fn get_stats_oss(
    &self,
    ctx: &Context<'_>,
    ids: Vec<String>,
  ) -> Result<Vec<Option<GetStatsOss>>> {
    Ctx::builder(ctx)
      .build()
      .scope({
        oss_resolver::get_stats_oss(ids)
      }).await
  }
  
}
