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

use super::tenant_model::*;
use super::tenant_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut TenantSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找租户列表
pub async fn find_all(
  search: Option<TenantSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = tenant_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找租户总数
pub async fn find_count(
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = tenant_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个租户
pub async fn find_one(
  search: Option<TenantSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = tenant_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找租户
pub async fn find_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let model = tenant_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: TenantInput,
) -> Result<TenantInput> {
  
  let input = tenant_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建租户
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<TenantInput>,
  options: Option<Options>,
) -> Result<Vec<TenantId>> {
  
  let tenant_ids = tenant_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(tenant_ids)
}

/// 根据 id 修改租户
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: TenantId,
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<TenantId> {
  
  let is_locked = tenant_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 租户";
    return Err(eyre!(err_msg));
  }
  
  let tenant_id = tenant_dao::update_by_id(
    id,
    input,
    options.clone(),
  ).await?;
  
  Ok(tenant_id)
}

/// 校验租户是否存在
#[allow(dead_code)]
pub async fn validate_option(
  model: Option<TenantModel>,
) -> Result<TenantModel> {
  
  let model = tenant_dao::validate_option(model).await?;
  
  Ok(model)
}

/// 根据 ids 删除租户
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = tenant_dao::find_all(
    Some(TenantSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 租户";
      return Err(eyre!(err_msg));
    }
  }
  
  let models = tenant_dao::find_all(
    Some(TenantSearch {
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
  
  let num = tenant_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找租户是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = tenant_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用租户
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<TenantId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找租户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = tenant_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁租户
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<TenantId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取租户字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<TenantFieldComment> {
  
  let comments = tenant_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原租户
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除租户
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 租户 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = tenant_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
