#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use anyhow::{Result, anyhow};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao::ns;

use crate::gen::base::tenant::tenant_model::TenantId;

use super::optbiz_model::*;
use super::optbiz_dao;

/// 根据搜索条件和分页查找业务选项列表
pub async fn find_all(
  search: Option<OptbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptbizModel>> {
  
  let res = optbiz_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找业务选项总数
pub async fn find_count(
  search: Option<OptbizSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = optbiz_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个业务选项
pub async fn find_one(
  search: Option<OptbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OptbizModel>> {
  
  let model = optbiz_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务选项
pub async fn find_by_id(
  id: OptbizId,
  options: Option<Options>,
) -> Result<Option<OptbizModel>> {
  
  let model = optbiz_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: OptbizInput,
) -> Result<OptbizInput> {
  
  let input = optbiz_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建业务选项
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<OptbizInput>,
  options: Option<Options>,
) -> Result<Vec<OptbizId>> {
  
  let ids = optbiz_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 业务选项根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: OptbizId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = optbiz_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改业务选项
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: OptbizId,
  mut input: OptbizInput,
  options: Option<Options>,
) -> Result<OptbizId> {
  
  let is_locked = optbiz_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = ns(
      "业务选项".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  
  // 不能修改系统记录的系统字段
  let model = optbiz_dao::find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if let Some(model) = model {
    if model.is_sys == 1 {
      // 名称
      input.lbl = None;
      // 键
      input.ky = None;
    }
  }
  
  let res = optbiz_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除业务选项
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = optbiz_dao::find_all(
    Some(OptbizSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    None,
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let table_comment = ns(
        "业务选项".to_owned(),
        None,
      ).await?;
      let map = HashMap::from([
        ("0".to_owned(), table_comment),
      ]);
      let err_msg = ns(
        "不能删除已经锁定的 {0}",
        map.into(),
      ).await?;
      return Err(anyhow!(err_msg));
    }
  }
  
  let models = optbiz_dao::find_all(
    Some(OptbizSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    None,
  ).await?;
  for model in models {
    if model.is_sys == 1 {
      let err_msg = ns("不能删除系统记录".to_owned(), None).await?;
      return Err(anyhow!(err_msg));
    }
  }
  
  let num = optbiz_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务选项是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: OptbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = optbiz_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用业务选项
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<OptbizId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = optbiz_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务选项是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: OptbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = optbiz_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁业务选项
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<OptbizId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = optbiz_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务选项字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<OptbizFieldComment> {
  
  let comments = optbiz_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原业务选项
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = optbiz_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除业务选项
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = optbiz_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务选项 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = optbiz_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}