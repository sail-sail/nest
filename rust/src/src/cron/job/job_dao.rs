use color_eyre::eyre::{Result, eyre};
use tracing::info;

use crate::common::context::Options;

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::cron::job::job_model::JobId;
use crate::r#gen::cron::cron_job::cron_job_model::CronJobId;
use crate::r#gen::cron::cron_job_log::cron_job_log_model::{
  CronJobLogId,
  CronJobLogInput,
  CronJobLogExecState,
};
use crate::r#gen::cron::cron_job_log_detail::cron_job_log_detail_model::CronJobLogDetailInput;

use crate::r#gen::cron::job::job_dao::{
  validate_option_job,
  validate_is_enabled_job,
  find_by_id_job,
};

use crate::r#gen::cron::cron_job_log::cron_job_log_dao::{
  create_cron_job_log,
  update_by_id_cron_job_log,
};

use crate::r#gen::cron::cron_job_log_detail::cron_job_log_detail_dao::create_cron_job_log_detail;

pub async fn run_job(
  id: JobId,
  cron_job_id: CronJobId,
  cron: String,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<String> {
  
  let job_model = validate_option_job(
    find_by_id_job(
      id,
      options.clone(),
    ).await?,
  ).await?;
  
  validate_is_enabled_job(
    &job_model,
  ).await?;
  
  info!("cron_job begin: {}: {}", cron_job_id, cron);
  
  let begin_time = chrono::Local::now().naive_local();
  let id = create_cron_job_log(
    CronJobLogInput {
      cron_job_id: Some(cron_job_id.clone()),
      begin_time: Some(begin_time),
      exec_result: Some(String::new()),
      tenant_id: Some(tenant_id.clone()),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  let code = job_model.code;
  
  let exec_result: Option<Result<String>> = if code == "test" {
    test(
      id.clone(),
      tenant_id,
    ).await.into()
  } else {
    None
  };
  
  info!("cron_job end: {}: {}", cron_job_id, cron);
  
  let end_time = chrono::Local::now().naive_local();
  
  if exec_result.is_some() && exec_result.as_ref().unwrap().is_err() {
    let exec_result = exec_result.unwrap();
    let exec_result = exec_result.unwrap_err().to_string();
    update_by_id_cron_job_log(
      id,
      CronJobLogInput {
        exec_state: Some(CronJobLogExecState::Fail),
        exec_result: Some(exec_result.clone()),
        end_time: Some(end_time),
        ..Default::default()
      },
      options.clone(),
    ).await?;
    
    return Err(eyre!(exec_result));
  }
  
  let exec_result: String = {
    if let Some(exec_result) = exec_result {
      exec_result.unwrap()
    } else {
      String::new()
    }
  };
  
  update_by_id_cron_job_log(
    id,
    CronJobLogInput {
      exec_state: Some(CronJobLogExecState::Success),
      exec_result: Some(exec_result.clone()),
      end_time: Some(end_time),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  Ok(exec_result)
}

async fn test(
  cron_job_log_id: CronJobLogId,
  tenant_id: TenantId,
) ->Result<String> {
  
  create_cron_job_log_detail(
    CronJobLogDetailInput {
      lbl: Some("测试日志".to_string()),
      cron_job_log_id: Some(cron_job_log_id),
      tenant_id: Some(tenant_id),
      ..Default::default()
    },
    None,
  ).await?;
  
  tokio::time::sleep(std::time::Duration::from_secs(3)).await;
  
  info!("test");
  
  Ok(String::new())
}
