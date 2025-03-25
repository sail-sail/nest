use color_eyre::eyre::Result;

use crate::common::context::Options;

use crate::r#gen::cron::cron_job::cron_job_model::CronJobId;

use super::cron_job_service;

/// 手动执行定时任务
pub async fn run_cron_job(
  id: CronJobId,
  options: Option<Options>,
) -> Result<String> {
  
  let res = cron_job_service::run_cron_job(
    id,
    options,
  ).await?;
  
  Ok(res)
}
