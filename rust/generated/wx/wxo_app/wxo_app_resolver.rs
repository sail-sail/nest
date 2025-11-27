
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

use super::wxo_app_model::*;
use super::wxo_app_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找公众号设置列表
#[function_name::named]
pub async fn find_all_wxo_app(
  search: Option<WxoAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_app(sort.as_deref())?;
  
  let models = wxo_app_service::find_all_wxo_app(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找公众号设置总数
#[function_name::named]
pub async fn find_count_wxo_app(
  search: Option<WxoAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxo_app_service::find_count_wxo_app(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个公众号设置
#[function_name::named]
pub async fn find_one_wxo_app(
  search: Option<WxoAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoAppModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_app(sort.as_deref())?;
  
  let model = wxo_app_service::find_one_wxo_app(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个公众号设置, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wxo_app(
  search: Option<WxoAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxoAppModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_app(sort.as_deref())?;
  
  let model = wxo_app_service::find_one_ok_wxo_app(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找公众号设置
#[function_name::named]
pub async fn find_by_id_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<Option<WxoAppModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxo_app_service::find_by_id_wxo_app(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找公众号设置, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<WxoAppModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxo_app_service::find_by_id_ok_wxo_app(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找公众号设置
#[function_name::named]
pub async fn find_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxo_app_service::find_by_ids_wxo_app(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找公众号设置, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxo_app_service::find_by_ids_ok_wxo_app(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建公众号设置
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_wxo_app(
  inputs: Vec<WxoAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppId>> {
  
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
    input.default_role_codes = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = wxo_app_service::set_id_by_lbl_wxo_app(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_wxo_app().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxo_app_service::creates_wxo_app(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 公众号设置根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wxo_app(
  id: WxoAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxo_app_service::update_tenant_by_id_wxo_app(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改公众号设置
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_wxo_app(
  id: WxoAppId,
  input: WxoAppInput,
  options: Option<Options>,
) -> Result<WxoAppId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  input.default_role_codes = None;
  let input = input;
  
  let input = wxo_app_service::set_id_by_lbl_wxo_app(
    input,
  ).await?;
  
  use_permit(
    get_page_path_wxo_app().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxo_app_service::update_by_id_wxo_app(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除公众号设置
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wxo_app().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxo_app_service::delete_by_ids_wxo_app(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找公众号设置是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = wxo_app_service::get_is_enabled_by_id_wxo_app(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用公众号设置
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wxo_app().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = wxo_app_service::enable_by_ids_wxo_app(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找公众号设置是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = wxo_app_service::get_is_locked_by_id_wxo_app(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁公众号设置
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wxo_app().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = wxo_app_service::lock_by_ids_wxo_app(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取公众号设置字段注释
#[function_name::named]
pub async fn get_field_comments_wxo_app(
  options: Option<Options>,
) -> Result<WxoAppFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxo_app_service::get_field_comments_wxo_app(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原公众号设置
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wxo_app().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxo_app_service::revert_by_ids_wxo_app(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除公众号设置
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_wxo_app().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxo_app_service::force_delete_by_ids_wxo_app(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 公众号设置 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_wxo_app(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = wxo_app_service::find_last_order_by_wxo_app(
    options,
  ).await?;
  
  Ok(res)
}
