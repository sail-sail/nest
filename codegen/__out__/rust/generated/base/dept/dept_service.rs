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

use crate::base::org::org_model::OrgId;

use crate::base::usr::usr_dao::{
  find_by_id_usr,
  validate_option_usr,
};

use crate::common::usr::usr_dao::is_admin;

use super::dept_model::*;
use super::dept_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DeptSearch,
  options: Option<Options>,
) -> Result<()> {
  
  let usr_id = get_auth_id_ok()?;
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  let org_id = get_auth_org_id().unwrap_or_default();
  let mut org_ids: Vec<OrgId> = vec![];
  if !org_id.is_empty() {
    org_ids.push(org_id);
  } else {
    org_ids.append(&mut usr_model.org_ids.clone());
    org_ids.push(OrgId::default());
  }
  
  if !is_admin(usr_id.clone(), options.clone()).await? {
    search.org_id = Some(org_ids);
  }
  Ok(())
}

/// 根据搜索条件和分页查找部门列表
pub async fn find_all_dept(
  search: Option<DeptSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DeptModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dept_models = dept_dao::find_all_dept(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dept_models)
}

/// 根据条件查找部门总数
pub async fn find_count_dept(
  search: Option<DeptSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dept_num = dept_dao::find_count_dept(
    Some(search),
    options,
  ).await?;
  
  Ok(dept_num)
}

/// 根据条件查找第一个部门
pub async fn find_one_dept(
  search: Option<DeptSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DeptModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dept_model = dept_dao::find_one_dept(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dept_model)
}

/// 根据 id 查找部门
pub async fn find_by_id_dept(
  dept_id: DeptId,
  options: Option<Options>,
) -> Result<Option<DeptModel>> {
  
  let dept_model = dept_dao::find_by_id_dept(
    dept_id,
    options,
  ).await?;
  
  Ok(dept_model)
}

/// 根据 dept_ids 查找部门
pub async fn find_by_ids_dept(
  dept_ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<Vec<DeptModel>> {
  
  let dept_models = dept_dao::find_by_ids_dept(
    dept_ids,
    options,
  ).await?;
  
  Ok(dept_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_dept(
  dept_input: DeptInput,
) -> Result<DeptInput> {
  
  let dept_input = dept_dao::set_id_by_lbl_dept(
    dept_input,
  ).await?;
  
  Ok(dept_input)
}

/// 创建部门
#[allow(dead_code)]
pub async fn creates_dept(
  dept_inputs: Vec<DeptInput>,
  options: Option<Options>,
) -> Result<Vec<DeptId>> {
  
  let dept_ids = dept_dao::creates_dept(
    dept_inputs,
    options,
  ).await?;
  
  Ok(dept_ids)
}

/// 部门根据 dept_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_dept(
  dept_id: DeptId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::update_tenant_by_id_dept(
    dept_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dept_id 修改部门
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_dept(
  dept_id: DeptId,
  mut dept_input: DeptInput,
  options: Option<Options>,
) -> Result<DeptId> {
  
  let is_locked = dept_dao::get_is_locked_by_id_dept(
    dept_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 部门";
    return Err(eyre!(err_msg));
  }
  
  let dept_id = dept_dao::update_by_id_dept(
    dept_id,
    dept_input,
    options.clone(),
  ).await?;
  
  Ok(dept_id)
}

/// 校验部门是否存在
#[allow(dead_code)]
pub async fn validate_option_dept(
  dept_model: Option<DeptModel>,
) -> Result<DeptModel> {
  
  let dept_model = dept_dao::validate_option_dept(dept_model).await?;
  
  Ok(dept_model)
}

/// 根据 dept_ids 删除部门
#[allow(dead_code)]
pub async fn delete_by_ids_dept(
  dept_ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = dept_dao::find_all_dept(
    Some(DeptSearch {
      ids: Some(dept_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 部门";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = dept_dao::delete_by_ids_dept(
    dept_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dept_id 查找部门是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_dept(
  dept_id: DeptId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dept_dao::get_is_enabled_by_id_dept(
    dept_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 dept_ids 启用或者禁用部门
#[allow(dead_code)]
pub async fn enable_by_ids_dept(
  dept_ids: Vec<DeptId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::enable_by_ids_dept(
    dept_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dept_id 查找部门是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_dept(
  dept_id: DeptId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = dept_dao::get_is_locked_by_id_dept(
    dept_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 dept_ids 锁定或者解锁部门
#[allow(dead_code)]
pub async fn lock_by_ids_dept(
  dept_ids: Vec<DeptId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::lock_by_ids_dept(
    dept_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取部门字段注释
pub async fn get_field_comments_dept(
  options: Option<Options>,
) -> Result<DeptFieldComment> {
  
  let comments = dept_dao::get_field_comments_dept(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dept_ids 还原部门
#[allow(dead_code)]
pub async fn revert_by_ids_dept(
  dept_ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::revert_by_ids_dept(
    dept_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dept_ids 彻底删除部门
#[allow(dead_code)]
pub async fn force_delete_by_ids_dept(
  dept_ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_dao::force_delete_by_ids_dept(
    dept_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 部门 order_by 字段的最大值
pub async fn find_last_order_by_dept(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dept_dao::find_last_order_by_dept(
    options,
  ).await?;
  
  Ok(res)
}
