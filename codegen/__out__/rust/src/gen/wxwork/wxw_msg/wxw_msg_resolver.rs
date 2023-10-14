use anyhow::Result;

use crate::common::context::{Ctx, Options};
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::wxw_msg_model::*;
use super::wxw_msg_service;

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &Ctx<'a>,
  search: Option<WxwMsgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgModel>> {
  
  let res = wxw_msg_service::find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
pub async fn find_count<'a>(
  ctx: &Ctx<'a>,
  search: Option<WxwMsgSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = wxw_msg_service::find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &Ctx<'a>,
  search: Option<WxwMsgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  let model = wxw_msg_service::find_one(
    ctx,
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  let model = wxw_msg_service::find_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
#[allow(dead_code)]
pub async fn create<'a>(
  ctx: &Ctx<'a>,
  input: WxwMsgInput,
  options: Option<Options>,
) -> Result<String> {
  
  let input = wxw_msg_service::set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  use_permit(
    ctx,
    "/wxwork/wxw_msg".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = wxw_msg_service::create(
    ctx,
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id<'a>(
  ctx: &Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_msg_service::update_tenant_by_id(
    ctx,
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
#[allow(dead_code)]
pub async fn update_by_id<'a>(
  ctx: &Ctx<'a>,
  id: String,
  input: WxwMsgInput,
  options: Option<Options>,
) -> Result<String> {
  
  let input = wxw_msg_service::set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  use_permit(
    ctx,
    "/wxwork/wxw_msg".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxw_msg_service::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据
#[allow(dead_code)]
pub async fn delete_by_ids<'a>(
  ctx: &Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/wxwork/wxw_msg".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments<'a>(
  ctx: &Ctx<'a>,
  options: Option<Options>,
) -> Result<WxwMsgFieldComment> {
  
  let comments = wxw_msg_service::get_field_comments(
    ctx,
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
#[allow(dead_code)]
pub async fn revert_by_ids<'a>(
  ctx: &Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/wxwork/wxw_msg".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
#[allow(dead_code)]
pub async fn force_delete_by_ids<'a>(
  ctx: &Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/wxwork/wxw_msg".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_msg_service::force_delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}
