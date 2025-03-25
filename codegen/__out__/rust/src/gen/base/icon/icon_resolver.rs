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

use super::icon_model::*;
use super::icon_service;

/// 根据搜索条件和分页查找图标库列表
#[function_name::named]
pub async fn find_all_icon(
  search: Option<IconSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<IconModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_icon(sort.as_deref())?;
  
  let models = icon_service::find_all_icon(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找图标库总数
#[function_name::named]
pub async fn find_count_icon(
  search: Option<IconSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = icon_service::find_count_icon(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个图标库
#[function_name::named]
pub async fn find_one_icon(
  search: Option<IconSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<IconModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_icon(sort.as_deref())?;
  
  let model = icon_service::find_one_icon(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找图标库
#[function_name::named]
pub async fn find_by_id_icon(
  id: IconId,
  options: Option<Options>,
) -> Result<Option<IconModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = icon_service::find_by_id_icon(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找图标库
#[function_name::named]
pub async fn find_by_ids_icon(
  ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<Vec<IconModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = icon_service::find_by_ids_icon(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建图标库
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_icon(
  inputs: Vec<IconInput>,
  options: Option<Options>,
) -> Result<Vec<IconId>> {
  
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
    let input = icon_service::set_id_by_lbl_icon(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_icon(),
    "add".to_owned(),
  ).await?;
  
  let ids = icon_service::creates_icon(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改图标库
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_icon(
  id: IconId,
  input: IconInput,
  options: Option<Options>,
) -> Result<IconId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = icon_service::set_id_by_lbl_icon(
    input,
  ).await?;
  
  use_permit(
    get_route_path_icon(),
    "edit".to_owned(),
  ).await?;
  
  let res = icon_service::update_by_id_icon(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除图标库
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_icon(
  ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_icon(),
    "delete".to_owned(),
  ).await?;
  
  let num = icon_service::delete_by_ids_icon(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找图标库是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_icon(
  id: IconId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = icon_service::get_is_enabled_by_id_icon(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用图标库
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_icon(
  ids: Vec<IconId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_icon(),
    "edit".to_owned(),
  ).await?;
  
  let num = icon_service::enable_by_ids_icon(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取图标库字段注释
#[function_name::named]
pub async fn get_field_comments_icon(
  options: Option<Options>,
) -> Result<IconFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = icon_service::get_field_comments_icon(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原图标库
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_icon(
  ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_icon(),
    "delete".to_owned(),
  ).await?;
  
  let num = icon_service::revert_by_ids_icon(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除图标库
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_icon(
  ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_icon(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = icon_service::force_delete_by_ids_icon(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 图标库 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_icon(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = icon_service::find_last_order_by_icon(
    options,
  ).await?;
  
  Ok(res)
}
