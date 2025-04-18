#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use super::permit_model::*;
use super::permit_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut PermitSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找按钮权限列表
pub async fn find_all_permit(
  search: Option<PermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let permit_models = permit_dao::find_all_permit(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(permit_models)
}

/// 根据条件查找按钮权限总数
pub async fn find_count_permit(
  search: Option<PermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let permit_num = permit_dao::find_count_permit(
    Some(search),
    options,
  ).await?;
  
  Ok(permit_num)
}

/// 根据条件查找第一个按钮权限
pub async fn find_one_permit(
  search: Option<PermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let permit_model = permit_dao::find_one_permit(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(permit_model)
}

/// 根据 id 查找按钮权限
pub async fn find_by_id_permit(
  permit_id: PermitId,
  options: Option<Options>,
) -> Result<Option<PermitModel>> {
  
  let permit_model = permit_dao::find_by_id_permit(
    permit_id,
    options,
  ).await?;
  
  Ok(permit_model)
}

/// 根据 permit_ids 查找按钮权限
pub async fn find_by_ids_permit(
  permit_ids: Vec<PermitId>,
  options: Option<Options>,
) -> Result<Vec<PermitModel>> {
  
  let permit_models = permit_dao::find_by_ids_permit(
    permit_ids,
    options,
  ).await?;
  
  Ok(permit_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_permit(
  permit_input: PermitInput,
) -> Result<PermitInput> {
  
  let permit_input = permit_dao::set_id_by_lbl_permit(
    permit_input,
  ).await?;
  
  Ok(permit_input)
}

/// 创建按钮权限
#[allow(dead_code)]
pub async fn creates_permit(
  permit_inputs: Vec<PermitInput>,
  options: Option<Options>,
) -> Result<Vec<PermitId>> {
  
  let permit_ids = permit_dao::creates_permit(
    permit_inputs,
    options,
  ).await?;
  
  Ok(permit_ids)
}

/// 根据 permit_id 修改按钮权限
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_permit(
  permit_id: PermitId,
  mut permit_input: PermitInput,
  options: Option<Options>,
) -> Result<PermitId> {
  
  let old_model = validate_option_permit(
    permit_dao::find_by_id_permit(
      permit_id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 菜单
    permit_input.menu_id = None;
    permit_input.menu_id_lbl = None;
    // 编码
    permit_input.code = None;
  }
  
  let permit_id = permit_dao::update_by_id_permit(
    permit_id,
    permit_input,
    options.clone(),
  ).await?;
  
  Ok(permit_id)
}

/// 校验按钮权限是否存在
#[allow(dead_code)]
pub async fn validate_option_permit(
  permit_model: Option<PermitModel>,
) -> Result<PermitModel> {
  
  let permit_model = permit_dao::validate_option_permit(permit_model).await?;
  
  Ok(permit_model)
}

/// 根据 permit_ids 删除按钮权限
#[allow(dead_code)]
pub async fn delete_by_ids_permit(
  permit_ids: Vec<PermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = permit_dao::find_all_permit(
    Some(PermitSearch {
      ids: Some(permit_ids.clone()),
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
  
  let num = permit_dao::delete_by_ids_permit(
    permit_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取按钮权限字段注释
pub async fn get_field_comments_permit(
  options: Option<Options>,
) -> Result<PermitFieldComment> {
  
  let comments = permit_dao::get_field_comments_permit(
    options,
  ).await?;
  
  Ok(comments)
}

/// 查找 按钮权限 order_by 字段的最大值
pub async fn find_last_order_by_permit(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = permit_dao::find_last_order_by_permit(
    options,
  ).await?;
  
  Ok(res)
}
