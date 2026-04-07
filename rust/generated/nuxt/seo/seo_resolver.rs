
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

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::seo_model::*;
use super::seo_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找SEO优化列表
#[function_name::named]
pub async fn find_all_seo(
  search: Option<SeoSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_seo(sort.as_deref())?;
  
  let models = seo_service::find_all_seo(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找SEO优化总数
#[function_name::named]
pub async fn find_count_seo(
  search: Option<SeoSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = seo_service::find_count_seo(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个SEO优化
#[function_name::named]
pub async fn find_one_seo(
  search: Option<SeoSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_seo(sort.as_deref())?;
  
  let model = seo_service::find_one_seo(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个SEO优化, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_seo(
  search: Option<SeoSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_seo(sort.as_deref())?;
  
  let model = seo_service::find_one_ok_seo(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找SEO优化
#[function_name::named]
pub async fn find_by_id_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = seo_service::find_by_id_seo(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找SEO优化, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = seo_service::find_by_id_ok_seo(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找SEO优化
#[function_name::named]
pub async fn find_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = seo_service::find_by_ids_seo(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找SEO优化, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = seo_service::find_by_ids_ok_seo(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建SEO优化
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_seo(
  inputs: Vec<SeoInput>,
  options: Option<Options>,
) -> Result<Vec<SeoId>> {
  
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
    let input = seo_service::set_id_by_lbl_seo(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_seo()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = seo_service::creates_seo(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// SEO优化根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_seo(
  id: SeoId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = seo_service::update_tenant_by_id_seo(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改SEO优化
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_seo(
  id: SeoId,
  input: SeoInput,
  options: Option<Options>,
) -> Result<SeoId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = seo_service::set_id_by_lbl_seo(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_seo()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = seo_service::update_by_id_seo(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除SEO优化
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_seo()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = seo_service::delete_by_ids_seo(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 设置默认SEO优化
#[allow(dead_code)]
#[function_name::named]
pub async fn default_by_id_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_seo()),
    SmolStr::new("edit"),
  ).await?;
  
  let num = seo_service::default_by_id_seo(
    id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找SEO优化是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = seo_service::get_is_locked_by_id_seo(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁SEO优化
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_seo(
  ids: Vec<SeoId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_seo()),
    SmolStr::new("edit"),
  ).await?;
  
  let num = seo_service::lock_by_ids_seo(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取SEO优化字段注释
#[function_name::named]
pub async fn get_field_comments_seo(
  options: Option<Options>,
) -> Result<SeoFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = seo_service::get_field_comments_seo(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原SEO优化
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_seo()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = seo_service::revert_by_ids_seo(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除SEO优化
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_seo()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = seo_service::force_delete_by_ids_seo(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 SEO优化 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_seo(
  search: Option<SeoSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = seo_service::find_last_order_by_seo(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
