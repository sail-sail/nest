
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
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
pub async fn find_all_lang(
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
  
  let lang_models = lang_dao::find_all_lang(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(lang_models)
}

/// 根据条件查找语言总数
pub async fn find_count_lang(
  search: Option<LangSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let lang_num = lang_dao::find_count_lang(
    Some(search),
    options,
  ).await?;
  
  Ok(lang_num)
}

/// 根据条件查找第一个语言
pub async fn find_one_lang(
  search: Option<LangSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let lang_model = lang_dao::find_one_lang(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(lang_model)
}

/// 根据条件查找第一个语言, 如果不存在则抛错
pub async fn find_one_ok_lang(
  search: Option<LangSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<LangModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let lang_model = lang_dao::find_one_ok_lang(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(lang_model)
}

/// 根据 id 查找语言
pub async fn find_by_id_lang(
  lang_id: LangId,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  let lang_model = lang_dao::find_by_id_lang(
    lang_id,
    options,
  ).await?;
  
  Ok(lang_model)
}

/// 根据 id 查找语言, 如果不存在则抛错
pub async fn find_by_id_ok_lang(
  lang_id: LangId,
  options: Option<Options>,
) -> Result<LangModel> {
  
  let lang_model = lang_dao::find_by_id_ok_lang(
    lang_id,
    options,
  ).await?;
  
  Ok(lang_model)
}

/// 根据 ids 查找语言
pub async fn find_by_ids_lang(
  lang_ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  let lang_models = lang_dao::find_by_ids_lang(
    lang_ids,
    options,
  ).await?;
  
  Ok(lang_models)
}

/// 根据 ids 查找语言, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_lang(
  lang_ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  let lang_models = lang_dao::find_by_ids_ok_lang(
    lang_ids,
    options,
  ).await?;
  
  Ok(lang_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_lang(
  lang_input: LangInput,
) -> Result<LangInput> {
  
  let lang_input = lang_dao::set_id_by_lbl_lang(
    lang_input,
  ).await?;
  
  Ok(lang_input)
}

/// 创建语言
#[allow(dead_code)]
pub async fn creates_lang(
  lang_inputs: Vec<LangInput>,
  options: Option<Options>,
) -> Result<Vec<LangId>> {
  
  let lang_ids = lang_dao::creates_lang(
    lang_inputs,
    options,
  ).await?;
  
  Ok(lang_ids)
}

/// 根据 lang_id 修改语言
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_lang(
  lang_id: LangId,
  mut lang_input: LangInput,
  options: Option<Options>,
) -> Result<LangId> {
  
  let lang_id = lang_dao::update_by_id_lang(
    lang_id,
    lang_input,
    options.clone(),
  ).await?;
  
  Ok(lang_id)
}

/// 校验语言是否存在
#[allow(dead_code)]
pub async fn validate_option_lang(
  lang_model: Option<LangModel>,
) -> Result<LangModel> {
  
  let lang_model = lang_dao::validate_option_lang(lang_model).await?;
  
  Ok(lang_model)
}

/// 根据 lang_ids 删除语言
#[allow(dead_code)]
pub async fn delete_by_ids_lang(
  lang_ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = lang_dao::find_all_lang(
    Some(LangSearch {
      ids: Some(lang_ids.clone()),
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
  
  let num = lang_dao::delete_by_ids_lang(
    lang_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 lang_id 查找语言是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_lang(
  lang_id: LangId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = lang_dao::get_is_enabled_by_id_lang(
    lang_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 lang_ids 启用或者禁用语言
#[allow(dead_code)]
pub async fn enable_by_ids_lang(
  lang_ids: Vec<LangId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = lang_dao::enable_by_ids_lang(
    lang_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取语言字段注释
pub async fn get_field_comments_lang(
  options: Option<Options>,
) -> Result<LangFieldComment> {
  
  let comments = lang_dao::get_field_comments_lang(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 lang_ids 还原语言
#[allow(dead_code)]
pub async fn revert_by_ids_lang(
  lang_ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = lang_dao::revert_by_ids_lang(
    lang_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 lang_ids 彻底删除语言
#[allow(dead_code)]
pub async fn force_delete_by_ids_lang(
  lang_ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = lang_dao::force_delete_by_ids_lang(
    lang_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 语言 order_by 字段的最大值
pub async fn find_last_order_by_lang(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = lang_dao::find_last_order_by_lang(
    options,
  ).await?;
  
  Ok(res)
}
