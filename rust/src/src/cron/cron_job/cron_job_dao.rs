use color_eyre::eyre::Result;

use std::sync::OnceLock;
use delay_timer::prelude::*;

use crate::common::context::{
  Options,
  CtxBuilder,
};

use crate::r#gen::cron::cron_job::cron_job_model::CronJobModel;
use crate::r#gen::cron::cron_job::cron_job_model::{
  CronJobId,
  CronJobSearch,
};

use crate::r#gen::cron::cron_job::cron_job_dao::{
  find_by_id_cron_job,
  find_all_cron_job,
};

use crate::src::cron::job::job_dao::run_job;
use tracing::info;

static DELAY_TIMER: OnceLock<DelayTimer> = OnceLock::new();

fn delay_timer() -> DelayTimer {
  DELAY_TIMER.get_or_init(init_delay_timer)
    .clone()
}

fn init_delay_timer() -> DelayTimer {
  let delay_timer: DelayTimer = DelayTimerBuilder::default()
    .tokio_runtime_by_default()
    .build();
  delay_timer
}

/// 增加定时任务
pub async fn add_task(
  cron_job_id: CronJobId,
  options: Option<Options>,
) -> Result<()> {
  
  let cron_job_model = find_by_id_cron_job(
    cron_job_id,
    options,
  ).await?;
  
  if cron_job_model.is_none() {
    return Ok(());
  }
  let cron_job_model = cron_job_model.unwrap();
  
  if cron_job_model.is_enabled != 1 {
    return Ok(());
  }
  
  new_task(cron_job_model).await?;
  
  Ok(())
}

/// 删除定时任务
pub async fn remove_task(
  cron_job_id: CronJobId,
  options: Option<Options>,
) -> Result<()> {
  
  let cron_job_model = find_by_id_cron_job(
    cron_job_id,
    options,
  ).await?;
  
  if cron_job_model.is_none() {
    return Ok(());
  }
  let cron_job_model = cron_job_model.unwrap();
  
  let task_id = cron_job_model.seq as u64;
  
  let delay_timer = delay_timer();
  delay_timer.remove_task(task_id)?;
  
  Ok(())
}

async fn new_task(
  cron_job_model: CronJobModel,
) -> Result<()> {
  
  let (
    seq,
    cron_job_id,
    job_id,
    cron,
    tenant_id,
  ) = (
    cron_job_model.seq,
    cron_job_model.id,
    cron_job_model.job_id,
    cron_job_model.cron,
    cron_job_model.tenant_id,
  );
  
  let mut task_builder = TaskBuilder::default();
  let task = task_builder
    .set_frequency_repeated_by_cron_str(cron.clone().as_str())
    .set_task_id(seq as u64)
    .spawn_async_routine(move || {
      let job_id = job_id.clone();
      let cron_job_id = cron_job_id.clone();
      let cron = cron.clone();
      let tenant_id = tenant_id.clone();
      async move {
        CtxBuilder::new(None)
          .build()
          .scope({
            run_job(
              job_id,
              cron_job_id,
              cron,
              tenant_id,
              None,
            )
          }).await
      }
    })?;
  let delay_timer = delay_timer();
  delay_timer.insert_task(task)?;
  
  Ok(())
}

#[allow(dead_code)]
pub async fn init_cron_jobs() -> Result<()> {
  
  let cron_job_models = find_all_cron_job(
    CronJobSearch {
      is_enabled: Some(vec![1]),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await.unwrap();
  
  info!("init_cron_jobs: {:?}", cron_job_models);
  
  for cron_job_model in cron_job_models {
    
    new_task(cron_job_model).await?;
    
  }
  
  Ok(())
}
