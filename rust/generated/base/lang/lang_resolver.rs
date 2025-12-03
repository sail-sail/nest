
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::lang_model::*;
use super::lang_service;

/// 根据搜索条件和分页查找语言列表
#[function_name::named]
pub async fn find_all_lang(
  search: Option<LangSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_lang(sort.as_deref())?;
  
  let models = lang_service::find_all_lang(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找语言总数
#[function_name::named]
pub async fn find_count_lang(
  search: Option<LangSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = lang_service::find_count_lang(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个语言
#[function_name::named]
pub async fn find_one_lang(
  search: Option<LangSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_lang(sort.as_deref())?;
  
  let model = lang_service::find_one_lang(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个语言, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_lang(
  search: Option<LangSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<LangModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_lang(sort.as_deref())?;
  
  let model = lang_service::find_one_ok_lang(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找语言
#[function_name::named]
pub async fn find_by_id_lang(
  id: LangId,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = lang_service::find_by_id_lang(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找语言, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_lang(
  id: LangId,
  options: Option<Options>,
) -> Result<LangModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = lang_service::find_by_id_ok_lang(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找语言
#[function_name::named]
pub async fn find_by_ids_lang(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = lang_service::find_by_ids_lang(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找语言, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_lang(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = lang_service::find_by_ids_ok_lang(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建语言
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_lang(
  inputs: Vec<LangInput>,
  options: Option<Options>,
) -> Result<Vec<LangId>> {
  
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = lang_service::set_id_by_lbl_lang(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_lang().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = lang_service::creates_lang(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改语言
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_lang(
  id: LangId,
  input: LangInput,
  options: Option<Options>,
) -> Result<LangId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = lang_service::set_id_by_lbl_lang(
    input,
  ).await?;
  
  use_permit(
    get_page_path_lang().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = lang_service::update_by_id_lang(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除语言
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_lang(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_lang().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = lang_service::delete_by_ids_lang(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找语言是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_lang(
  id: LangId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = lang_service::get_is_enabled_by_id_lang(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用语言
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_lang(
  ids: Vec<LangId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_lang().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = lang_service::enable_by_ids_lang(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取语言字段注释
#[function_name::named]
pub async fn get_field_comments_lang(
  options: Option<Options>,
) -> Result<LangFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = lang_service::get_field_comments_lang(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原语言
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_lang(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_lang().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = lang_service::revert_by_ids_lang(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除语言
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_lang(
  ids: Vec<LangId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_lang().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = lang_service::force_delete_by_ids_lang(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 语言 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_lang(
  search: Option<LangSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = lang_service::find_last_order_by_lang(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
