
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

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

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use crate::base::org::org_model::OrgId;

use crate::base::usr::usr_dao::{
  find_by_id_ok_usr,
};

use super::message_receiver_model::*;
use super::message_receiver_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut MessageReceiverSearch,
  options: Option<Options>,
) -> Result<()> {
  
  let usr_id = if let Some(auth_usr_id) = search.auth_usr_id.clone() {
    auth_usr_id
  } else {
    get_auth_id_ok()?
  };
  
  let usr_model = find_by_id_ok_usr(
    usr_id,
    options,
  ).await?;
  
  let org_id = get_auth_org_id().unwrap_or_default();
  let mut org_ids: Vec<OrgId> = vec![];
  if search.auth_usr_id.unwrap_or_default().is_empty() && !org_id.is_empty() {
    org_ids.push(org_id);
  } else {
    org_ids.append(&mut usr_model.org_ids.clone());
    org_ids.push(OrgId::default());
  }
  
  search.org_id = Some(org_ids);
  
  Ok(())
}

/// 根据搜索条件和分页查找消息接收人列表
pub async fn find_all_message_receiver(
  search: Option<MessageReceiverSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_receiver_models = message_receiver_dao::find_all_message_receiver(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(message_receiver_models)
}

/// 根据条件查找消息接收人总数
pub async fn find_count_message_receiver(
  search: Option<MessageReceiverSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_receiver_num = message_receiver_dao::find_count_message_receiver(
    Some(search),
    options,
  ).await?;
  
  Ok(message_receiver_num)
}

/// 根据条件查找第一个消息接收人
pub async fn find_one_message_receiver(
  search: Option<MessageReceiverSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MessageReceiverModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_receiver_model = message_receiver_dao::find_one_message_receiver(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(message_receiver_model)
}

/// 根据条件查找第一个消息接收人, 如果不存在则抛错
pub async fn find_one_ok_message_receiver(
  search: Option<MessageReceiverSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_receiver_model = message_receiver_dao::find_one_ok_message_receiver(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(message_receiver_model)
}

/// 根据 id 查找消息接收人
pub async fn find_by_id_message_receiver(
  message_receiver_id: MessageReceiverId,
  options: Option<Options>,
) -> Result<Option<MessageReceiverModel>> {
  
  let message_receiver_model = message_receiver_dao::find_by_id_message_receiver(
    message_receiver_id,
    options,
  ).await?;
  
  Ok(message_receiver_model)
}

/// 根据 id 查找消息接收人, 如果不存在则抛错
pub async fn find_by_id_ok_message_receiver(
  message_receiver_id: MessageReceiverId,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  let message_receiver_model = message_receiver_dao::find_by_id_ok_message_receiver(
    message_receiver_id,
    options,
  ).await?;
  
  Ok(message_receiver_model)
}

/// 根据 ids 查找消息接收人
pub async fn find_by_ids_message_receiver(
  message_receiver_ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let message_receiver_models = message_receiver_dao::find_by_ids_message_receiver(
    message_receiver_ids,
    options,
  ).await?;
  
  Ok(message_receiver_models)
}

/// 根据 ids 查找消息接收人, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_message_receiver(
  message_receiver_ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let message_receiver_models = message_receiver_dao::find_by_ids_ok_message_receiver(
    message_receiver_ids,
    options,
  ).await?;
  
  Ok(message_receiver_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_message_receiver(
  message_receiver_input: MessageReceiverInput,
) -> Result<MessageReceiverInput> {
  
  let message_receiver_input = message_receiver_dao::set_id_by_lbl_message_receiver(
    message_receiver_input,
  ).await?;
  
  Ok(message_receiver_input)
}

/// 创建消息接收人
#[allow(dead_code)]
pub async fn creates_message_receiver(
  message_receiver_inputs: Vec<MessageReceiverInput>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverId>> {
  
  let message_receiver_ids = message_receiver_dao::creates_message_receiver(
    message_receiver_inputs,
    options,
  ).await?;
  
  Ok(message_receiver_ids)
}

/// 消息接收人根据 message_receiver_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_message_receiver(
  message_receiver_id: MessageReceiverId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_receiver_dao::update_tenant_by_id_message_receiver(
    message_receiver_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 message_receiver_id 修改消息接收人
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_message_receiver(
  message_receiver_id: MessageReceiverId,
  mut message_receiver_input: MessageReceiverInput,
  options: Option<Options>,
) -> Result<MessageReceiverId> {
  
  let message_receiver_id = message_receiver_dao::update_by_id_message_receiver(
    message_receiver_id,
    message_receiver_input,
    options,
  ).await?;
  
  Ok(message_receiver_id)
}

/// 校验消息接收人是否存在
#[allow(dead_code)]
pub async fn validate_option_message_receiver(
  message_receiver_model: Option<MessageReceiverModel>,
) -> Result<MessageReceiverModel> {
  
  let message_receiver_model = message_receiver_dao::validate_option_message_receiver(message_receiver_model).await?;
  
  Ok(message_receiver_model)
}

/// 根据 message_receiver_ids 删除消息接收人
#[allow(dead_code)]
pub async fn delete_by_ids_message_receiver(
  message_receiver_ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_receiver_dao::delete_by_ids_message_receiver(
    message_receiver_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取消息接收人字段注释
pub async fn get_field_comments_message_receiver(
  options: Option<Options>,
) -> Result<MessageReceiverFieldComment> {
  
  let comments = message_receiver_dao::get_field_comments_message_receiver(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 message_receiver_ids 还原消息接收人
#[allow(dead_code)]
pub async fn revert_by_ids_message_receiver(
  message_receiver_ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_receiver_dao::revert_by_ids_message_receiver(
    message_receiver_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 message_receiver_ids 彻底删除消息接收人
#[allow(dead_code)]
pub async fn force_delete_by_ids_message_receiver(
  message_receiver_ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_receiver_dao::force_delete_by_ids_message_receiver(
    message_receiver_ids,
    options,
  ).await?;
  
  Ok(num)
}
