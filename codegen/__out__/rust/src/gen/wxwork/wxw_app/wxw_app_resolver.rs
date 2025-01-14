#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::wxw_app_model::*;
use super::wxw_app_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找企微应用列表
pub async fn find_all(
  search: Option<WxwAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppModel>> {
  
  check_sort_wxw_app(sort.as_deref())?;
  
  let models = wxw_app_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找企微应用总数
pub async fn find_count(
  search: Option<WxwAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个企微应用
pub async fn find_one(
  search: Option<WxwAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
  check_sort_wxw_app(sort.as_deref())?;
  
  let model = wxw_app_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微应用
pub async fn find_by_id(
  id: WxwAppId,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
  let model = wxw_app_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建企微应用
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<WxwAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = wxw_app_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wxw_app(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxw_app_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 企微应用根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: WxwAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改企微应用
#[allow(dead_code)]
pub async fn update_by_id(
  id: WxwAppId,
  input: WxwAppInput,
  options: Option<Options>,
) -> Result<WxwAppId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxw_app_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wxw_app(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxw_app_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除企微应用
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_app_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找企微应用是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: WxwAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = wxw_app_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用企微应用
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<WxwAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app(),
    "edit".to_owned(),
  ).await?;
  
  let num = wxw_app_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找企微应用是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: WxwAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = wxw_app_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁企微应用
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<WxwAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app(),
    "edit".to_owned(),
  ).await?;
  
  let num = wxw_app_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微应用字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwAppFieldComment> {
  
  let comments = wxw_app_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原企微应用
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_app_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除企微应用
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_wxw_app(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_app_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 企微应用 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = wxw_app_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
