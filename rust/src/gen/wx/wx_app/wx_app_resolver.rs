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

use super::wx_app_model::*;
use super::wx_app_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找小程序设置列表
#[function_name::named]
pub async fn find_all(
  search: Option<WxAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxAppModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_app(sort.as_deref())?;
  
  let models = wx_app_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找小程序设置总数
#[function_name::named]
pub async fn find_count(
  search: Option<WxAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_app_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个小程序设置
#[function_name::named]
pub async fn find_one(
  search: Option<WxAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxAppModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_app(sort.as_deref())?;
  
  let model = wx_app_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找小程序设置
#[function_name::named]
pub async fn find_by_id(
  id: WxAppId,
  options: Option<Options>,
) -> Result<Option<WxAppModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_app_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找小程序设置
#[function_name::named]
pub async fn find_by_ids(
  ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<Vec<WxAppModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_app_service::find_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建小程序设置
#[allow(dead_code)]
#[function_name::named]
pub async fn creates(
  inputs: Vec<WxAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxAppId>> {
  
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
    let input = wx_app_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wx_app(),
    "add".to_owned(),
  ).await?;
  
  let ids = wx_app_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 小程序设置根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id(
  id: WxAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_app_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改小程序设置
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id(
  id: WxAppId,
  input: WxAppInput,
  options: Option<Options>,
) -> Result<WxAppId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wx_app_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wx_app(),
    "edit".to_owned(),
  ).await?;
  
  let res = wx_app_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除小程序设置
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids(
  ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_app(),
    "delete".to_owned(),
  ).await?;
  
  let num = wx_app_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找小程序设置是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id(
  id: WxAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = wx_app_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用小程序设置
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids(
  ids: Vec<WxAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_app(),
    "edit".to_owned(),
  ).await?;
  
  let num = wx_app_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找小程序设置是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id(
  id: WxAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = wx_app_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁小程序设置
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids(
  ids: Vec<WxAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_app(),
    "edit".to_owned(),
  ).await?;
  
  let num = wx_app_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取小程序设置字段注释
#[function_name::named]
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxAppFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wx_app_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原小程序设置
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids(
  ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_app(),
    "delete".to_owned(),
  ).await?;
  
  let num = wx_app_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除小程序设置
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids(
  ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_app(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wx_app_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 小程序设置 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = wx_app_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
