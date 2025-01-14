#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::wxw_app_token_model::*;
use super::wxw_app_token_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找企微应用接口凭据列表
pub async fn find_all(
  search: Option<WxwAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  check_sort_wxw_app_token(sort.as_deref())?;
  
  let models = wxw_app_token_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找企微应用接口凭据总数
pub async fn find_count(
  search: Option<WxwAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_token_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个企微应用接口凭据
pub async fn find_one(
  search: Option<WxwAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  check_sort_wxw_app_token(sort.as_deref())?;
  
  let model = wxw_app_token_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微应用接口凭据
pub async fn find_by_id(
  id: WxwAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  let model = wxw_app_token_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建企微应用接口凭据
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<WxwAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = wxw_app_token_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wxw_app_token(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxw_app_token_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 企微应用接口凭据根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: WxwAppTokenId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_token_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改企微应用接口凭据
#[allow(dead_code)]
pub async fn update_by_id(
  id: WxwAppTokenId,
  input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<WxwAppTokenId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxw_app_token_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wxw_app_token(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxw_app_token_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除企微应用接口凭据
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app_token(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_app_token_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微应用接口凭据字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwAppTokenFieldComment> {
  
  let comments = wxw_app_token_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原企微应用接口凭据
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app_token(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_app_token_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除企微应用接口凭据
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app_token(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_app_token_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
