use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use crate::r#gen::cron::cron_job::cron_job_model::*;
use super::cron_job_resolver;

#[derive(Default)]
pub struct CronJobMutation;

#[Object(rename_args = "snake_case")]
impl CronJobMutation {
  
  /// 手动执行定时任务
  async fn run_cron_job(
    &self,
    ctx: &Context<'_>,
    id: CronJobId,
  ) -> Result<String> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::run_cron_job(
          id,
        )
      }).await
  }
  
}
