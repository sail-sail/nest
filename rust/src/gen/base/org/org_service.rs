#[allow(unused_imports)]
use std::collections::HashMap;

use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use crate::gen::base::tenant::tenant_model::TenantId;

use super::org_model::*;
use super::org_dao;

/// 根据搜索条件和分页查找组织列表
pub async fn find_all(
  search: Option<OrgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OrgModel>> {
  
  let res = org_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找组织总数
pub async fn find_count(
  search: Option<OrgSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = org_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个组织
pub async fn find_one(
  search: Option<OrgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OrgModel>> {
  
  let model = org_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找组织
pub async fn find_by_id(
  id: OrgId,
  options: Option<Options>,
) -> Result<Option<OrgModel>> {
  
  let model = org_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: OrgInput,
) -> Result<OrgInput> {
  
  let input = org_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建组织
#[allow(dead_code)]
pub async fn create(
  input: OrgInput,
  options: Option<Options>,
) -> Result<OrgId> {
  
  let id = org_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 组织根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: OrgId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改组织
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: OrgId,
  mut input: OrgInput,
  options: Option<Options>,
) -> Result<OrgId> {
  
  let is_locked = org_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = i18n_dao::ns(
      "组织".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  let res = org_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除组织
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<OrgId> = vec![];
  for id in ids0 {
    let is_locked = org_dao::get_is_locked_by_id(
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
      "组织".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能删除已经锁定的 {0}",
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  let ids = ids;
  
  let num = org_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找组织是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: OrgId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = org_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用组织
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<OrgId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找组织是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: OrgId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = org_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁组织
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<OrgId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取组织字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<OrgFieldComment> {
  
  let comments = org_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原组织
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除组织
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 组织 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = org_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}