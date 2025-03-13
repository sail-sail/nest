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

use super::lang_model::*;
use super::lang_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut LangSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找语言列表
pub async fn find_all(
  search: Option<LangSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = lang_dao::find_all(
    Some(search),
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
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = lang_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个语言
pub async fn find_one(
  search: Option<LangSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let model = lang_dao::find_one(
    Some(search),
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
  
  let model = lang_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: LangInput,
) -> Result<LangInput> {
  
  let input = lang_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建语言
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<LangInput>,
  options: Option<Options>,
) -> Result<Vec<LangId>> {
  
  let lang_ids = lang_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(lang_ids)
}

/// 根据 id 修改语言
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: LangId,
  mut input: LangInput,
  options: Option<Options>,
) -> Result<LangId> {
  
  let lang_id = lang_dao::update_by_id(
    id,
    input,
    options.clone(),
  ).await?;
  
  Ok(lang_id)
}

/// 校验语言是否存在
#[allow(dead_code)]
pub async fn validate_option(
  model: Option<LangModel>,
) -> Result<LangModel> {
  
  let model = lang_dao::validate_option(model).await?;
  
  Ok(model)
}

/// 根据 ids 删除语言
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = lang_dao::find_all(
    Some(LangSearch {
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
  
  let num = lang_dao::delete_by_ids(
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
  
  let is_enabled = lang_dao::get_is_enabled_by_id(
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
  
  let num = lang_dao::enable_by_ids(
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
  
  let comments = lang_dao::get_field_comments(
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
  
  let num = lang_dao::revert_by_ids(
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
  
  let num = lang_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 语言 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = lang_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
