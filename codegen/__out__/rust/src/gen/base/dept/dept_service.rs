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

use crate::gen::base::org::org_model::OrgId;

use crate::gen::base::usr::usr_dao::{
  find_by_id as find_by_id_usr,
  validate_option as validate_option_usr,
};

use super::dept_model::*;
use super::dept_dao;

/// 根据搜索条件和分页查找部门列表
pub async fn find_all(
  search: Option<DeptSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DeptModel>> {
  
  let mut search = search.unwrap_or_default();
  
  let usr_id = get_auth_id_err()?;
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id.clone(),
      None,
    ).await?,
  ).await?;
  
  let username = usr_model.username;
  let org_id = get_auth_org_id();
  
  if let Some(org_id) = org_id {
    if username != "admin" {
      search.org_id = Some(vec![org_id]);
    }
  }
  
  let search = Some(search);
  
  let res = dept_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找部门总数
pub async fn find_count(
  search: Option<DeptSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = dept_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个部门
pub async fn find_one(
  search: Option<DeptSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DeptModel>> {
  
  let model = dept_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找部门
pub async fn find_by_id(
  id: DeptId,
  options: Option<Options>,
) -> Result<Option<DeptModel>> {
  
  let model = dept_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: DeptInput,
) -> Result<DeptInput> {
  
  let input = dept_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建部门
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DeptInput>,
  options: Option<Options>,
) -> Result<Vec<DeptId>> {
  
  let ids = dept_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 部门根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: DeptId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 部门根据id修改组织id
#[allow(dead_code)]
pub async fn update_org_by_id(
  id: DeptId,
  org_id: OrgId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::update_org_by_id(
    id,
    org_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改部门
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: DeptId,
  mut input: DeptInput,
  options: Option<Options>,
) -> Result<DeptId> {
  
  let is_locked = dept_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = ns(
      "部门".to_owned(),
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
  
  let res = dept_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除部门
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = dept_dao::find_all(
    Some(DeptSearch {
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
        "部门".to_owned(),
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
  
  let num = dept_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找部门是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DeptId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dept_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用部门
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DeptId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找部门是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: DeptId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = dept_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁部门
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<DeptId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取部门字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DeptFieldComment> {
  
  let comments = dept_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原部门
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除部门
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 部门 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dept_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}