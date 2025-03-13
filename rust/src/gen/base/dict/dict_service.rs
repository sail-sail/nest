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

use super::dict_model::*;
use super::dict_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DictSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找系统字典列表
pub async fn find_all(
  search: Option<DictSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = dict_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找系统字典总数
pub async fn find_count(
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = dict_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个系统字典
pub async fn find_one(
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let model = dict_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统字典
pub async fn find_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let model = dict_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: DictInput,
) -> Result<DictInput> {
  
  let input = dict_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建系统字典
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DictInput>,
  options: Option<Options>,
) -> Result<Vec<DictId>> {
  
  let dict_ids = dict_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(dict_ids)
}

/// 根据 id 修改系统字典
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: DictId,
  mut input: DictInput,
  options: Option<Options>,
) -> Result<DictId> {
  
  let old_model = validate_option(
    dict_dao::find_by_id(
      id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 编码
    input.code = None;
    // 数据类型
    input.r#type = None;
    input.type_lbl = None;
    // 启用
    input.is_enabled = None;
    input.is_enabled_lbl = None;
  }
  
  let dict_id = dict_dao::update_by_id(
    id,
    input,
    options.clone(),
  ).await?;
  
  Ok(dict_id)
}

/// 校验系统字典是否存在
#[allow(dead_code)]
pub async fn validate_option(
  model: Option<DictModel>,
) -> Result<DictModel> {
  
  let model = dict_dao::validate_option(model).await?;
  
  Ok(model)
}

/// 根据 ids 删除系统字典
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = dict_dao::find_all(
    Some(DictSearch {
      ids: Some(ids.clone()),
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
  
  let num = dict_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dict_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统字典
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DictId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统字典字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictFieldComment> {
  
  let comments = dict_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原系统字典
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除系统字典
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统字典 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dict_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
