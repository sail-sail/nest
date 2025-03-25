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

use super::options_model::*;
use super::options_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut OptionsSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找系统选项列表
pub async fn find_all_options(
  search: Option<OptionsSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptionsModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let options_models = options_dao::find_all_options(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(options_models)
}

/// 根据条件查找系统选项总数
pub async fn find_count_options(
  search: Option<OptionsSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let options_num = options_dao::find_count_options(
    Some(search),
    options,
  ).await?;
  
  Ok(options_num)
}

/// 根据条件查找第一个系统选项
pub async fn find_one_options(
  search: Option<OptionsSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let options_model = options_dao::find_one_options(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(options_model)
}

/// 根据 id 查找系统选项
pub async fn find_by_id_options(
  options_id: OptionsId,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
  let options_model = options_dao::find_by_id_options(
    options_id,
    options,
  ).await?;
  
  Ok(options_model)
}

/// 根据 options_ids 查找系统选项
pub async fn find_by_ids_options(
  options_ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<Vec<OptionsModel>> {
  
  let options_models = options_dao::find_by_ids_options(
    options_ids,
    options,
  ).await?;
  
  Ok(options_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_options(
  options_input: OptionsInput,
) -> Result<OptionsInput> {
  
  let options_input = options_dao::set_id_by_lbl_options(
    options_input,
  ).await?;
  
  Ok(options_input)
}

/// 创建系统选项
#[allow(dead_code)]
pub async fn creates_options(
  options_inputs: Vec<OptionsInput>,
  options: Option<Options>,
) -> Result<Vec<OptionsId>> {
  
  let options_ids = options_dao::creates_options(
    options_inputs,
    options,
  ).await?;
  
  Ok(options_ids)
}

/// 根据 options_id 修改系统选项
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_options(
  options_id: OptionsId,
  mut options_input: OptionsInput,
  options: Option<Options>,
) -> Result<OptionsId> {
  
  let old_model = validate_option_options(
    options_dao::find_by_id_options(
      options_id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  let is_locked = options_dao::get_is_locked_by_id_options(
    options_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 系统选项";
    return Err(eyre!(err_msg));
  }
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 名称
    options_input.lbl = None;
    // 键
    options_input.ky = None;
  }
  
  let options_id = options_dao::update_by_id_options(
    options_id,
    options_input,
    options.clone(),
  ).await?;
  
  Ok(options_id)
}

/// 校验系统选项是否存在
#[allow(dead_code)]
pub async fn validate_option_options(
  options_model: Option<OptionsModel>,
) -> Result<OptionsModel> {
  
  let options_model = options_dao::validate_option_options(options_model).await?;
  
  Ok(options_model)
}

/// 根据 options_ids 删除系统选项
#[allow(dead_code)]
pub async fn delete_by_ids_options(
  options_ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = options_dao::find_all_options(
    Some(OptionsSearch {
      ids: Some(options_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 系统选项";
      return Err(eyre!(err_msg));
    }
  }
  
  for old_model in &old_models {
    if old_model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = options_dao::delete_by_ids_options(
    options_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 options_id 查找系统选项是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_options(
  options_id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = options_dao::get_is_enabled_by_id_options(
    options_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 options_ids 启用或者禁用系统选项
#[allow(dead_code)]
pub async fn enable_by_ids_options(
  options_ids: Vec<OptionsId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::enable_by_ids_options(
    options_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 options_id 查找系统选项是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_options(
  options_id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = options_dao::get_is_locked_by_id_options(
    options_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 options_ids 锁定或者解锁系统选项
#[allow(dead_code)]
pub async fn lock_by_ids_options(
  options_ids: Vec<OptionsId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::lock_by_ids_options(
    options_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统选项字段注释
pub async fn get_field_comments_options(
  options: Option<Options>,
) -> Result<OptionsFieldComment> {
  
  let comments = options_dao::get_field_comments_options(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 options_ids 还原系统选项
#[allow(dead_code)]
pub async fn revert_by_ids_options(
  options_ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::revert_by_ids_options(
    options_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 options_ids 彻底删除系统选项
#[allow(dead_code)]
pub async fn force_delete_by_ids_options(
  options_ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::force_delete_by_ids_options(
    options_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统选项 order_by 字段的最大值
pub async fn find_last_order_by_options(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = options_dao::find_last_order_by_options(
    options,
  ).await?;
  
  Ok(res)
}
