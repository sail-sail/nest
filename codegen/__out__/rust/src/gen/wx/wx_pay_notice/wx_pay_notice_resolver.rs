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

use super::wx_pay_notice_model::*;
use super::wx_pay_notice_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找微信支付通知列表
#[function_name::named]
pub async fn find_all(
  search: Option<WxPayNoticeSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxPayNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_pay_notice(sort.as_deref())?;
  
  let models = wx_pay_notice_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找微信支付通知总数
#[function_name::named]
pub async fn find_count(
  search: Option<WxPayNoticeSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_pay_notice_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个微信支付通知
#[function_name::named]
pub async fn find_one(
  search: Option<WxPayNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxPayNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_pay_notice(sort.as_deref())?;
  
  let model = wx_pay_notice_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找微信支付通知
#[function_name::named]
pub async fn find_by_id(
  id: WxPayNoticeId,
  options: Option<Options>,
) -> Result<Option<WxPayNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_pay_notice_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找微信支付通知
#[function_name::named]
pub async fn find_by_ids(
  ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxPayNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_pay_notice_service::find_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 微信支付通知根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id(
  id: WxPayNoticeId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_pay_notice_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信支付通知字段注释
#[function_name::named]
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxPayNoticeFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wx_pay_notice_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原微信支付通知
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids(
  ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_pay_notice(),
    "delete".to_owned(),
  ).await?;
  
  let num = wx_pay_notice_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除微信支付通知
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids(
  ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_pay_notice(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wx_pay_notice_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
