
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

use super::wxw_oa_approval_detail_model::*;
use super::wxw_oa_approval_detail_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找审批申请详情列表
#[function_name::named]
pub async fn find_all_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_oa_approval_detail(sort.as_deref())?;
  
  let models = wxw_oa_approval_detail_service::find_all_wxw_oa_approval_detail(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找审批申请详情总数
#[function_name::named]
pub async fn find_count_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_oa_approval_detail_service::find_count_wxw_oa_approval_detail(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个审批申请详情
#[function_name::named]
pub async fn find_one_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwOaApprovalDetailModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_oa_approval_detail(sort.as_deref())?;
  
  let model = wxw_oa_approval_detail_service::find_one_wxw_oa_approval_detail(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个审批申请详情, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_oa_approval_detail(sort.as_deref())?;
  
  let model = wxw_oa_approval_detail_service::find_one_ok_wxw_oa_approval_detail(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找审批申请详情
#[function_name::named]
pub async fn find_by_id_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  options: Option<Options>,
) -> Result<Option<WxwOaApprovalDetailModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_oa_approval_detail_service::find_by_id_wxw_oa_approval_detail(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找审批申请详情, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_oa_approval_detail_service::find_by_id_ok_wxw_oa_approval_detail(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找审批申请详情
#[function_name::named]
pub async fn find_by_ids_wxw_oa_approval_detail(
  ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_oa_approval_detail_service::find_by_ids_wxw_oa_approval_detail(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据搜索条件判断审批申请详情是否存在
#[function_name::named]
pub async fn exists_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = wxw_oa_approval_detail_service::exists_wxw_oa_approval_detail(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 查找审批申请详情, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wxw_oa_approval_detail(
  ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_oa_approval_detail_service::find_by_ids_ok_wxw_oa_approval_detail(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 审批申请详情根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_oa_approval_detail_service::update_tenant_by_id_wxw_oa_approval_detail(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除审批申请详情
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wxw_oa_approval_detail(
  ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_approval_detail()),
    String::from("delete"),
  ).await?;
  
  let num = wxw_oa_approval_detail_service::delete_by_ids_wxw_oa_approval_detail(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取审批申请详情字段注释
#[function_name::named]
pub async fn get_field_comments_wxw_oa_approval_detail(
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxw_oa_approval_detail_service::get_field_comments_wxw_oa_approval_detail(
    options,
  ).await?;
  
  Ok(comments)
}
