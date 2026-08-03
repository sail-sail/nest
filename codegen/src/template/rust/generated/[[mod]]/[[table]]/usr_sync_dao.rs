<#
const syncTables = usrLblSyncTables;
#>#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

use color_eyre::eyre::Result;
#[allow(unused_imports)]
use tracing::info;

use crate::common::context::{
  Options,
  get_is_debug,
  get_req_id,
};

use super::usr_model::UsrId;

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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let futures: Vec<std::pin::Pin<Box<dyn std::future::Future<Output = Result<u64>> + Send>>> = vec![<#
    for (let i = 0; i < syncTables.length; i++) {
      const item = syncTables[i];
    #>
    
    Box::pin(crate::<#=item.mod#>::<#=item.table#>::<#=item.table#>_dao::sync_usr_lbl_by_usr_id_<#=item.table#>(
      usr_id,
      options,
    )),<#
    }
    #>
  ];

  let results = futures::future::try_join_all(futures).await?;
  let num = results.into_iter().sum::<u64>();

  Ok(num)
}