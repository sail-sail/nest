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
use crate::src::base::options::options_dao::update_i18n_version;

use super::i18n_model::*;
use super::i18n_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut I18nSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找国际化列表
pub async fn find_all_i18n(
  search: Option<I18nSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<I18nModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let i18n_models = i18n_dao::find_all_i18n(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(i18n_models)
}

/// 根据条件查找国际化总数
pub async fn find_count_i18n(
  search: Option<I18nSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let i18n_num = i18n_dao::find_count_i18n(
    Some(search),
    options,
  ).await?;
  
  Ok(i18n_num)
}

/// 根据条件查找第一个国际化
pub async fn find_one_i18n(
  search: Option<I18nSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let i18n_model = i18n_dao::find_one_i18n(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(i18n_model)
}

/// 根据 id 查找国际化
pub async fn find_by_id_i18n(
  i18n_id: I18nId,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
  let i18n_model = i18n_dao::find_by_id_i18n(
    i18n_id,
    options,
  ).await?;
  
  Ok(i18n_model)
}

/// 根据 i18n_ids 查找国际化
pub async fn find_by_ids_i18n(
  i18n_ids: Vec<I18nId>,
  options: Option<Options>,
) -> Result<Vec<I18nModel>> {
  
  let i18n_models = i18n_dao::find_by_ids_i18n(
    i18n_ids,
    options,
  ).await?;
  
  Ok(i18n_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_i18n(
  i18n_input: I18nInput,
) -> Result<I18nInput> {
  
  let i18n_input = i18n_dao::set_id_by_lbl_i18n(
    i18n_input,
  ).await?;
  
  Ok(i18n_input)
}

/// 创建国际化
#[allow(dead_code)]
pub async fn creates_i18n(
  i18n_inputs: Vec<I18nInput>,
  options: Option<Options>,
) -> Result<Vec<I18nId>> {
  
  let i18n_ids = i18n_dao::creates_i18n(
    i18n_inputs,
    options,
  ).await?;
  
  update_i18n_version().await?;
  
  Ok(i18n_ids)
}

/// 根据 i18n_id 修改国际化
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_i18n(
  i18n_id: I18nId,
  mut i18n_input: I18nInput,
  options: Option<Options>,
) -> Result<I18nId> {
  
  let i18n_id = i18n_dao::update_by_id_i18n(
    i18n_id,
    i18n_input,
    options.clone(),
  ).await?;
  
  update_i18n_version().await?;
  
  Ok(i18n_id)
}

/// 校验国际化是否存在
#[allow(dead_code)]
pub async fn validate_option_i18n(
  i18n_model: Option<I18nModel>,
) -> Result<I18nModel> {
  
  let i18n_model = i18n_dao::validate_option_i18n(i18n_model).await?;
  
  Ok(i18n_model)
}

/// 根据 i18n_ids 删除国际化
#[allow(dead_code)]
pub async fn delete_by_ids_i18n(
  i18n_ids: Vec<I18nId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = i18n_dao::delete_by_ids_i18n(
    i18n_ids,
    options,
  ).await?;
  
  update_i18n_version().await?;
  
  Ok(num)
}

/// 获取国际化字段注释
pub async fn get_field_comments_i18n(
  options: Option<Options>,
) -> Result<I18nFieldComment> {
  
  let comments = i18n_dao::get_field_comments_i18n(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 i18n_ids 还原国际化
#[allow(dead_code)]
pub async fn revert_by_ids_i18n(
  i18n_ids: Vec<I18nId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = i18n_dao::revert_by_ids_i18n(
    i18n_ids,
    options,
  ).await?;
  
  update_i18n_version().await?;
  
  Ok(num)
}

/// 根据 i18n_ids 彻底删除国际化
#[allow(dead_code)]
pub async fn force_delete_by_ids_i18n(
  i18n_ids: Vec<I18nId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = i18n_dao::force_delete_by_ids_i18n(
    i18n_ids,
    options,
  ).await?;
  
  Ok(num)
}
