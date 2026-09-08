#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

use std::future::Future;
use std::pin::Pin;
use std::sync::{Arc, Mutex, OnceLock};

use color_eyre::eyre::Result;
#[allow(unused_imports)]
use tracing::info;

use crate::common::context::{
  Options,
  get_is_debug,
  get_req_id,
};

use super::usr_model::UsrId;

pub type SyncUsrLblByUsrIdCallback = Arc<dyn Fn(UsrId, Option<Options>) -> Pin<Box<dyn Future<Output = Result<u64>> + Send>> + Send + Sync>;

/// 全局同步用户标签的 DAO 函数回调
/// add_sync_usr_lbl_by_usr_id_callback(|| async {
/// // 这里做同步标签逻辑
/// Ok(1)
/// });
static SYNC_USR_LBL_BY_USR_ID_CALLBACKS: OnceLock<Mutex<Vec<SyncUsrLblByUsrIdCallback>>> = OnceLock::new();

/// 全局同步用户标签的 DAO 函数回调
fn sync_usr_lbl_by_usr_id_callbacks() -> &'static Mutex<Vec<SyncUsrLblByUsrIdCallback>> {
  SYNC_USR_LBL_BY_USR_ID_CALLBACKS.get_or_init(|| Mutex::new(Vec::new()))
}

pub fn add_sync_usr_lbl_by_usr_id_callback<F, Fut>(callback: F)
where
  F: Fn(
    UsrId,
    Option<Options>,
  ) -> Fut + Send + Sync + 'static,
  Fut: Future<Output = Result<u64>> + Send + 'static,
{
  let callbacks = sync_usr_lbl_by_usr_id_callbacks();
  let mut callbacks = callbacks.lock().unwrap();
  callbacks.push(Arc::new(move |usr_id, options| Box::pin(callback(usr_id, options))));
}

// pub fn clear_sync_usr_lbl_by_usr_id_callbacks() {
//   let callbacks = sync_usr_lbl_by_usr_id_callbacks();
//   let mut callbacks = callbacks.lock().unwrap();
//   callbacks.clear();
// }

async fn call_sync_usr_lbl_by_usr_id_callbacks(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<u64> {
  let callbacks = {
    let callbacks = sync_usr_lbl_by_usr_id_callbacks();
    let callbacks = callbacks.lock().unwrap();
    callbacks.clone()
  };

  let mut result = 0;
  for callback in callbacks {
    result += callback(usr_id, options).await?;
  }
  Ok(result)
}

/// 根据 usr_id 同步所有表中的创建人/更新人/删除人标签
pub async fn sync_usr_lbl_by_usr_id(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<u64> {
  let method = "sync_usr_lbl_by_usr_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{method}:");
    msg += &format!(" usr_id: {usr_id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if usr_id.is_empty() {
    return Ok(0);
  }
  
  let num = call_sync_usr_lbl_by_usr_id_callbacks(
    usr_id,
    options,
  ).await?;
  Ok(num)
}
