
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

use super::field_permit_model::*;
use super::field_permit_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut FieldPermitSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找字段权限列表
pub async fn find_all_field_permit(
  search: Option<FieldPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let field_permit_models = field_permit_dao::find_all_field_permit(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(field_permit_models)
}

/// 根据条件查找字段权限总数
pub async fn find_count_field_permit(
  search: Option<FieldPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let field_permit_num = field_permit_dao::find_count_field_permit(
    Some(search),
    options,
  ).await?;
  
  Ok(field_permit_num)
}

/// 根据条件查找第一个字段权限
pub async fn find_one_field_permit(
  search: Option<FieldPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let field_permit_model = field_permit_dao::find_one_field_permit(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(field_permit_model)
}

/// 根据条件查找第一个字段权限, 如果不存在则抛错
pub async fn find_one_ok_field_permit(
  search: Option<FieldPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<FieldPermitModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let field_permit_model = field_permit_dao::find_one_ok_field_permit(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(field_permit_model)
}

/// 根据 id 查找字段权限
pub async fn find_by_id_field_permit(
  field_permit_id: FieldPermitId,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  let field_permit_model = field_permit_dao::find_by_id_field_permit(
    field_permit_id,
    options,
  ).await?;
  
  Ok(field_permit_model)
}

/// 根据 id 查找字段权限, 如果不存在则抛错
pub async fn find_by_id_ok_field_permit(
  field_permit_id: FieldPermitId,
  options: Option<Options>,
) -> Result<FieldPermitModel> {
  
  let field_permit_model = field_permit_dao::find_by_id_ok_field_permit(
    field_permit_id,
    options,
  ).await?;
  
  Ok(field_permit_model)
}

/// 根据 ids 查找字段权限
pub async fn find_by_ids_field_permit(
  field_permit_ids: Vec<FieldPermitId>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let field_permit_models = field_permit_dao::find_by_ids_field_permit(
    field_permit_ids,
    options,
  ).await?;
  
  Ok(field_permit_models)
}

/// 根据 ids 查找字段权限, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_field_permit(
  field_permit_ids: Vec<FieldPermitId>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let field_permit_models = field_permit_dao::find_by_ids_ok_field_permit(
    field_permit_ids,
    options,
  ).await?;
  
  Ok(field_permit_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_field_permit(
  field_permit_input: FieldPermitInput,
) -> Result<FieldPermitInput> {
  
  let field_permit_input = field_permit_dao::set_id_by_lbl_field_permit(
    field_permit_input,
  ).await?;
  
  Ok(field_permit_input)
}

/// 创建字段权限
#[allow(dead_code)]
pub async fn creates_field_permit(
  field_permit_inputs: Vec<FieldPermitInput>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitId>> {
  
  let field_permit_ids = field_permit_dao::creates_field_permit(
    field_permit_inputs,
    options,
  ).await?;
  
  Ok(field_permit_ids)
}

/// 根据 field_permit_id 修改字段权限
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_field_permit(
  field_permit_id: FieldPermitId,
  mut field_permit_input: FieldPermitInput,
  options: Option<Options>,
) -> Result<FieldPermitId> {
  
  let old_model = validate_option_field_permit(
    field_permit_dao::find_by_id_field_permit(
      field_permit_id,
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 菜单
    field_permit_input.menu_id = None;
    field_permit_input.menu_id_lbl = None;
    // 编码
    field_permit_input.code = None;
  }
  
  let field_permit_id = field_permit_dao::update_by_id_field_permit(
    field_permit_id,
    field_permit_input,
    options.clone(),
  ).await?;
  
  Ok(field_permit_id)
}

/// 校验字段权限是否存在
#[allow(dead_code)]
pub async fn validate_option_field_permit(
  field_permit_model: Option<FieldPermitModel>,
) -> Result<FieldPermitModel> {
  
  let field_permit_model = field_permit_dao::validate_option_field_permit(field_permit_model).await?;
  
  Ok(field_permit_model)
}

/// 根据 field_permit_ids 删除字段权限
#[allow(dead_code)]
pub async fn delete_by_ids_field_permit(
  field_permit_ids: Vec<FieldPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = field_permit_dao::find_all_field_permit(
    Some(FieldPermitSearch {
      ids: Some(field_permit_ids.clone()),
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
  
  let num = field_permit_dao::delete_by_ids_field_permit(
    field_permit_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段权限字段注释
pub async fn get_field_comments_field_permit(
  options: Option<Options>,
) -> Result<FieldPermitFieldComment> {
  
  let comments = field_permit_dao::get_field_comments_field_permit(
    options,
  ).await?;
  
  Ok(comments)
}

/// 查找 字段权限 order_by 字段的最大值
pub async fn find_last_order_by_field_permit(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = field_permit_dao::find_last_order_by_field_permit(
    options,
  ).await?;
  
  Ok(res)
}
