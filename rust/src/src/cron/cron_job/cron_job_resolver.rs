use color_eyre::eyre::Result;

use crate::r#gen::cron::cron_job::cron_job_model::CronJobId;

use super::cron_job_service;

/// 手动执行定时任务
pub async fn run_cron_job(
  id: CronJobId,
) -> Result<String> {
  
  let res = cron_job_service::run_cron_job(
    id,
  ).await?;
  
  Ok(res)
}
