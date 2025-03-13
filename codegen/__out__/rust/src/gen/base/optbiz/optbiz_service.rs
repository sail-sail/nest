#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::optbiz_model::*;
use super::optbiz_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut OptbizSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找业务选项列表
pub async fn find_all(
  search: Option<OptbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptbizModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = optbiz_dao::find_all(
    Some(search),
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
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = optbiz_dao::find_count(
    Some(search),
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
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let model = optbiz_dao::find_one(
    Some(search),
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
#[allow(dead_code)]
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
  
  let optbiz_ids = optbiz_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(optbiz_ids)
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
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: OptbizId,
  mut input: OptbizInput,
  options: Option<Options>,
) -> Result<OptbizId> {
  
  let old_model = validate_option(
    optbiz_dao::find_by_id(
      id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  let is_locked = optbiz_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 业务选项";
    return Err(eyre!(err_msg));
  }
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 名称
    input.lbl = None;
    // 键
    input.ky = None;
  }
  
  let optbiz_id = optbiz_dao::update_by_id(
    id,
    input,
    options.clone(),
  ).await?;
  
  Ok(optbiz_id)
}

/// 校验业务选项是否存在
#[allow(dead_code)]
pub async fn validate_option(
  model: Option<OptbizModel>,
) -> Result<OptbizModel> {
  
  let model = optbiz_dao::validate_option(model).await?;
  
  Ok(model)
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
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 业务选项";
      return Err(eyre!(err_msg));
    }
  }
  
  let models = optbiz_dao::find_all(
    Some(OptbizSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
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
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = optbiz_dao::enable_by_ids(
    ids,
    is_enabled,
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
