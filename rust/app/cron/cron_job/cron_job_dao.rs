use color_eyre::eyre::{Result, eyre};

use std::collections::HashMap;
use std::str::FromStr;
use std::sync::{Mutex, OnceLock};
use std::time::Duration;

use chrono::Utc;
use chrono_tz::Tz;
use cron_clock::Schedule;
use tokio::task::JoinHandle;
use tracing::{error, info, warn};

use generated::common::context::{
  Options,
  CtxBuilder,
  get_server_tokentimeout,
};
use generated::common::auth::auth_model::AuthModel;
use generated::base::usr::usr_model::UsrId;
use generated::base::tenant::tenant_model::TenantId;
use generated::base::org::org_model::OrgId;

use generated::cron::cron_job::cron_job_model::CronJobModel;
use generated::cron::cron_job::cron_job_model::{
  CronJobId,
  CronJobSearch,
};

use generated::cron::cron_job::cron_job_dao::{
  find_by_id_cron_job,
  find_all_cron_job,
};

use crate::cron::job::job_dao::run_job;

/// 已调度的定时任务, key 为 cron_job.seq, value 为排期协程
static SCHEDULED_TASKS: OnceLock<Mutex<HashMap<u64, JoinHandle<()>>>> = OnceLock::new();

const CRON_EXECUTOR_USR_ID: &str = "AaCUGR86d/yrGdovJ9nigQ";

/// 兜底时区: 东八区(中国北京时间)
const DEFAULT_TIMEZONE: Tz = Tz::Asia__Shanghai;

pub(crate) fn build_cron_auth_model(
  tenant_id: TenantId,
  exec_usr_id: UsrId,
  org_id: OrgId,
) -> AuthModel {
  let exp = chrono::Utc::now().timestamp_millis() / 1000 + get_server_tokentimeout();
  let id = if exec_usr_id.is_empty() {
    UsrId::from(CRON_EXECUTOR_USR_ID)
  } else {
    exec_usr_id
  };
  let org_id = if org_id.is_empty() {
    None
  } else {
    Some(org_id)
  };
  AuthModel {
    id,
    tenant_id,
    org_id,
    exp,
    ..Default::default()
  }
}

/// 取任务表锁, 排期协程不会在持锁期间 await, 用 std 的 Mutex 即可
fn scheduled_tasks() -> std::sync::MutexGuard<'static, HashMap<u64, JoinHandle<()>>> {
  SCHEDULED_TASKS.get_or_init(|| Mutex::new(HashMap::new()))
    .lock()
    .unwrap_or_else(|err| err.into_inner())
}

/// 解析任务时区, 空值或非法值兜底东八区
fn parse_timezone(timezone: &str) -> Tz {
  let timezone = timezone.trim();
  if timezone.is_empty() {
    return DEFAULT_TIMEZONE;
  }
  match timezone.parse::<Tz>() {
    Ok(timezone) => timezone,
    Err(_) => {
      warn!("cron 任务时区无法识别: {timezone}, 兜底使用 Asia/Shanghai");
      DEFAULT_TIMEZONE
    }
  }
}

/// 按 cron 表达式排期, 同一 seq 重复排期会先取消旧任务
fn schedule_task(cron_job_model: CronJobModel) -> Result<()> {
  let task_id = cron_job_model.seq as u64;
  
  let timezone = parse_timezone(cron_job_model.timezone.as_str());
  
  let schedule = Schedule::from_str(cron_job_model.cron.as_str())
    .map_err(|err| eyre!("cron 表达式非法: {}, {err}", cron_job_model.cron))?;
  
  info!("cron 任务 {task_id} 已排期, 时区 {timezone}: {}", cron_job_model.cron);
  
  let handle = tokio::spawn(run_cron_loop(schedule, timezone, cron_job_model));
  
  if let Some(old_task) = scheduled_tasks().insert(task_id, handle) {
    old_task.abort();
  }
  
  Ok(())
}

/// 循环等待下一个 cron 时间点并执行任务
async fn run_cron_loop(
  schedule: Schedule,
  timezone: Tz,
  cron_job_model: CronJobModel,
) {
  let task_id = cron_job_model.seq as u64;
  let cron = cron_job_model.cron.clone();
  
  loop {
    // cron 表达式按任务自己的时区解释, 睡眠时长换算回 UTC
    let now = Utc::now().with_timezone(&timezone);
    
    // 每次都从当前时间重新计算, 任务执行超时不会补跑堆积的时间点
    let Some(next) = schedule.after(&now).next() else {
      error!("cron 任务 {task_id} 无后续执行时间, 停止排期: {cron} ({timezone})");
      return;
    };
    
    let wait = (next.with_timezone(&Utc) - Utc::now())
      .to_std()
      .unwrap_or(Duration::ZERO);
    tokio::time::sleep(wait).await;
    
    if let Err(err) = run_cron_job_once(&cron_job_model).await {
      error!("cron 任务 {task_id} 执行失败: {err:?}");
    }
  }
}

/// 执行一次定时任务
async fn run_cron_job_once(cron_job_model: &CronJobModel) -> Result<String> {
  let tenant_id = cron_job_model.tenant_id;
  
  CtxBuilder::new(None)
    .with_auth_model(build_cron_auth_model(
      tenant_id,
      cron_job_model.exec_usr_id,
      cron_job_model.org_id,
    ))?
    .build()
    .scope(run_job(
      cron_job_model.job_id,
      cron_job_model.id,
      cron_job_model.cron.clone(),
      tenant_id,
      None,
    )).await
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
  
  schedule_task(cron_job_model)?;
  
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
  
  if let Some(task) = scheduled_tasks().remove(&task_id) {
    task.abort();
  }
  
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
  
  info!("init_cron_jobs: {:?}", cron_job_models.iter().map(|m| m.lbl.as_str()).collect::<Vec<_>>());
  
  for cron_job_model in cron_job_models {
    
    if let Err(err) = schedule_task(cron_job_model) {
      error!("cron 任务排期失败, 已跳过: {err:?}");
    }
    
  }
  
  Ok(())
}
