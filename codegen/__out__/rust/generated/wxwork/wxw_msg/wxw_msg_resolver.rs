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

use super::wxw_msg_model::*;
use super::wxw_msg_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找企微消息列表
#[function_name::named]
pub async fn find_all_wxw_msg(
  search: Option<WxwMsgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_msg(sort.as_deref())?;
  
  let models = wxw_msg_service::find_all_wxw_msg(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找企微消息总数
#[function_name::named]
pub async fn find_count_wxw_msg(
  search: Option<WxwMsgSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_msg_service::find_count_wxw_msg(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个企微消息
#[function_name::named]
pub async fn find_one_wxw_msg(
  search: Option<WxwMsgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_msg(sort.as_deref())?;
  
  let model = wxw_msg_service::find_one_wxw_msg(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微消息
#[function_name::named]
pub async fn find_by_id_wxw_msg(
  id: WxwMsgId,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_msg_service::find_by_id_wxw_msg(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找企微消息
#[function_name::named]
pub async fn find_by_ids_wxw_msg(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_msg_service::find_by_ids_wxw_msg(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 企微消息根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wxw_msg(
  id: WxwMsgId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_msg_service::update_tenant_by_id_wxw_msg(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除企微消息
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wxw_msg(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_msg(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::delete_by_ids_wxw_msg(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微消息字段注释
#[function_name::named]
pub async fn get_field_comments_wxw_msg(
  options: Option<Options>,
) -> Result<WxwMsgFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxw_msg_service::get_field_comments_wxw_msg(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原企微消息
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wxw_msg(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_msg(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::revert_by_ids_wxw_msg(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除企微消息
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wxw_msg(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_msg(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::force_delete_by_ids_wxw_msg(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
