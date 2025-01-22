#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::wxw_msg_model::*;
use super::wxw_msg_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxwMsgSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找企微消息列表
pub async fn find_all(
  search: Option<WxwMsgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = wxw_msg_dao::find_all(
    Some(search),
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
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = wxw_msg_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个企微消息
pub async fn find_one(
  search: Option<WxwMsgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = wxw_msg_dao::find_one(
    Some(search),
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
  
  let model = wxw_msg_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: WxwMsgInput,
) -> Result<WxwMsgInput> {
  
  let input = wxw_msg_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建企微消息
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<WxwMsgInput>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgId>> {
  
  let wxw_msg_ids = wxw_msg_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(wxw_msg_ids)
}

/// 企微消息根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: WxwMsgId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_msg_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改企微消息
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: WxwMsgId,
  mut input: WxwMsgInput,
  options: Option<Options>,
) -> Result<WxwMsgId> {
  
  let wxw_msg_id = wxw_msg_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(wxw_msg_id)
}

/// 根据 ids 删除企微消息
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<WxwMsgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_msg_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微消息字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwMsgFieldComment> {
  
  let comments = wxw_msg_dao::get_field_comments(
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
  
  let num = wxw_msg_dao::revert_by_ids(
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
  
  let num = wxw_msg_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
