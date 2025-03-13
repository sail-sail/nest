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
pub async fn find_all(
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
  
  let res = dict_detail_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找系统字典明细总数
pub async fn find_count(
  search: Option<DictDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = dict_detail_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个系统字典明细
pub async fn find_one(
  search: Option<DictDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let model = dict_detail_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统字典明细
pub async fn find_by_id(
  id: DictDetailId,
  options: Option<Options>,
) -> Result<Option<DictDetailModel>> {
  
  let model = dict_detail_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: DictDetailInput,
) -> Result<DictDetailInput> {
  
  let input = dict_detail_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建系统字典明细
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DictDetailInput>,
  options: Option<Options>,
) -> Result<Vec<DictDetailId>> {
  
  let dict_detail_ids = dict_detail_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(dict_detail_ids)
}

/// 根据 id 修改系统字典明细
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: DictDetailId,
  mut input: DictDetailInput,
  options: Option<Options>,
) -> Result<DictDetailId> {
  
  let old_model = validate_option(
    dict_detail_dao::find_by_id(
      id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 值
    input.val = None;
  }
  
  let dict_detail_id = dict_detail_dao::update_by_id(
    id,
    input,
    options.clone(),
  ).await?;
  
  Ok(dict_detail_id)
}

/// 校验系统字典明细是否存在
#[allow(dead_code)]
pub async fn validate_option(
  model: Option<DictDetailModel>,
) -> Result<DictDetailModel> {
  
  let model = dict_detail_dao::validate_option(model).await?;
  
  Ok(model)
}

/// 根据 ids 删除系统字典明细
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = dict_detail_dao::find_all(
    Some(DictDetailSearch {
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
  
  let num = dict_detail_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统字典明细是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DictDetailId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dict_detail_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统字典明细
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DictDetailId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统字典明细字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictDetailFieldComment> {
  
  let comments = dict_detail_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原系统字典明细
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除系统字典明细
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统字典明细 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dict_detail_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
