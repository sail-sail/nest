
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

use super::role_model::*;
use super::role_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut RoleSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找角色列表
pub async fn find_all_role(
  search: Option<RoleSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let role_models = role_dao::find_all_role(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(role_models)
}

/// 根据条件查找角色总数
pub async fn find_count_role(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let role_num = role_dao::find_count_role(
    Some(search),
    options,
  ).await?;
  
  Ok(role_num)
}

/// 根据条件查找第一个角色
pub async fn find_one_role(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let role_model = role_dao::find_one_role(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(role_model)
}

/// 根据条件查找第一个角色, 如果不存在则抛错
pub async fn find_one_ok_role(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<RoleModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let role_model = role_dao::find_one_ok_role(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(role_model)
}

/// 根据 id 查找角色
pub async fn find_by_id_role(
  role_id: RoleId,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let role_model = role_dao::find_by_id_role(
    role_id,
    options,
  ).await?;
  
  Ok(role_model)
}

/// 根据 id 查找角色, 如果不存在则抛错
pub async fn find_by_id_ok_role(
  role_id: RoleId,
  options: Option<Options>,
) -> Result<RoleModel> {
  
  let role_model = role_dao::find_by_id_ok_role(
    role_id,
    options,
  ).await?;
  
  Ok(role_model)
}

/// 根据 ids 查找角色
pub async fn find_by_ids_role(
  role_ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let role_models = role_dao::find_by_ids_role(
    role_ids,
    options,
  ).await?;
  
  Ok(role_models)
}

/// 根据 ids 查找角色, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_role(
  role_ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let role_models = role_dao::find_by_ids_ok_role(
    role_ids,
    options,
  ).await?;
  
  Ok(role_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_role(
  role_input: RoleInput,
) -> Result<RoleInput> {
  
  let role_input = role_dao::set_id_by_lbl_role(
    role_input,
  ).await?;
  
  Ok(role_input)
}

/// 创建角色
#[allow(dead_code)]
pub async fn creates_role(
  role_inputs: Vec<RoleInput>,
  options: Option<Options>,
) -> Result<Vec<RoleId>> {
  
  let role_ids = role_dao::creates_role(
    role_inputs,
    options,
  ).await?;
  
  Ok(role_ids)
}

/// 角色根据 role_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_role(
  role_id: RoleId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::update_tenant_by_id_role(
    role_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 role_id 修改角色
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_role(
  role_id: RoleId,
  mut role_input: RoleInput,
  options: Option<Options>,
) -> Result<RoleId> {
  
  let is_locked = role_dao::get_is_locked_by_id_role(
    role_id,
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 角色";
    return Err(eyre!(err_msg));
  }
  
  let role_id = role_dao::update_by_id_role(
    role_id,
    role_input,
    options.clone(),
  ).await?;
  
  Ok(role_id)
}

/// 校验角色是否存在
#[allow(dead_code)]
pub async fn validate_option_role(
  role_model: Option<RoleModel>,
) -> Result<RoleModel> {
  
  let role_model = role_dao::validate_option_role(role_model).await?;
  
  Ok(role_model)
}

/// 根据 role_ids 删除角色
#[allow(dead_code)]
pub async fn delete_by_ids_role(
  role_ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = role_dao::find_all_role(
    Some(RoleSearch {
      ids: Some(role_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 角色";
      return Err(eyre!(err_msg));
    }
  }
  
  for old_model in &old_models {
    if old_model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = role_dao::delete_by_ids_role(
    role_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 role_id 查找角色是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_role(
  role_id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = role_dao::get_is_enabled_by_id_role(
    role_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 role_ids 启用或者禁用角色
#[allow(dead_code)]
pub async fn enable_by_ids_role(
  role_ids: Vec<RoleId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::enable_by_ids_role(
    role_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 role_id 查找角色是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_role(
  role_id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = role_dao::get_is_locked_by_id_role(
    role_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 role_ids 锁定或者解锁角色
#[allow(dead_code)]
pub async fn lock_by_ids_role(
  role_ids: Vec<RoleId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::lock_by_ids_role(
    role_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取角色字段注释
pub async fn get_field_comments_role(
  options: Option<Options>,
) -> Result<RoleFieldComment> {
  
  let comments = role_dao::get_field_comments_role(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 role_ids 还原角色
#[allow(dead_code)]
pub async fn revert_by_ids_role(
  role_ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::revert_by_ids_role(
    role_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 role_ids 彻底删除角色
#[allow(dead_code)]
pub async fn force_delete_by_ids_role(
  role_ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::force_delete_by_ids_role(
    role_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 角色 order_by 字段的最大值
pub async fn find_last_order_by_role(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = role_dao::find_last_order_by_role(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
