#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use anyhow::{Result,anyhow};

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use crate::gen::base::tenant::tenant_model::TenantId;

use super::usr_model::*;
use super::usr_dao;

/// 根据搜索条件和分页查找用户列表
pub async fn find_all(
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let res = usr_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找用户总数
pub async fn find_count(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = usr_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个用户
pub async fn find_one(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let model = usr_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找用户
pub async fn find_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let model = usr_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: UsrInput,
) -> Result<UsrInput> {
  
  let input = usr_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建用户
#[allow(dead_code)]
pub async fn create(
  input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let id = usr_dao::create(
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
  
  let num = usr_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改用户
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: UsrId,
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let is_locked = usr_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = i18n_dao::ns(
      "用户".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  
  let res = usr_dao::update_by_id(
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
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<UsrId> = vec![];
  for id in ids0 {
    let is_locked = usr_dao::get_is_locked_by_id(
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let table_comment = i18n_dao::ns(
      "用户".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能删除已经锁定的 {0}",
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  let ids = ids;
  
  let num = usr_dao::delete_by_ids(
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
  
  let is_enabled = usr_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用用户
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<UsrId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_dao::enable_by_ids(
    ids,
    is_locked,
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
  
  let is_locked = usr_dao::get_is_locked_by_id(
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
  
  let num = usr_dao::lock_by_ids(
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
  
  let comments = usr_dao::get_field_comments(
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
  
  let num = usr_dao::revert_by_ids(
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
  
  let num = usr_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 用户 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = usr_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
