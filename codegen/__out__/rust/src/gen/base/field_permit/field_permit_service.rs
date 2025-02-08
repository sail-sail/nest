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

use super::field_permit_model::*;
use super::field_permit_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut FieldPermitSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找字段权限列表
pub async fn find_all(
  search: Option<FieldPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = field_permit_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找字段权限总数
pub async fn find_count(
  search: Option<FieldPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = field_permit_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个字段权限
pub async fn find_one(
  search: Option<FieldPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = field_permit_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找字段权限
pub async fn find_by_id(
  id: FieldPermitId,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  let model = field_permit_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: FieldPermitInput,
) -> Result<FieldPermitInput> {
  
  let input = field_permit_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建字段权限
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<FieldPermitInput>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitId>> {
  
  let field_permit_ids = field_permit_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(field_permit_ids)
}

/// 根据 id 修改字段权限
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: FieldPermitId,
  mut input: FieldPermitInput,
  options: Option<Options>,
) -> Result<FieldPermitId> {
  
  let old_model = field_permit_dao::validate_option(
    field_permit_dao::find_by_id(
      id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 菜单
    input.menu_id = None;
    input.menu_id_lbl = None;
    // 编码
    input.code = None;
  }
  
  let field_permit_id = field_permit_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(field_permit_id)
}

/// 根据 ids 删除字段权限
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<FieldPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = field_permit_dao::find_all(
    Some(FieldPermitSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = field_permit_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段权限字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<FieldPermitFieldComment> {
  
  let comments = field_permit_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 查找 字段权限 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = field_permit_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
