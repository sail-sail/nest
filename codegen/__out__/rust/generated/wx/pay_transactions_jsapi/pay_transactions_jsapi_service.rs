#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::pay_transactions_jsapi_model::*;
use super::pay_transactions_jsapi_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut PayTransactionsJsapiSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找微信JSAPI下单列表
pub async fn find_all_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let pay_transactions_jsapi_models = pay_transactions_jsapi_dao::find_all_pay_transactions_jsapi(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_models)
}

/// 根据条件查找微信JSAPI下单总数
pub async fn find_count_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let pay_transactions_jsapi_num = pay_transactions_jsapi_dao::find_count_pay_transactions_jsapi(
    Some(search),
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_num)
}

/// 根据条件查找第一个微信JSAPI下单
pub async fn find_one_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PayTransactionsJsapiModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let pay_transactions_jsapi_model = pay_transactions_jsapi_dao::find_one_pay_transactions_jsapi(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_model)
}

/// 根据 id 查找微信JSAPI下单
pub async fn find_by_id_pay_transactions_jsapi(
  pay_transactions_jsapi_id: PayTransactionsJsapiId,
  options: Option<Options>,
) -> Result<Option<PayTransactionsJsapiModel>> {
  
  let pay_transactions_jsapi_model = pay_transactions_jsapi_dao::find_by_id_pay_transactions_jsapi(
    pay_transactions_jsapi_id,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_model)
}

/// 根据 pay_transactions_jsapi_ids 查找微信JSAPI下单
pub async fn find_by_ids_pay_transactions_jsapi(
  pay_transactions_jsapi_ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  let pay_transactions_jsapi_models = pay_transactions_jsapi_dao::find_by_ids_pay_transactions_jsapi(
    pay_transactions_jsapi_ids,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_pay_transactions_jsapi(
  pay_transactions_jsapi_input: PayTransactionsJsapiInput,
) -> Result<PayTransactionsJsapiInput> {
  
  let pay_transactions_jsapi_input = pay_transactions_jsapi_dao::set_id_by_lbl_pay_transactions_jsapi(
    pay_transactions_jsapi_input,
  ).await?;
  
  Ok(pay_transactions_jsapi_input)
}

/// 创建微信JSAPI下单
#[allow(dead_code)]
pub async fn creates_pay_transactions_jsapi(
  pay_transactions_jsapi_inputs: Vec<PayTransactionsJsapiInput>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiId>> {
  
  let pay_transactions_jsapi_ids = pay_transactions_jsapi_dao::creates_pay_transactions_jsapi(
    pay_transactions_jsapi_inputs,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_ids)
}

/// 微信JSAPI下单根据 pay_transactions_jsapi_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_pay_transactions_jsapi(
  pay_transactions_jsapi_id: PayTransactionsJsapiId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = pay_transactions_jsapi_dao::update_tenant_by_id_pay_transactions_jsapi(
    pay_transactions_jsapi_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 pay_transactions_jsapi_id 修改微信JSAPI下单
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_pay_transactions_jsapi(
  pay_transactions_jsapi_id: PayTransactionsJsapiId,
  mut pay_transactions_jsapi_input: PayTransactionsJsapiInput,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiId> {
  
  let pay_transactions_jsapi_id = pay_transactions_jsapi_dao::update_by_id_pay_transactions_jsapi(
    pay_transactions_jsapi_id,
    pay_transactions_jsapi_input,
    options.clone(),
  ).await?;
  
  Ok(pay_transactions_jsapi_id)
}

/// 校验微信JSAPI下单是否存在
#[allow(dead_code)]
pub async fn validate_option_pay_transactions_jsapi(
  pay_transactions_jsapi_model: Option<PayTransactionsJsapiModel>,
) -> Result<PayTransactionsJsapiModel> {
  
  let pay_transactions_jsapi_model = pay_transactions_jsapi_dao::validate_option_pay_transactions_jsapi(pay_transactions_jsapi_model).await?;
  
  Ok(pay_transactions_jsapi_model)
}

/// 根据 pay_transactions_jsapi_ids 删除微信JSAPI下单
#[allow(dead_code)]
pub async fn delete_by_ids_pay_transactions_jsapi(
  pay_transactions_jsapi_ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = pay_transactions_jsapi_dao::delete_by_ids_pay_transactions_jsapi(
    pay_transactions_jsapi_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信JSAPI下单字段注释
pub async fn get_field_comments_pay_transactions_jsapi(
  options: Option<Options>,
) -> Result<PayTransactionsJsapiFieldComment> {
  
  let comments = pay_transactions_jsapi_dao::get_field_comments_pay_transactions_jsapi(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 pay_transactions_jsapi_ids 还原微信JSAPI下单
#[allow(dead_code)]
pub async fn revert_by_ids_pay_transactions_jsapi(
  pay_transactions_jsapi_ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = pay_transactions_jsapi_dao::revert_by_ids_pay_transactions_jsapi(
    pay_transactions_jsapi_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 pay_transactions_jsapi_ids 彻底删除微信JSAPI下单
#[allow(dead_code)]
pub async fn force_delete_by_ids_pay_transactions_jsapi(
  pay_transactions_jsapi_ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = pay_transactions_jsapi_dao::force_delete_by_ids_pay_transactions_jsapi(
    pay_transactions_jsapi_ids,
    options,
  ).await?;
  
  Ok(num)
}
