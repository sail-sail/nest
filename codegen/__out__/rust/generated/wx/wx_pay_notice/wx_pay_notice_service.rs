
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

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::wx_pay_notice_model::*;
use super::wx_pay_notice_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxPayNoticeSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找微信支付通知列表
pub async fn find_all_wx_pay_notice(
  search: Option<WxPayNoticeSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxPayNoticeModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_pay_notice_models = wx_pay_notice_dao::find_all_wx_pay_notice(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wx_pay_notice_models)
}

/// 根据条件查找微信支付通知总数
pub async fn find_count_wx_pay_notice(
  search: Option<WxPayNoticeSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_pay_notice_num = wx_pay_notice_dao::find_count_wx_pay_notice(
    Some(search),
    options,
  ).await?;
  
  Ok(wx_pay_notice_num)
}

/// 根据条件查找第一个微信支付通知
pub async fn find_one_wx_pay_notice(
  search: Option<WxPayNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxPayNoticeModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_pay_notice_model = wx_pay_notice_dao::find_one_wx_pay_notice(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_pay_notice_model)
}

/// 根据条件查找第一个微信支付通知, 如果不存在则抛错
pub async fn find_one_ok_wx_pay_notice(
  search: Option<WxPayNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxPayNoticeModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_pay_notice_model = wx_pay_notice_dao::find_one_ok_wx_pay_notice(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_pay_notice_model)
}

/// 根据 id 查找微信支付通知
pub async fn find_by_id_wx_pay_notice(
  wx_pay_notice_id: WxPayNoticeId,
  options: Option<Options>,
) -> Result<Option<WxPayNoticeModel>> {
  
  let wx_pay_notice_model = wx_pay_notice_dao::find_by_id_wx_pay_notice(
    wx_pay_notice_id,
    options,
  ).await?;
  
  Ok(wx_pay_notice_model)
}

/// 根据 id 查找微信支付通知, 如果不存在则抛错
pub async fn find_by_id_ok_wx_pay_notice(
  wx_pay_notice_id: WxPayNoticeId,
  options: Option<Options>,
) -> Result<WxPayNoticeModel> {
  
  let wx_pay_notice_model = wx_pay_notice_dao::find_by_id_ok_wx_pay_notice(
    wx_pay_notice_id,
    options,
  ).await?;
  
  Ok(wx_pay_notice_model)
}

/// 根据 ids 查找微信支付通知
pub async fn find_by_ids_wx_pay_notice(
  wx_pay_notice_ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxPayNoticeModel>> {
  
  let wx_pay_notice_models = wx_pay_notice_dao::find_by_ids_wx_pay_notice(
    wx_pay_notice_ids,
    options,
  ).await?;
  
  Ok(wx_pay_notice_models)
}

/// 根据 ids 查找微信支付通知, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wx_pay_notice(
  wx_pay_notice_ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxPayNoticeModel>> {
  
  let wx_pay_notice_models = wx_pay_notice_dao::find_by_ids_ok_wx_pay_notice(
    wx_pay_notice_ids,
    options,
  ).await?;
  
  Ok(wx_pay_notice_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wx_pay_notice(
  wx_pay_notice_input: WxPayNoticeInput,
) -> Result<WxPayNoticeInput> {
  
  let wx_pay_notice_input = wx_pay_notice_dao::set_id_by_lbl_wx_pay_notice(
    wx_pay_notice_input,
  ).await?;
  
  Ok(wx_pay_notice_input)
}

/// 创建微信支付通知
#[allow(dead_code)]
pub async fn creates_wx_pay_notice(
  wx_pay_notice_inputs: Vec<WxPayNoticeInput>,
  options: Option<Options>,
) -> Result<Vec<WxPayNoticeId>> {
  
  let wx_pay_notice_ids = wx_pay_notice_dao::creates_wx_pay_notice(
    wx_pay_notice_inputs,
    options,
  ).await?;
  
  Ok(wx_pay_notice_ids)
}

/// 微信支付通知根据 wx_pay_notice_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wx_pay_notice(
  wx_pay_notice_id: WxPayNoticeId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_notice_dao::update_tenant_by_id_wx_pay_notice(
    wx_pay_notice_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_pay_notice_id 修改微信支付通知
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wx_pay_notice(
  wx_pay_notice_id: WxPayNoticeId,
  mut wx_pay_notice_input: WxPayNoticeInput,
  options: Option<Options>,
) -> Result<WxPayNoticeId> {
  
  let wx_pay_notice_id = wx_pay_notice_dao::update_by_id_wx_pay_notice(
    wx_pay_notice_id,
    wx_pay_notice_input,
    options.clone(),
  ).await?;
  
  Ok(wx_pay_notice_id)
}

/// 校验微信支付通知是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_pay_notice(
  wx_pay_notice_model: Option<WxPayNoticeModel>,
) -> Result<WxPayNoticeModel> {
  
  let wx_pay_notice_model = wx_pay_notice_dao::validate_option_wx_pay_notice(wx_pay_notice_model).await?;
  
  Ok(wx_pay_notice_model)
}

/// 根据 wx_pay_notice_ids 删除微信支付通知
#[allow(dead_code)]
pub async fn delete_by_ids_wx_pay_notice(
  wx_pay_notice_ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_notice_dao::delete_by_ids_wx_pay_notice(
    wx_pay_notice_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信支付通知字段注释
pub async fn get_field_comments_wx_pay_notice(
  options: Option<Options>,
) -> Result<WxPayNoticeFieldComment> {
  
  let comments = wx_pay_notice_dao::get_field_comments_wx_pay_notice(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wx_pay_notice_ids 还原微信支付通知
#[allow(dead_code)]
pub async fn revert_by_ids_wx_pay_notice(
  wx_pay_notice_ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_notice_dao::revert_by_ids_wx_pay_notice(
    wx_pay_notice_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_pay_notice_ids 彻底删除微信支付通知
#[allow(dead_code)]
pub async fn force_delete_by_ids_wx_pay_notice(
  wx_pay_notice_ids: Vec<WxPayNoticeId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_notice_dao::force_delete_by_ids_wx_pay_notice(
    wx_pay_notice_ids,
    options,
  ).await?;
  
  Ok(num)
}
