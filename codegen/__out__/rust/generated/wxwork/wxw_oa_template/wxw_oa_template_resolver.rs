
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

use super::wxw_oa_template_model::*;
use super::wxw_oa_template_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找审批模板列表
#[function_name::named]
pub async fn find_all_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("find"),
  ).await?;
  
  check_sort_wxw_oa_template(sort.as_deref())?;
  
  let models = wxw_oa_template_service::find_all_wxw_oa_template(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找审批模板总数
#[function_name::named]
pub async fn find_count_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("find"),
  ).await?;
  
  let num = wxw_oa_template_service::find_count_wxw_oa_template(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个审批模板
#[function_name::named]
pub async fn find_one_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwOaTemplateModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("find"),
  ).await?;
  
  check_sort_wxw_oa_template(sort.as_deref())?;
  
  let model = wxw_oa_template_service::find_one_wxw_oa_template(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个审批模板, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxwOaTemplateModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("find"),
  ).await?;
  
  check_sort_wxw_oa_template(sort.as_deref())?;
  
  let model = wxw_oa_template_service::find_one_ok_wxw_oa_template(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找审批模板
#[function_name::named]
pub async fn find_by_id_wxw_oa_template(
  id: WxwOaTemplateId,
  options: Option<Options>,
) -> Result<Option<WxwOaTemplateModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_oa_template_service::find_by_id_wxw_oa_template(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找审批模板, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wxw_oa_template(
  id: WxwOaTemplateId,
  options: Option<Options>,
) -> Result<WxwOaTemplateModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_oa_template_service::find_by_id_ok_wxw_oa_template(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找审批模板
#[function_name::named]
pub async fn find_by_ids_wxw_oa_template(
  ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_oa_template_service::find_by_ids_wxw_oa_template(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据搜索条件判断审批模板是否存在
#[function_name::named]
pub async fn exists_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("find"),
  ).await?;
  
  let res = wxw_oa_template_service::exists_wxw_oa_template(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 查找审批模板, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wxw_oa_template(
  ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_oa_template_service::find_by_ids_ok_wxw_oa_template(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建审批模板
#[allow(dead_code, unused_mut)]
#[function_name::named]
pub async fn creates_wxw_oa_template(
  inputs: Vec<WxwOaTemplateInput>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateId>> {
  
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
    let mut input = wxw_oa_template_service::set_id_by_lbl_wxw_oa_template(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("add"),
  ).await?;
  
  let ids = wxw_oa_template_service::creates_wxw_oa_template(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 审批模板根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wxw_oa_template(
  id: WxwOaTemplateId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_oa_template_service::update_tenant_by_id_wxw_oa_template(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改审批模板
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_wxw_oa_template(
  id: WxwOaTemplateId,
  input: WxwOaTemplateInput,
  options: Option<Options>,
) -> Result<WxwOaTemplateId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxw_oa_template_service::set_id_by_lbl_wxw_oa_template(
    input,
  ).await?;
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("edit"),
  ).await?;
  
  let res = wxw_oa_template_service::update_by_id_wxw_oa_template(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除审批模板
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wxw_oa_template(
  ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("delete"),
  ).await?;
  
  let num = wxw_oa_template_service::delete_by_ids_wxw_oa_template(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找审批模板是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_wxw_oa_template(
  id: WxwOaTemplateId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = wxw_oa_template_service::get_is_enabled_by_id_wxw_oa_template(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用审批模板
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_wxw_oa_template(
  ids: Vec<WxwOaTemplateId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("edit"),
  ).await?;
  
  let num = wxw_oa_template_service::enable_by_ids_wxw_oa_template(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取审批模板字段注释
#[function_name::named]
pub async fn get_field_comments_wxw_oa_template(
  options: Option<Options>,
) -> Result<WxwOaTemplateFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxw_oa_template_service::get_field_comments_wxw_oa_template(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原审批模板
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wxw_oa_template(
  ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("delete"),
  ).await?;
  
  let num = wxw_oa_template_service::revert_by_ids_wxw_oa_template(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除审批模板
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wxw_oa_template(
  ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_wxw_oa_template()),
    String::from("force_delete"),
  ).await?;
  
  let num = wxw_oa_template_service::force_delete_by_ids_wxw_oa_template(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 审批模板 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = wxw_oa_template_service::find_last_order_by_wxw_oa_template(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
