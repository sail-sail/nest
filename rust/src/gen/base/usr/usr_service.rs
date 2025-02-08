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

use super::usr_model::*;
use super::usr_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut UsrSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找用户列表
pub async fn find_all(
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = usr_dao::find_all(
    Some(search),
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
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = usr_dao::find_count(
    Some(search),
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
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = usr_dao::find_one(
    Some(search),
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
#[allow(dead_code)]
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
pub async fn creates(
  inputs: Vec<UsrInput>,
  options: Option<Options>,
) -> Result<Vec<UsrId>> {
  
  let usr_ids = usr_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(usr_ids)
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
#[allow(dead_code, unused_mut)]
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
    let err_msg = "不能修改已经锁定的 用户";
    return Err(eyre!(err_msg));
  }
  
  let usr_id = usr_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(usr_id)
}

/// 根据 ids 删除用户
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = usr_dao::find_all(
    Some(UsrSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 用户";
      return Err(eyre!(err_msg));
    }
  }
  
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
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_dao::enable_by_ids(
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
