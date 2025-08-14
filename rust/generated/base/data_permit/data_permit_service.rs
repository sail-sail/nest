
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

use super::data_permit_model::*;
use super::data_permit_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DataPermitSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找数据权限列表
pub async fn find_all_data_permit(
  search: Option<DataPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let data_permit_models = data_permit_dao::find_all_data_permit(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(data_permit_models)
}

/// 根据条件查找数据权限总数
pub async fn find_count_data_permit(
  search: Option<DataPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let data_permit_num = data_permit_dao::find_count_data_permit(
    Some(search),
    options,
  ).await?;
  
  Ok(data_permit_num)
}

/// 根据条件查找第一个数据权限
pub async fn find_one_data_permit(
  search: Option<DataPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let data_permit_model = data_permit_dao::find_one_data_permit(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(data_permit_model)
}

/// 根据条件查找第一个数据权限, 如果不存在则抛错
pub async fn find_one_ok_data_permit(
  search: Option<DataPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DataPermitModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let data_permit_model = data_permit_dao::find_one_ok_data_permit(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(data_permit_model)
}

/// 根据 id 查找数据权限
pub async fn find_by_id_data_permit(
  data_permit_id: DataPermitId,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let data_permit_model = data_permit_dao::find_by_id_data_permit(
    data_permit_id,
    options,
  ).await?;
  
  Ok(data_permit_model)
}

/// 根据 id 查找数据权限, 如果不存在则抛错
pub async fn find_by_id_ok_data_permit(
  data_permit_id: DataPermitId,
  options: Option<Options>,
) -> Result<DataPermitModel> {
  
  let data_permit_model = data_permit_dao::find_by_id_ok_data_permit(
    data_permit_id,
    options,
  ).await?;
  
  Ok(data_permit_model)
}

/// 根据 ids 查找数据权限
pub async fn find_by_ids_data_permit(
  data_permit_ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  let data_permit_models = data_permit_dao::find_by_ids_data_permit(
    data_permit_ids,
    options,
  ).await?;
  
  Ok(data_permit_models)
}

/// 根据 ids 查找数据权限, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_data_permit(
  data_permit_ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  let data_permit_models = data_permit_dao::find_by_ids_ok_data_permit(
    data_permit_ids,
    options,
  ).await?;
  
  Ok(data_permit_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_data_permit(
  data_permit_input: DataPermitInput,
) -> Result<DataPermitInput> {
  
  let data_permit_input = data_permit_dao::set_id_by_lbl_data_permit(
    data_permit_input,
  ).await?;
  
  Ok(data_permit_input)
}

/// 创建数据权限
#[allow(dead_code)]
pub async fn creates_data_permit(
  data_permit_inputs: Vec<DataPermitInput>,
  options: Option<Options>,
) -> Result<Vec<DataPermitId>> {
  
  let data_permit_ids = data_permit_dao::creates_data_permit(
    data_permit_inputs,
    options,
  ).await?;
  
  Ok(data_permit_ids)
}

/// 数据权限根据 data_permit_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_data_permit(
  data_permit_id: DataPermitId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_dao::update_tenant_by_id_data_permit(
    data_permit_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 data_permit_id 修改数据权限
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_data_permit(
  data_permit_id: DataPermitId,
  mut data_permit_input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
  let old_model = validate_option_data_permit(
    data_permit_dao::find_by_id_data_permit(
      data_permit_id,
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 菜单
    data_permit_input.menu_id = None;
    data_permit_input.menu_id_lbl = None;
    // 范围
    data_permit_input.scope = None;
    data_permit_input.scope_lbl = None;
  }
  
  let data_permit_id = data_permit_dao::update_by_id_data_permit(
    data_permit_id,
    data_permit_input,
    options.clone(),
  ).await?;
  
  Ok(data_permit_id)
}

/// 校验数据权限是否存在
#[allow(dead_code)]
pub async fn validate_option_data_permit(
  data_permit_model: Option<DataPermitModel>,
) -> Result<DataPermitModel> {
  
  let data_permit_model = data_permit_dao::validate_option_data_permit(data_permit_model).await?;
  
  Ok(data_permit_model)
}

/// 根据 data_permit_ids 删除数据权限
#[allow(dead_code)]
pub async fn delete_by_ids_data_permit(
  data_permit_ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = data_permit_dao::find_all_data_permit(
    Some(DataPermitSearch {
      ids: Some(data_permit_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = data_permit_dao::delete_by_ids_data_permit(
    data_permit_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取数据权限字段注释
pub async fn get_field_comments_data_permit(
  options: Option<Options>,
) -> Result<DataPermitFieldComment> {
  
  let comments = data_permit_dao::get_field_comments_data_permit(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 data_permit_ids 还原数据权限
#[allow(dead_code)]
pub async fn revert_by_ids_data_permit(
  data_permit_ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_dao::revert_by_ids_data_permit(
    data_permit_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 data_permit_ids 彻底删除数据权限
#[allow(dead_code)]
pub async fn force_delete_by_ids_data_permit(
  data_permit_ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_dao::force_delete_by_ids_data_permit(
    data_permit_ids,
    options,
  ).await?;
  
  Ok(num)
}
