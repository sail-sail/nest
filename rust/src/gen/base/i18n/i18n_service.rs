#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use anyhow::{Result,anyhow};

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};

use super::i18n_model::*;
use super::i18n_dao;

/// 根据搜索条件和分页查找国际化列表
pub async fn find_all(
  search: Option<I18nSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<I18nModel>> {
  
  let res = i18n_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找国际化总数
pub async fn find_count(
  search: Option<I18nSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = i18n_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个国际化
pub async fn find_one(
  search: Option<I18nSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
  let model = i18n_dao::find_one(
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
  
  let model = i18n_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: I18nInput,
) -> Result<I18nInput> {
  
  let input = i18n_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建国际化
#[allow(dead_code)]
pub async fn create(
  input: I18nInput,
  options: Option<Options>,
) -> Result<I18nId> {
  
  let id = i18n_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 批量创建国际化
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<I18nInput>,
  options: Option<Options>,
) -> Result<Vec<I18nId>> {
  
  let ids = i18n_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改国际化
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: I18nId,
  mut input: I18nInput,
  options: Option<Options>,
) -> Result<I18nId> {
  
  let res = i18n_dao::update_by_id(
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
  
  let num = i18n_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取国际化字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<I18nFieldComment> {
  
  let comments = i18n_dao::get_field_comments(
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
  
  let num = i18n_dao::revert_by_ids(
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
  
  let num = i18n_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}