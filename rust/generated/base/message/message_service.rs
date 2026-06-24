
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
  find_by_id_usr,
  validate_option_usr,
};

use crate::common::usr::usr_dao::is_admin;

use super::message_model::*;
use super::message_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut MessageSearch,
  options: Option<Options>,
) -> Result<()> {
  
  let usr_id = get_auth_id_ok()?;
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id,
      options,
    ).await?,
  ).await?;
  
  let org_id = get_auth_org_id().unwrap_or_default();
  let mut org_ids: Vec<OrgId> = vec![];
  if !org_id.is_empty() {
    org_ids.push(org_id);
  } else {
    org_ids.append(&mut usr_model.org_ids.clone());
    org_ids.push(OrgId::default());
  }
  
  if !is_admin(usr_id, options).await? {
    search.org_id = Some(org_ids);
  }
  Ok(())
}

/// 根据搜索条件和分页查找消息列表
pub async fn find_all_message(
  search: Option<MessageSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_models = message_dao::find_all_message(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(message_models)
}

/// 根据条件查找消息总数
pub async fn find_count_message(
  search: Option<MessageSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_num = message_dao::find_count_message(
    Some(search),
    options,
  ).await?;
  
  Ok(message_num)
}

/// 根据条件查找第一个消息
pub async fn find_one_message(
  search: Option<MessageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MessageModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_model = message_dao::find_one_message(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(message_model)
}

/// 根据条件查找第一个消息, 如果不存在则抛错
pub async fn find_one_ok_message(
  search: Option<MessageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let message_model = message_dao::find_one_ok_message(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(message_model)
}

/// 根据 id 查找消息
pub async fn find_by_id_message(
  message_id: MessageId,
  options: Option<Options>,
) -> Result<Option<MessageModel>> {
  
  let message_model = message_dao::find_by_id_message(
    message_id,
    options,
  ).await?;
  
  Ok(message_model)
}

/// 根据 id 查找消息, 如果不存在则抛错
pub async fn find_by_id_ok_message(
  message_id: MessageId,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  let message_model = message_dao::find_by_id_ok_message(
    message_id,
    options,
  ).await?;
  
  Ok(message_model)
}

/// 根据 ids 查找消息
pub async fn find_by_ids_message(
  message_ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let message_models = message_dao::find_by_ids_message(
    message_ids,
    options,
  ).await?;
  
  Ok(message_models)
}

/// 根据 ids 查找消息, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_message(
  message_ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let message_models = message_dao::find_by_ids_ok_message(
    message_ids,
    options,
  ).await?;
  
  Ok(message_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_message(
  message_input: MessageInput,
) -> Result<MessageInput> {
  
  let message_input = message_dao::set_id_by_lbl_message(
    message_input,
  ).await?;
  
  Ok(message_input)
}

/// 创建消息
#[allow(dead_code)]
pub async fn creates_message(
  message_inputs: Vec<MessageInput>,
  options: Option<Options>,
) -> Result<Vec<MessageId>> {
  
  let message_ids = message_dao::creates_message(
    message_inputs,
    options,
  ).await?;
  
  Ok(message_ids)
}

/// 消息根据 message_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_message(
  message_id: MessageId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_dao::update_tenant_by_id_message(
    message_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 message_id 修改消息
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_message(
  message_id: MessageId,
  mut message_input: MessageInput,
  options: Option<Options>,
) -> Result<MessageId> {
  
  let message_id = message_dao::update_by_id_message(
    message_id,
    message_input,
    options,
  ).await?;
  
  Ok(message_id)
}

/// 校验消息是否存在
#[allow(dead_code)]
pub async fn validate_option_message(
  message_model: Option<MessageModel>,
) -> Result<MessageModel> {
  
  let message_model = message_dao::validate_option_message(message_model).await?;
  
  Ok(message_model)
}

/// 根据 message_ids 删除消息
#[allow(dead_code)]
pub async fn delete_by_ids_message(
  message_ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_dao::delete_by_ids_message(
    message_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取消息字段注释
pub async fn get_field_comments_message(
  options: Option<Options>,
) -> Result<MessageFieldComment> {
  
  let comments = message_dao::get_field_comments_message(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 message_ids 还原消息
#[allow(dead_code)]
pub async fn revert_by_ids_message(
  message_ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_dao::revert_by_ids_message(
    message_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 message_ids 彻底删除消息
#[allow(dead_code)]
pub async fn force_delete_by_ids_message(
  message_ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = message_dao::force_delete_by_ids_message(
    message_ids,
    options,
  ).await?;
  
  Ok(num)
}
