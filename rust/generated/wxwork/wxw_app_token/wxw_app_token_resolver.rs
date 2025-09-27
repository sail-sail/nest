
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

use super::wxw_app_token_model::*;
use super::wxw_app_token_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找企微应用接口凭据列表
#[function_name::named]
pub async fn find_all_wxw_app_token(
  search: Option<WxwAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_app_token(sort.as_deref())?;
  
  let models = wxw_app_token_service::find_all_wxw_app_token(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找企微应用接口凭据总数
#[function_name::named]
pub async fn find_count_wxw_app_token(
  search: Option<WxwAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_app_token_service::find_count_wxw_app_token(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个企微应用接口凭据
#[function_name::named]
pub async fn find_one_wxw_app_token(
  search: Option<WxwAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_app_token(sort.as_deref())?;
  
  let model = wxw_app_token_service::find_one_wxw_app_token(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个企微应用接口凭据, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wxw_app_token(
  search: Option<WxwAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxwAppTokenModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_app_token(sort.as_deref())?;
  
  let model = wxw_app_token_service::find_one_ok_wxw_app_token(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微应用接口凭据
#[function_name::named]
pub async fn find_by_id_wxw_app_token(
  id: WxwAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_app_token_service::find_by_id_wxw_app_token(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微应用接口凭据, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wxw_app_token(
  id: WxwAppTokenId,
  options: Option<Options>,
) -> Result<WxwAppTokenModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_app_token_service::find_by_id_ok_wxw_app_token(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找企微应用接口凭据
#[function_name::named]
pub async fn find_by_ids_wxw_app_token(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_app_token_service::find_by_ids_wxw_app_token(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找企微应用接口凭据, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wxw_app_token(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_app_token_service::find_by_ids_ok_wxw_app_token(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建企微应用接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_wxw_app_token(
  inputs: Vec<WxwAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenId>> {
  
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
    let input = wxw_app_token_service::set_id_by_lbl_wxw_app_token(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wxw_app_token(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxw_app_token_service::creates_wxw_app_token(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 企微应用接口凭据根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wxw_app_token(
  id: WxwAppTokenId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_app_token_service::update_tenant_by_id_wxw_app_token(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改企微应用接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_wxw_app_token(
  id: WxwAppTokenId,
  input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<WxwAppTokenId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxw_app_token_service::set_id_by_lbl_wxw_app_token(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wxw_app_token(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxw_app_token_service::update_by_id_wxw_app_token(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除企微应用接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wxw_app_token(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_app_token(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_app_token_service::delete_by_ids_wxw_app_token(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微应用接口凭据字段注释
#[function_name::named]
pub async fn get_field_comments_wxw_app_token(
  options: Option<Options>,
) -> Result<WxwAppTokenFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxw_app_token_service::get_field_comments_wxw_app_token(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原企微应用接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wxw_app_token(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_app_token(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_app_token_service::revert_by_ids_wxw_app_token(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除企微应用接口凭据
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wxw_app_token(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_app_token(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_app_token_service::force_delete_by_ids_wxw_app_token(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
