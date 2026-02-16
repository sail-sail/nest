
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

use super::wx_refund_model::*;
use super::wx_refund_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxRefundSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找微信退款申请列表
pub async fn find_all_wx_refund(
  search: Option<WxRefundSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_models = wx_refund_dao::find_all_wx_refund(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wx_refund_models)
}

/// 根据条件查找微信退款申请总数
pub async fn find_count_wx_refund(
  search: Option<WxRefundSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_num = wx_refund_dao::find_count_wx_refund(
    Some(search),
    options,
  ).await?;
  
  Ok(wx_refund_num)
}

/// 根据条件查找第一个微信退款申请
pub async fn find_one_wx_refund(
  search: Option<WxRefundSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxRefundModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_model = wx_refund_dao::find_one_wx_refund(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_refund_model)
}

/// 根据条件查找第一个微信退款申请, 如果不存在则抛错
pub async fn find_one_ok_wx_refund(
  search: Option<WxRefundSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wx_refund_model = wx_refund_dao::find_one_ok_wx_refund(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_refund_model)
}

/// 根据 id 查找微信退款申请
pub async fn find_by_id_wx_refund(
  wx_refund_id: WxRefundId,
  options: Option<Options>,
) -> Result<Option<WxRefundModel>> {
  
  let wx_refund_model = wx_refund_dao::find_by_id_wx_refund(
    wx_refund_id,
    options,
  ).await?;
  
  Ok(wx_refund_model)
}

/// 根据 id 查找微信退款申请, 如果不存在则抛错
pub async fn find_by_id_ok_wx_refund(
  wx_refund_id: WxRefundId,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  let wx_refund_model = wx_refund_dao::find_by_id_ok_wx_refund(
    wx_refund_id,
    options,
  ).await?;
  
  Ok(wx_refund_model)
}

/// 根据 ids 查找微信退款申请
pub async fn find_by_ids_wx_refund(
  wx_refund_ids: Vec<WxRefundId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let wx_refund_models = wx_refund_dao::find_by_ids_wx_refund(
    wx_refund_ids,
    options,
  ).await?;
  
  Ok(wx_refund_models)
}

/// 根据 ids 查找微信退款申请, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wx_refund(
  wx_refund_ids: Vec<WxRefundId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let wx_refund_models = wx_refund_dao::find_by_ids_ok_wx_refund(
    wx_refund_ids,
    options,
  ).await?;
  
  Ok(wx_refund_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wx_refund(
  wx_refund_input: WxRefundInput,
) -> Result<WxRefundInput> {
  
  let wx_refund_input = wx_refund_dao::set_id_by_lbl_wx_refund(
    wx_refund_input,
  ).await?;
  
  Ok(wx_refund_input)
}

/// 创建微信退款申请
#[allow(dead_code)]
pub async fn creates_wx_refund(
  wx_refund_inputs: Vec<WxRefundInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundId>> {
  
  let wx_refund_ids = wx_refund_dao::creates_wx_refund(
    wx_refund_inputs,
    options,
  ).await?;
  
  Ok(wx_refund_ids)
}

/// 微信退款申请根据 wx_refund_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wx_refund(
  wx_refund_id: WxRefundId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_refund_dao::update_tenant_by_id_wx_refund(
    wx_refund_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_refund_id 修改微信退款申请
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wx_refund(
  wx_refund_id: WxRefundId,
  mut wx_refund_input: WxRefundInput,
  options: Option<Options>,
) -> Result<WxRefundId> {
  
  let wx_refund_id = wx_refund_dao::update_by_id_wx_refund(
    wx_refund_id,
    wx_refund_input,
    options,
  ).await?;
  
  Ok(wx_refund_id)
}

/// 校验微信退款申请是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_refund(
  wx_refund_model: Option<WxRefundModel>,
) -> Result<WxRefundModel> {
  
  let wx_refund_model = wx_refund_dao::validate_option_wx_refund(wx_refund_model).await?;
  
  Ok(wx_refund_model)
}

/// 根据 wx_refund_ids 删除微信退款申请
#[allow(dead_code)]
pub async fn delete_by_ids_wx_refund(
  wx_refund_ids: Vec<WxRefundId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_refund_dao::delete_by_ids_wx_refund(
    wx_refund_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信退款申请字段注释
pub async fn get_field_comments_wx_refund(
  options: Option<Options>,
) -> Result<WxRefundFieldComment> {
  
  let comments = wx_refund_dao::get_field_comments_wx_refund(
    options,
  ).await?;
  
  Ok(comments)
}
