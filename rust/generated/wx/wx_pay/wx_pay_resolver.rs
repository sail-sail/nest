
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

use super::wx_pay_model::*;
use super::wx_pay_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找微信支付设置列表
#[function_name::named]
pub async fn find_all_wx_pay(
  search: Option<WxPaySearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxPayModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_pay(sort.as_deref())?;
  
  let models = wx_pay_service::find_all_wx_pay(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找微信支付设置总数
#[function_name::named]
pub async fn find_count_wx_pay(
  search: Option<WxPaySearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_pay_service::find_count_wx_pay(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个微信支付设置
#[function_name::named]
pub async fn find_one_wx_pay(
  search: Option<WxPaySearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxPayModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_pay(sort.as_deref())?;
  
  let model = wx_pay_service::find_one_wx_pay(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个微信支付设置, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wx_pay(
  search: Option<WxPaySearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxPayModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_pay(sort.as_deref())?;
  
  let model = wx_pay_service::find_one_ok_wx_pay(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找微信支付设置
#[function_name::named]
pub async fn find_by_id_wx_pay(
  id: WxPayId,
  options: Option<Options>,
) -> Result<Option<WxPayModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_pay_service::find_by_id_wx_pay(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找微信支付设置, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wx_pay(
  id: WxPayId,
  options: Option<Options>,
) -> Result<WxPayModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_pay_service::find_by_id_ok_wx_pay(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找微信支付设置
#[function_name::named]
pub async fn find_by_ids_wx_pay(
  ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<Vec<WxPayModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_pay_service::find_by_ids_wx_pay(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找微信支付设置, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wx_pay(
  ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<Vec<WxPayModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_pay_service::find_by_ids_ok_wx_pay(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建微信支付设置
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_wx_pay(
  inputs: Vec<WxPayInput>,
  options: Option<Options>,
) -> Result<Vec<WxPayId>> {
  
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
    let input = wx_pay_service::set_id_by_lbl_wx_pay(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_wx_pay().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = wx_pay_service::creates_wx_pay(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 微信支付设置根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wx_pay(
  id: WxPayId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_pay_service::update_tenant_by_id_wx_pay(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改微信支付设置
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_wx_pay(
  id: WxPayId,
  input: WxPayInput,
  options: Option<Options>,
) -> Result<WxPayId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wx_pay_service::set_id_by_lbl_wx_pay(
    input,
  ).await?;
  
  use_permit(
    get_page_path_wx_pay().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = wx_pay_service::update_by_id_wx_pay(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除微信支付设置
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wx_pay(
  ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wx_pay().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = wx_pay_service::delete_by_ids_wx_pay(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找微信支付设置是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_wx_pay(
  id: WxPayId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = wx_pay_service::get_is_enabled_by_id_wx_pay(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用微信支付设置
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_wx_pay(
  ids: Vec<WxPayId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wx_pay().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = wx_pay_service::enable_by_ids_wx_pay(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找微信支付设置是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_wx_pay(
  id: WxPayId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = wx_pay_service::get_is_locked_by_id_wx_pay(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁微信支付设置
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_wx_pay(
  ids: Vec<WxPayId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wx_pay().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = wx_pay_service::lock_by_ids_wx_pay(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信支付设置字段注释
#[function_name::named]
pub async fn get_field_comments_wx_pay(
  options: Option<Options>,
) -> Result<WxPayFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wx_pay_service::get_field_comments_wx_pay(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原微信支付设置
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wx_pay(
  ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wx_pay().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = wx_pay_service::revert_by_ids_wx_pay(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除微信支付设置
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wx_pay(
  ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wx_pay().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wx_pay_service::force_delete_by_ids_wx_pay(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 微信支付设置 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_wx_pay(
  search: Option<WxPaySearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = wx_pay_service::find_last_order_by_wx_pay(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
