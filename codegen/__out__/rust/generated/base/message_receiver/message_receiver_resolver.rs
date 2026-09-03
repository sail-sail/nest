
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

use super::message_receiver_model::*;
use super::message_receiver_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找消息接收人列表
#[function_name::named]
pub async fn find_all_message_receiver(
  search: Option<MessageReceiverSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_message_receiver(sort.as_deref())?;
  
  let models = message_receiver_service::find_all_message_receiver(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找消息接收人总数
#[function_name::named]
pub async fn find_count_message_receiver(
  search: Option<MessageReceiverSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = message_receiver_service::find_count_message_receiver(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个消息接收人
#[function_name::named]
pub async fn find_one_message_receiver(
  search: Option<MessageReceiverSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MessageReceiverModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_message_receiver(sort.as_deref())?;
  
  let model = message_receiver_service::find_one_message_receiver(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个消息接收人, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_message_receiver(
  search: Option<MessageReceiverSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_message_receiver(sort.as_deref())?;
  
  let model = message_receiver_service::find_one_ok_message_receiver(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找消息接收人
#[function_name::named]
pub async fn find_by_id_message_receiver(
  id: MessageReceiverId,
  options: Option<Options>,
) -> Result<Option<MessageReceiverModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = message_receiver_service::find_by_id_message_receiver(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找消息接收人, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_message_receiver(
  id: MessageReceiverId,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = message_receiver_service::find_by_id_ok_message_receiver(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找消息接收人
#[function_name::named]
pub async fn find_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = message_receiver_service::find_by_ids_message_receiver(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据搜索条件判断消息接收人是否存在
#[function_name::named]
pub async fn exists_message_receiver(
  search: Option<MessageReceiverSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = message_receiver_service::exists_message_receiver(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 查找消息接收人, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = message_receiver_service::find_by_ids_ok_message_receiver(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建消息接收人
#[allow(dead_code, unused_mut)]
#[function_name::named]
pub async fn creates_message_receiver(
  inputs: Vec<MessageReceiverInput>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverId>> {
  
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
    let mut input = message_receiver_service::set_id_by_lbl_message_receiver(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    String::from(get_page_path_message_receiver()),
    String::from("add"),
  ).await?;
  
  let ids = message_receiver_service::creates_message_receiver(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 消息接收人根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_message_receiver(
  id: MessageReceiverId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = message_receiver_service::update_tenant_by_id_message_receiver(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改消息接收人
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_message_receiver(
  id: MessageReceiverId,
  input: MessageReceiverInput,
  options: Option<Options>,
) -> Result<MessageReceiverId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = message_receiver_service::set_id_by_lbl_message_receiver(
    input,
  ).await?;
  
  use_permit(
    String::from(get_page_path_message_receiver()),
    String::from("edit"),
  ).await?;
  
  let res = message_receiver_service::update_by_id_message_receiver(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除消息接收人
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_message_receiver()),
    String::from("delete"),
  ).await?;
  
  let num = message_receiver_service::delete_by_ids_message_receiver(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取消息接收人字段注释
#[function_name::named]
pub async fn get_field_comments_message_receiver(
  options: Option<Options>,
) -> Result<MessageReceiverFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = message_receiver_service::get_field_comments_message_receiver(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原消息接收人
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_message_receiver()),
    String::from("delete"),
  ).await?;
  
  let num = message_receiver_service::revert_by_ids_message_receiver(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除消息接收人
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    String::from(get_page_path_message_receiver()),
    String::from("force_delete"),
  ).await?;
  
  let num = message_receiver_service::force_delete_by_ids_message_receiver(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
