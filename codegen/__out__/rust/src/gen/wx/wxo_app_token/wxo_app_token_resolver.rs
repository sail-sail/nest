#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::wxo_app_token_model::*;
use super::wxo_app_token_service;

/// 根据搜索条件和分页查找小程序接口凭据列表
#[function_name::named]
pub async fn find_all(
  search: Option<WxoAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_app_token(sort.as_deref())?;
  
  let models = wxo_app_token_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找小程序接口凭据总数
#[function_name::named]
pub async fn find_count(
  search: Option<WxoAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxo_app_token_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个小程序接口凭据
#[function_name::named]
pub async fn find_one(
  search: Option<WxoAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_app_token(sort.as_deref())?;
  
  let model = wxo_app_token_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找小程序接口凭据
#[function_name::named]
pub async fn find_by_id(
  id: WxoAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxoAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxo_app_token_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找小程序接口凭据
#[function_name::named]
pub async fn find_by_ids(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxo_app_token_service::find_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建小程序接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn creates(
  inputs: Vec<WxoAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenId>> {
  
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
    let input = wxo_app_token_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wxo_app_token(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxo_app_token_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改小程序接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id(
  id: WxoAppTokenId,
  input: WxoAppTokenInput,
  options: Option<Options>,
) -> Result<WxoAppTokenId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxo_app_token_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wxo_app_token(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxo_app_token_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除小程序接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxo_app_token(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxo_app_token_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取小程序接口凭据字段注释
#[function_name::named]
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxoAppTokenFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxo_app_token_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原小程序接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxo_app_token(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxo_app_token_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除小程序接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxo_app_token(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxo_app_token_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
