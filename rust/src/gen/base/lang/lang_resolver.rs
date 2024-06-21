#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::lang_model::*;
use super::lang_service;

/// 根据搜索条件和分页查找语言列表
pub async fn find_all(
  search: Option<LangSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  check_sort_lang(sort.as_deref())?;
  
  let res = lang_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找语言总数
pub async fn find_count(
  search: Option<LangSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = lang_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个语言
pub async fn find_one(
  search: Option<LangSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  check_sort_lang(sort.as_deref())?;
  
  let model = lang_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找语言
pub async fn find_by_id(
  id: LangId,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  let model = lang_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建语言
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<LangInput>,
  options: Option<Options>,
) -> Result<Vec<LangId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = lang_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_lang(),
    "add".to_owned(),
  ).await?;
  
  let ids = lang_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改语言
#[allow(dead_code)]
pub async fn update_by_id(
  id: LangId,
  input: LangInput,
  options: Option<Options>,
) -> Result<LangId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = lang_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_lang(),
    "edit".to_owned(),
  ).await?;
  
  let res = lang_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除语言
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_lang(),
    "delete".to_owned(),
  ).await?;
  
  let num = lang_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找语言是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: LangId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = lang_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用语言
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<LangId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_lang(),
    "edit".to_owned(),
  ).await?;
  
  let num = lang_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取语言字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<LangFieldComment> {
  
  let comments = lang_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原语言
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_lang(),
    "delete".to_owned(),
  ).await?;
  
  let num = lang_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除语言
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_lang(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = lang_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 语言 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = lang_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
