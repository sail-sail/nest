#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::wxw_msg_model::*;
use super::wxw_msg_service;

use crate::gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找企微消息列表
pub async fn find_all(
  search: Option<WxwMsgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgModel>> {
  
  let res = wxw_msg_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找企微消息总数
pub async fn find_count(
  search: Option<WxwMsgSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = wxw_msg_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个企微消息
pub async fn find_one(
  search: Option<WxwMsgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  let model = wxw_msg_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微消息
pub async fn find_by_id(
  id: WxwMsgId,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  let model = wxw_msg_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建企微消息
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<WxwMsgInput>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = wxw_msg_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    "/wxwork/wxw_msg".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxw_msg_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 企微消息根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: WxwMsgId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_msg_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改企微消息
#[allow(dead_code)]
pub async fn update_by_id(
  id: WxwMsgId,
  input: WxwMsgInput,
  options: Option<Options>,
) -> Result<WxwMsgId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxw_msg_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/wxwork/wxw_msg".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxw_msg_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除企微消息
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/wxwork/wxw_msg".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微消息字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwMsgFieldComment> {
  
  let comments = wxw_msg_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原企微消息
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/wxwork/wxw_msg".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除企微消息
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/wxwork/wxw_msg".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
