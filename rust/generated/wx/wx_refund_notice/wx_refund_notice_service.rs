
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

use super::wx_refund_notice_model::*;
use super::wx_refund_notice_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxRefundNoticeSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找微信退款通知列表
pub async fn find_all_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_notice_models = wx_refund_notice_dao::find_all_wx_refund_notice(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wx_refund_notice_models)
}

/// 根据条件查找微信退款通知总数
pub async fn find_count_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_notice_num = wx_refund_notice_dao::find_count_wx_refund_notice(
    Some(search),
    options,
  ).await?;
  
  Ok(wx_refund_notice_num)
}

/// 根据条件查找第一个微信退款通知
pub async fn find_one_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxRefundNoticeModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_notice_model = wx_refund_notice_dao::find_one_wx_refund_notice(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_refund_notice_model)
}

/// 根据条件查找第一个微信退款通知, 如果不存在则抛错
pub async fn find_one_ok_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_notice_model = wx_refund_notice_dao::find_one_ok_wx_refund_notice(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_refund_notice_model)
}

/// 根据 id 查找微信退款通知
pub async fn find_by_id_wx_refund_notice(
  wx_refund_notice_id: WxRefundNoticeId,
  options: Option<Options>,
) -> Result<Option<WxRefundNoticeModel>> {
  
  let wx_refund_notice_model = wx_refund_notice_dao::find_by_id_wx_refund_notice(
    wx_refund_notice_id,
    options,
  ).await?;
  
  Ok(wx_refund_notice_model)
}

/// 根据 id 查找微信退款通知, 如果不存在则抛错
pub async fn find_by_id_ok_wx_refund_notice(
  wx_refund_notice_id: WxRefundNoticeId,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  let wx_refund_notice_model = wx_refund_notice_dao::find_by_id_ok_wx_refund_notice(
    wx_refund_notice_id,
    options,
  ).await?;
  
  Ok(wx_refund_notice_model)
}

/// 根据 ids 查找微信退款通知
pub async fn find_by_ids_wx_refund_notice(
  wx_refund_notice_ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let wx_refund_notice_models = wx_refund_notice_dao::find_by_ids_wx_refund_notice(
    wx_refund_notice_ids,
    options,
  ).await?;
  
  Ok(wx_refund_notice_models)
}

/// 根据 ids 查找微信退款通知, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wx_refund_notice(
  wx_refund_notice_ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let wx_refund_notice_models = wx_refund_notice_dao::find_by_ids_ok_wx_refund_notice(
    wx_refund_notice_ids,
    options,
  ).await?;
  
  Ok(wx_refund_notice_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wx_refund_notice(
  wx_refund_notice_input: WxRefundNoticeInput,
) -> Result<WxRefundNoticeInput> {
  
  let wx_refund_notice_input = wx_refund_notice_dao::set_id_by_lbl_wx_refund_notice(
    wx_refund_notice_input,
  ).await?;
  
  Ok(wx_refund_notice_input)
}

/// 创建微信退款通知
#[allow(dead_code)]
pub async fn creates_wx_refund_notice(
  wx_refund_notice_inputs: Vec<WxRefundNoticeInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeId>> {
  
  let wx_refund_notice_ids = wx_refund_notice_dao::creates_wx_refund_notice(
    wx_refund_notice_inputs,
    options,
  ).await?;
  
  Ok(wx_refund_notice_ids)
}

/// 微信退款通知根据 wx_refund_notice_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wx_refund_notice(
  wx_refund_notice_id: WxRefundNoticeId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_refund_notice_dao::update_tenant_by_id_wx_refund_notice(
    wx_refund_notice_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_refund_notice_id 修改微信退款通知
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wx_refund_notice(
  wx_refund_notice_id: WxRefundNoticeId,
  mut wx_refund_notice_input: WxRefundNoticeInput,
  options: Option<Options>,
) -> Result<WxRefundNoticeId> {
  
  let wx_refund_notice_id = wx_refund_notice_dao::update_by_id_wx_refund_notice(
    wx_refund_notice_id,
    wx_refund_notice_input,
    options,
  ).await?;
  
  Ok(wx_refund_notice_id)
}

/// 校验微信退款通知是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_refund_notice(
  wx_refund_notice_model: Option<WxRefundNoticeModel>,
) -> Result<WxRefundNoticeModel> {
  
  let wx_refund_notice_model = wx_refund_notice_dao::validate_option_wx_refund_notice(wx_refund_notice_model).await?;
  
  Ok(wx_refund_notice_model)
}

/// 根据 wx_refund_notice_ids 删除微信退款通知
#[allow(dead_code)]
pub async fn delete_by_ids_wx_refund_notice(
  wx_refund_notice_ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_refund_notice_dao::delete_by_ids_wx_refund_notice(
    wx_refund_notice_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信退款通知字段注释
pub async fn get_field_comments_wx_refund_notice(
  options: Option<Options>,
) -> Result<WxRefundNoticeFieldComment> {
  
  let comments = wx_refund_notice_dao::get_field_comments_wx_refund_notice(
    options,
  ).await?;
  
  Ok(comments)
}
