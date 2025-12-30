
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

use super::org_model::*;
use super::org_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut OrgSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找组织列表
pub async fn find_all_org(
  search: Option<OrgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OrgModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let org_models = org_dao::find_all_org(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(org_models)
}

/// 根据条件查找组织总数
pub async fn find_count_org(
  search: Option<OrgSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let org_num = org_dao::find_count_org(
    Some(search),
    options,
  ).await?;
  
  Ok(org_num)
}

/// 根据条件查找第一个组织
pub async fn find_one_org(
  search: Option<OrgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OrgModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let org_model = org_dao::find_one_org(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(org_model)
}

/// 根据条件查找第一个组织, 如果不存在则抛错
pub async fn find_one_ok_org(
  search: Option<OrgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<OrgModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let org_model = org_dao::find_one_ok_org(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(org_model)
}

/// 根据 id 查找组织
pub async fn find_by_id_org(
  org_id: OrgId,
  options: Option<Options>,
) -> Result<Option<OrgModel>> {
  
  let org_model = org_dao::find_by_id_org(
    org_id,
    options,
  ).await?;
  
  Ok(org_model)
}

/// 根据 id 查找组织, 如果不存在则抛错
pub async fn find_by_id_ok_org(
  org_id: OrgId,
  options: Option<Options>,
) -> Result<OrgModel> {
  
  let org_model = org_dao::find_by_id_ok_org(
    org_id,
    options,
  ).await?;
  
  Ok(org_model)
}

/// 根据 ids 查找组织
pub async fn find_by_ids_org(
  org_ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<Vec<OrgModel>> {
  
  let org_models = org_dao::find_by_ids_org(
    org_ids,
    options,
  ).await?;
  
  Ok(org_models)
}

/// 根据 ids 查找组织, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_org(
  org_ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<Vec<OrgModel>> {
  
  let org_models = org_dao::find_by_ids_ok_org(
    org_ids,
    options,
  ).await?;
  
  Ok(org_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_org(
  org_input: OrgInput,
) -> Result<OrgInput> {
  
  let org_input = org_dao::set_id_by_lbl_org(
    org_input,
  ).await?;
  
  Ok(org_input)
}

/// 创建组织
#[allow(dead_code)]
pub async fn creates_org(
  org_inputs: Vec<OrgInput>,
  options: Option<Options>,
) -> Result<Vec<OrgId>> {
  
  let org_ids = org_dao::creates_org(
    org_inputs,
    options,
  ).await?;
  
  Ok(org_ids)
}

/// 组织根据 org_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_org(
  org_id: OrgId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::update_tenant_by_id_org(
    org_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 org_id 修改组织
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_org(
  org_id: OrgId,
  mut org_input: OrgInput,
  options: Option<Options>,
) -> Result<OrgId> {
  
  let is_locked = org_dao::get_is_locked_by_id_org(
    org_id,
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 组织";
    return Err(eyre!(err_msg));
  }
  
  let org_id = org_dao::update_by_id_org(
    org_id,
    org_input,
    options.clone(),
  ).await?;
  
  Ok(org_id)
}

/// 校验组织是否存在
#[allow(dead_code)]
pub async fn validate_option_org(
  org_model: Option<OrgModel>,
) -> Result<OrgModel> {
  
  let org_model = org_dao::validate_option_org(org_model).await?;
  
  Ok(org_model)
}

/// 根据 org_ids 删除组织
#[allow(dead_code)]
pub async fn delete_by_ids_org(
  org_ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = org_dao::find_all_org(
    Some(OrgSearch {
      ids: Some(org_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 组织";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = org_dao::delete_by_ids_org(
    org_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 org_id 查找组织是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_org(
  org_id: OrgId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = org_dao::get_is_enabled_by_id_org(
    org_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 org_ids 启用或者禁用组织
#[allow(dead_code)]
pub async fn enable_by_ids_org(
  org_ids: Vec<OrgId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::enable_by_ids_org(
    org_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 org_id 查找组织是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_org(
  org_id: OrgId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = org_dao::get_is_locked_by_id_org(
    org_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 org_ids 锁定或者解锁组织
#[allow(dead_code)]
pub async fn lock_by_ids_org(
  org_ids: Vec<OrgId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::lock_by_ids_org(
    org_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取组织字段注释
pub async fn get_field_comments_org(
  options: Option<Options>,
) -> Result<OrgFieldComment> {
  
  let comments = org_dao::get_field_comments_org(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 org_ids 还原组织
#[allow(dead_code)]
pub async fn revert_by_ids_org(
  org_ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::revert_by_ids_org(
    org_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 org_ids 彻底删除组织
#[allow(dead_code)]
pub async fn force_delete_by_ids_org(
  org_ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = org_dao::force_delete_by_ids_org(
    org_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 组织 order_by 字段的最大值
pub async fn find_last_order_by_org(
  search: Option<OrgSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = org_dao::find_last_order_by_org(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
