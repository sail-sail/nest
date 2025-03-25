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

use super::dict_detail_model::*;
use super::dict_detail_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DictDetailSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找系统字典明细列表
pub async fn find_all_dict_detail(
  search: Option<DictDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dict_detail_models = dict_detail_dao::find_all_dict_detail(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dict_detail_models)
}

/// 根据条件查找系统字典明细总数
pub async fn find_count_dict_detail(
  search: Option<DictDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dict_detail_num = dict_detail_dao::find_count_dict_detail(
    Some(search),
    options,
  ).await?;
  
  Ok(dict_detail_num)
}

/// 根据条件查找第一个系统字典明细
pub async fn find_one_dict_detail(
  search: Option<DictDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dict_detail_model = dict_detail_dao::find_one_dict_detail(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dict_detail_model)
}

/// 根据 id 查找系统字典明细
pub async fn find_by_id_dict_detail(
  dict_detail_id: DictDetailId,
  options: Option<Options>,
) -> Result<Option<DictDetailModel>> {
  
  let dict_detail_model = dict_detail_dao::find_by_id_dict_detail(
    dict_detail_id,
    options,
  ).await?;
  
  Ok(dict_detail_model)
}

/// 根据 dict_detail_ids 查找系统字典明细
pub async fn find_by_ids_dict_detail(
  dict_detail_ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<Vec<DictDetailModel>> {
  
  let dict_detail_models = dict_detail_dao::find_by_ids_dict_detail(
    dict_detail_ids,
    options,
  ).await?;
  
  Ok(dict_detail_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_dict_detail(
  dict_detail_input: DictDetailInput,
) -> Result<DictDetailInput> {
  
  let dict_detail_input = dict_detail_dao::set_id_by_lbl_dict_detail(
    dict_detail_input,
  ).await?;
  
  Ok(dict_detail_input)
}

/// 创建系统字典明细
#[allow(dead_code)]
pub async fn creates_dict_detail(
  dict_detail_inputs: Vec<DictDetailInput>,
  options: Option<Options>,
) -> Result<Vec<DictDetailId>> {
  
  let dict_detail_ids = dict_detail_dao::creates_dict_detail(
    dict_detail_inputs,
    options,
  ).await?;
  
  Ok(dict_detail_ids)
}

/// 根据 dict_detail_id 修改系统字典明细
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_dict_detail(
  dict_detail_id: DictDetailId,
  mut dict_detail_input: DictDetailInput,
  options: Option<Options>,
) -> Result<DictDetailId> {
  
  let old_model = validate_option_dict_detail(
    dict_detail_dao::find_by_id_dict_detail(
      dict_detail_id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 值
    dict_detail_input.val = None;
  }
  
  let dict_detail_id = dict_detail_dao::update_by_id_dict_detail(
    dict_detail_id,
    dict_detail_input,
    options.clone(),
  ).await?;
  
  Ok(dict_detail_id)
}

/// 校验系统字典明细是否存在
#[allow(dead_code)]
pub async fn validate_option_dict_detail(
  dict_detail_model: Option<DictDetailModel>,
) -> Result<DictDetailModel> {
  
  let dict_detail_model = dict_detail_dao::validate_option_dict_detail(dict_detail_model).await?;
  
  Ok(dict_detail_model)
}

/// 根据 dict_detail_ids 删除系统字典明细
#[allow(dead_code)]
pub async fn delete_by_ids_dict_detail(
  dict_detail_ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = dict_detail_dao::find_all_dict_detail(
    Some(DictDetailSearch {
      ids: Some(dict_detail_ids.clone()),
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
  
  let num = dict_detail_dao::delete_by_ids_dict_detail(
    dict_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dict_detail_id 查找系统字典明细是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_dict_detail(
  dict_detail_id: DictDetailId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dict_detail_dao::get_is_enabled_by_id_dict_detail(
    dict_detail_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 dict_detail_ids 启用或者禁用系统字典明细
#[allow(dead_code)]
pub async fn enable_by_ids_dict_detail(
  dict_detail_ids: Vec<DictDetailId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::enable_by_ids_dict_detail(
    dict_detail_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统字典明细字段注释
pub async fn get_field_comments_dict_detail(
  options: Option<Options>,
) -> Result<DictDetailFieldComment> {
  
  let comments = dict_detail_dao::get_field_comments_dict_detail(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dict_detail_ids 还原系统字典明细
#[allow(dead_code)]
pub async fn revert_by_ids_dict_detail(
  dict_detail_ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::revert_by_ids_dict_detail(
    dict_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dict_detail_ids 彻底删除系统字典明细
#[allow(dead_code)]
pub async fn force_delete_by_ids_dict_detail(
  dict_detail_ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::force_delete_by_ids_dict_detail(
    dict_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统字典明细 order_by 字段的最大值
pub async fn find_last_order_by_dict_detail(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dict_detail_dao::find_last_order_by_dict_detail(
    options,
  ).await?;
  
  Ok(res)
}
