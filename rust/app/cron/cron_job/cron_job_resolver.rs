use color_eyre::eyre::Result;

use generated::common::context::Options;

use generated::cron::cron_job::cron_job_model::CronJobId;

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
