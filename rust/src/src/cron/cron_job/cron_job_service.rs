use color_eyre::eyre::Result;

use crate::r#gen::cron::cron_job::cron_job_model::CronJobId;

use crate::r#gen::cron::cron_job::cron_job_dao::{
  find_by_id as find_by_id_cron_job_dao,
  validate_option as validate_option_cron_job_dao,
};

use crate::src::cron::job::job_dao::run_job;

/// 手动执行定时任务
pub async fn run_cron_job(
  id: CronJobId,
) -> Result<String> {
  
  let cron_job_model = validate_option_cron_job_dao(
    find_by_id_cron_job_dao(
      id,
      None,
    ).await?,
  ).await?;
  
  let (
    cron_job_id,
    job_id,
    cron,
    tenant_id,
  ) = (
    cron_job_model.id,
    cron_job_model.job_id,
    cron_job_model.cron,
    cron_job_model.tenant_id,
  );
  
  let res = run_job(
    job_id,
    cron_job_id,
    cron,
    tenant_id,
  ).await?;
  
  Ok(res)
}
