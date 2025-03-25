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

use super::pay_transactions_jsapi_model::*;
use super::pay_transactions_jsapi_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找微信JSAPI下单列表
#[function_name::named]
pub async fn find_all_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_pay_transactions_jsapi(sort.as_deref())?;
  
  let models = pay_transactions_jsapi_service::find_all_pay_transactions_jsapi(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找微信JSAPI下单总数
#[function_name::named]
pub async fn find_count_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = pay_transactions_jsapi_service::find_count_pay_transactions_jsapi(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个微信JSAPI下单
#[function_name::named]
pub async fn find_one_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PayTransactionsJsapiModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_pay_transactions_jsapi(sort.as_deref())?;
  
  let model = pay_transactions_jsapi_service::find_one_pay_transactions_jsapi(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找微信JSAPI下单
#[function_name::named]
pub async fn find_by_id_pay_transactions_jsapi(
  id: PayTransactionsJsapiId,
  options: Option<Options>,
) -> Result<Option<PayTransactionsJsapiModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = pay_transactions_jsapi_service::find_by_id_pay_transactions_jsapi(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找微信JSAPI下单
#[function_name::named]
pub async fn find_by_ids_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = pay_transactions_jsapi_service::find_by_ids_pay_transactions_jsapi(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 微信JSAPI下单根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_pay_transactions_jsapi(
  id: PayTransactionsJsapiId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = pay_transactions_jsapi_service::update_tenant_by_id_pay_transactions_jsapi(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信JSAPI下单字段注释
#[function_name::named]
pub async fn get_field_comments_pay_transactions_jsapi(
  options: Option<Options>,
) -> Result<PayTransactionsJsapiFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = pay_transactions_jsapi_service::get_field_comments_pay_transactions_jsapi(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原微信JSAPI下单
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_pay_transactions_jsapi(),
    "delete".to_owned(),
  ).await?;
  
  let num = pay_transactions_jsapi_service::revert_by_ids_pay_transactions_jsapi(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除微信JSAPI下单
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_pay_transactions_jsapi(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = pay_transactions_jsapi_service::force_delete_by_ids_pay_transactions_jsapi(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
