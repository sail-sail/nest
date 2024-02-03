#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::usr_model::*;
use super::usr_service;

use crate::gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找用户列表
pub async fn find_all(
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  let res = usr_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let mut res = res;
  for model in &mut res {
    // 密码
    model.password = "".to_owned();
  }
  let res = res;
  
  Ok(res)
}

/// 根据条件查找用户总数
pub async fn find_count(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  let num = usr_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个用户
pub async fn find_one(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  let model = usr_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  let mut model = model;
  if let Some(model) = &mut model {
    // 密码
    model.password = "".to_owned();
  }
  
  let model = model;
  
  Ok(model)
}

/// 根据 id 查找用户
pub async fn find_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let model = usr_service::find_by_id(
    id,
    options,
  ).await?;
  
  let mut model = model;
  if let Some(model) = &mut model {
    // 密码
    model.password = "".to_owned();
  }
  
  let model = model;
  
  Ok(model)
}

/// 创建用户
#[allow(dead_code)]
pub async fn create(
  input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let input = usr_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/usr".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = usr_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 用户根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: UsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改用户
#[allow(dead_code)]
pub async fn update_by_id(
  id: UsrId,
  input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let input = usr_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/usr".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = usr_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除用户
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/usr".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = usr_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找用户是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = usr_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用用户
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<UsrId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/usr".to_owned(),
    "enable".to_owned(),
  ).await?;
  
  let num = usr_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找用户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = usr_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁用户
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<UsrId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/usr".to_owned(),
    "lock".to_owned(),
  ).await?;
  
  let num = usr_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取用户字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<UsrFieldComment> {
  
  let comments = usr_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原用户
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/usr".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = usr_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除用户
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/usr".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = usr_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 用户 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = usr_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
