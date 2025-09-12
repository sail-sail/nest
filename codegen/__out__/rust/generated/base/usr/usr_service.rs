
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::usr_model::*;
use super::usr_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut UsrSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找用户列表
pub async fn find_all_usr(
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let usr_models = usr_dao::find_all_usr(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(usr_models)
}

/// 根据条件查找用户总数
pub async fn find_count_usr(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let usr_num = usr_dao::find_count_usr(
    Some(search),
    options,
  ).await?;
  
  Ok(usr_num)
}

/// 根据条件查找第一个用户
pub async fn find_one_usr(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let usr_model = usr_dao::find_one_usr(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(usr_model)
}

/// 根据条件查找第一个用户, 如果不存在则抛错
pub async fn find_one_ok_usr(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<UsrModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let usr_model = usr_dao::find_one_ok_usr(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(usr_model)
}

/// 根据 id 查找用户
pub async fn find_by_id_usr(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let usr_model = usr_dao::find_by_id_usr(
    usr_id,
    options,
  ).await?;
  
  Ok(usr_model)
}

/// 根据 id 查找用户, 如果不存在则抛错
pub async fn find_by_id_ok_usr(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<UsrModel> {
  
  let usr_model = usr_dao::find_by_id_ok_usr(
    usr_id,
    options,
  ).await?;
  
  Ok(usr_model)
}

/// 根据 ids 查找用户
pub async fn find_by_ids_usr(
  usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let usr_models = usr_dao::find_by_ids_usr(
    usr_ids,
    options,
  ).await?;
  
  Ok(usr_models)
}

/// 根据 ids 查找用户, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_usr(
  usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let usr_models = usr_dao::find_by_ids_ok_usr(
    usr_ids,
    options,
  ).await?;
  
  Ok(usr_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_usr(
  usr_input: UsrInput,
) -> Result<UsrInput> {
  
  let usr_input = usr_dao::set_id_by_lbl_usr(
    usr_input,
  ).await?;
  
  Ok(usr_input)
}

/// 创建用户
#[allow(dead_code)]
pub async fn creates_usr(
  usr_inputs: Vec<UsrInput>,
  options: Option<Options>,
) -> Result<Vec<UsrId>> {
  
  let usr_ids = usr_dao::creates_usr(
    usr_inputs,
    options,
  ).await?;
  
  Ok(usr_ids)
}

/// 用户根据 usr_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_usr(
  usr_id: UsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_dao::update_tenant_by_id_usr(
    usr_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 usr_id 修改用户
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_usr(
  usr_id: UsrId,
  mut usr_input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let is_locked = usr_dao::get_is_locked_by_id_usr(
    usr_id,
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 用户";
    return Err(eyre!(err_msg));
  }
  
  let usr_id = usr_dao::update_by_id_usr(
    usr_id,
    usr_input,
    options.clone(),
  ).await?;
  
  Ok(usr_id)
}

/// 校验用户是否存在
#[allow(dead_code)]
pub async fn validate_option_usr(
  usr_model: Option<UsrModel>,
) -> Result<UsrModel> {
  
  let usr_model = usr_dao::validate_option_usr(usr_model).await?;
  
  Ok(usr_model)
}

/// 根据 usr_ids 删除用户
#[allow(dead_code)]
pub async fn delete_by_ids_usr(
  usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = usr_dao::find_all_usr(
    Some(UsrSearch {
      ids: Some(usr_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 用户";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = usr_dao::delete_by_ids_usr(
    usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 usr_id 查找用户是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_usr(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = usr_dao::get_is_enabled_by_id_usr(
    usr_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 usr_ids 启用或者禁用用户
#[allow(dead_code)]
pub async fn enable_by_ids_usr(
  usr_ids: Vec<UsrId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_dao::enable_by_ids_usr(
    usr_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 usr_id 查找用户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_usr(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = usr_dao::get_is_locked_by_id_usr(
    usr_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 usr_ids 锁定或者解锁用户
#[allow(dead_code)]
pub async fn lock_by_ids_usr(
  usr_ids: Vec<UsrId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_dao::lock_by_ids_usr(
    usr_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取用户字段注释
pub async fn get_field_comments_usr(
  options: Option<Options>,
) -> Result<UsrFieldComment> {
  
  let comments = usr_dao::get_field_comments_usr(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 usr_ids 还原用户
#[allow(dead_code)]
pub async fn revert_by_ids_usr(
  usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_dao::revert_by_ids_usr(
    usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 usr_ids 彻底删除用户
#[allow(dead_code)]
pub async fn force_delete_by_ids_usr(
  usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = usr_dao::force_delete_by_ids_usr(
    usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 用户 order_by 字段的最大值
pub async fn find_last_order_by_usr(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = usr_dao::find_last_order_by_usr(
    options,
  ).await?;
  
  Ok(res)
}
