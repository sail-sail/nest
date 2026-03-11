use color_eyre::eyre::{Result, eyre};
use tracing::info;

use generated::common::context::Options;

use smol_str::SmolStr;

use generated::base::tenant::tenant_model::TenantId;
use generated::cron::job::job_model::JobId;
use generated::cron::cron_job::cron_job_model::CronJobId;
use generated::cron::cron_job_log::cron_job_log_model::{
  CronJobLogId,
  CronJobLogInput,
  CronJobLogExecState,
};
use generated::cron::cron_job_log_detail::cron_job_log_detail_model::CronJobLogDetailInput;

use generated::cron::job::job_dao::{
  validate_option_job,
  validate_is_enabled_job,
  find_by_id_job,
};

use generated::cron::cron_job_log::cron_job_log_dao::{
  create_cron_job_log,
  update_by_id_cron_job_log,
};

use generated::cron::cron_job_log_detail::cron_job_log_detail_dao::create_cron_job_log_detail;

pub async fn run_job(
  id: JobId,
  cron_job_id: CronJobId,
  cron: SmolStr,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<SmolStr> {
  
  let job_model = validate_option_job(
    find_by_id_job(
      id,
      options,
    ).await?,
  ).await?;
  
  validate_is_enabled_job(
    &job_model,
  ).await?;
  
  info!("cron_job begin: {cron_job_id}: {cron}");
  
  let begin_time = chrono::Local::now().naive_local();
  let id = create_cron_job_log(
    CronJobLogInput {
      cron_job_id: Some(cron_job_id),
      begin_time: Some(begin_time),
      exec_result: Some(SmolStr::new("")),
      tenant_id: Some(tenant_id),
      ..Default::default()
    },
    options,
  ).await?;
  
  let code = job_model.code;
  
  let exec_result: Option<Result<SmolStr>> = match code.as_str() {
    "test" => test(
      id,
      tenant_id,
      options,
    ).await.into(),
    _ => None,
  };
  
  info!("cron_job end: {cron_job_id}: {cron}");
  
  let end_time = chrono::Local::now().naive_local();
  
  if let Some(exec_result) = &exec_result &&
    let Err(exec_result) = &exec_result
  {
    let exec_result = SmolStr::new(exec_result.to_string());
    update_by_id_cron_job_log(
      id,
      CronJobLogInput {
        exec_state: Some(CronJobLogExecState::Fail),
        exec_result: Some(exec_result.clone()),
        end_time: Some(end_time),
        ..Default::default()
      },
      options,
    ).await?;
    
    return Err(eyre!(exec_result));
  }
  
  if let Some(exec_result) = &exec_result &&
    let Ok(exec_result) = &exec_result
  {
    
    update_by_id_cron_job_log(
      id,
      CronJobLogInput {
        exec_state: Some(CronJobLogExecState::Success),
        exec_result: Some(exec_result.clone()),
        end_time: Some(end_time),
        ..Default::default()
      },
      options,
    ).await?;
    
    return Ok(exec_result.clone());
  }
  
  Ok(SmolStr::new(""))
}

async fn test(
  cron_job_log_id: CronJobLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) ->Result<SmolStr> {
  
  create_cron_job_log_detail(
    CronJobLogDetailInput {
      lbl: Some("测试日志".into()),
      cron_job_log_id: Some(cron_job_log_id),
      tenant_id: Some(tenant_id),
      ..Default::default()
    },
    options,
  ).await?;
  
  tokio::time::sleep(std::time::Duration::from_secs(3)).await;
  
  info!("test");
  
  Ok(SmolStr::new(""))
}
