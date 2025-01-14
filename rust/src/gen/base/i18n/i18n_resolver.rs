#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::i18n_model::*;
use super::i18n_service;

/// 根据搜索条件和分页查找国际化列表
pub async fn find_all(
  search: Option<I18nSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<I18nModel>> {
  
  check_sort_i18n(sort.as_deref())?;
  
  let models = i18n_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找国际化总数
pub async fn find_count(
  search: Option<I18nSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = i18n_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个国际化
pub async fn find_one(
  search: Option<I18nSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
  check_sort_i18n(sort.as_deref())?;
  
  let model = i18n_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找国际化
pub async fn find_by_id(
  id: I18nId,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
  let model = i18n_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建国际化
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<I18nInput>,
  options: Option<Options>,
) -> Result<Vec<I18nId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = i18n_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_i18n(),
    "add".to_owned(),
  ).await?;
  
  let ids = i18n_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改国际化
#[allow(dead_code)]
pub async fn update_by_id(
  id: I18nId,
  input: I18nInput,
  options: Option<Options>,
) -> Result<I18nId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = i18n_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_i18n(),
    "edit".to_owned(),
  ).await?;
  
  let res = i18n_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除国际化
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<I18nId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_i18n(),
    "delete".to_owned(),
  ).await?;
  
  let num = i18n_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取国际化字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<I18nFieldComment> {
  
  let comments = i18n_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原国际化
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<I18nId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_i18n(),
    "delete".to_owned(),
  ).await?;
  
  let num = i18n_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除国际化
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<I18nId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_i18n(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = i18n_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
