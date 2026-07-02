
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

use super::message_model::*;
use super::message_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找消息列表
#[function_name::named]
pub async fn find_all_message(
  search: Option<MessageSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_message(sort.as_deref())?;
  
  let models = message_service::find_all_message(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找消息总数
#[function_name::named]
pub async fn find_count_message(
  search: Option<MessageSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = message_service::find_count_message(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个消息
#[function_name::named]
pub async fn find_one_message(
  search: Option<MessageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MessageModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_message(sort.as_deref())?;
  
  let model = message_service::find_one_message(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个消息, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_message(
  search: Option<MessageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_message(sort.as_deref())?;
  
  let model = message_service::find_one_ok_message(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找消息
#[function_name::named]
pub async fn find_by_id_message(
  id: MessageId,
  options: Option<Options>,
) -> Result<Option<MessageModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = message_service::find_by_id_message(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找消息, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_message(
  id: MessageId,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = message_service::find_by_id_ok_message(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找消息
#[function_name::named]
pub async fn find_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = message_service::find_by_ids_message(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找消息, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = message_service::find_by_ids_ok_message(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建消息
#[allow(dead_code, unused_mut)]
#[function_name::named]
pub async fn creates_message(
  inputs: Vec<MessageInput>,
  options: Option<Options>,
) -> Result<Vec<MessageId>> {
  
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
    let mut input = message_service::set_id_by_lbl_message(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_message()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = message_service::creates_message(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 消息根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_message(
  id: MessageId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = message_service::update_tenant_by_id_message(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改消息
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_message(
  id: MessageId,
  input: MessageInput,
  options: Option<Options>,
) -> Result<MessageId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = message_service::set_id_by_lbl_message(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_message()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = message_service::update_by_id_message(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除消息
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_message()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = message_service::delete_by_ids_message(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取消息字段注释
#[function_name::named]
pub async fn get_field_comments_message(
  options: Option<Options>,
) -> Result<MessageFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = message_service::get_field_comments_message(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原消息
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_message()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = message_service::revert_by_ids_message(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除消息
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_message()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = message_service::force_delete_by_ids_message(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
