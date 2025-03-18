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

use super::wx_pay_model::*;
use super::wx_pay_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxPaySearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找微信支付设置列表
pub async fn find_all(
  search: Option<WxPaySearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxPayModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_pay_models = wx_pay_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wx_pay_models)
}

/// 根据条件查找微信支付设置总数
pub async fn find_count(
  search: Option<WxPaySearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_pay_num = wx_pay_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(wx_pay_num)
}

/// 根据条件查找第一个微信支付设置
pub async fn find_one(
  search: Option<WxPaySearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxPayModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_pay_model = wx_pay_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_pay_model)
}

/// 根据 id 查找微信支付设置
pub async fn find_by_id(
  wx_pay_id: WxPayId,
  options: Option<Options>,
) -> Result<Option<WxPayModel>> {
  
  let wx_pay_model = wx_pay_dao::find_by_id(
    wx_pay_id,
    options,
  ).await?;
  
  Ok(wx_pay_model)
}

/// 根据 wx_pay_ids 查找微信支付设置
pub async fn find_by_ids(
  wx_pay_ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<Vec<WxPayModel>> {
  
  let wx_pay_models = wx_pay_dao::find_by_ids(
    wx_pay_ids,
    options,
  ).await?;
  
  Ok(wx_pay_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  wx_pay_input: WxPayInput,
) -> Result<WxPayInput> {
  
  let wx_pay_input = wx_pay_dao::set_id_by_lbl(
    wx_pay_input,
  ).await?;
  
  Ok(wx_pay_input)
}

/// 创建微信支付设置
#[allow(dead_code)]
pub async fn creates(
  wx_pay_inputs: Vec<WxPayInput>,
  options: Option<Options>,
) -> Result<Vec<WxPayId>> {
  
  let wx_pay_ids = wx_pay_dao::creates(
    wx_pay_inputs,
    options,
  ).await?;
  
  Ok(wx_pay_ids)
}

/// 微信支付设置根据 wx_pay_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  wx_pay_id: WxPayId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_dao::update_tenant_by_id(
    wx_pay_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_pay_id 修改微信支付设置
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  wx_pay_id: WxPayId,
  mut wx_pay_input: WxPayInput,
  options: Option<Options>,
) -> Result<WxPayId> {
  
  let is_locked = wx_pay_dao::get_is_locked_by_id(
    wx_pay_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 微信支付设置";
    return Err(eyre!(err_msg));
  }
  
  let wx_pay_id = wx_pay_dao::update_by_id(
    wx_pay_id,
    wx_pay_input,
    options.clone(),
  ).await?;
  
  Ok(wx_pay_id)
}

/// 校验微信支付设置是否存在
#[allow(dead_code)]
pub async fn validate_option(
  wx_pay_model: Option<WxPayModel>,
) -> Result<WxPayModel> {
  
  let wx_pay_model = wx_pay_dao::validate_option(wx_pay_model).await?;
  
  Ok(wx_pay_model)
}

/// 根据 wx_pay_ids 删除微信支付设置
#[allow(dead_code)]
pub async fn delete_by_ids(
  wx_pay_ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = wx_pay_dao::find_all(
    Some(WxPaySearch {
      ids: Some(wx_pay_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 微信支付设置";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = wx_pay_dao::delete_by_ids(
    wx_pay_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_pay_id 查找微信支付设置是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  wx_pay_id: WxPayId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = wx_pay_dao::get_is_enabled_by_id(
    wx_pay_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 wx_pay_ids 启用或者禁用微信支付设置
#[allow(dead_code)]
pub async fn enable_by_ids(
  wx_pay_ids: Vec<WxPayId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_dao::enable_by_ids(
    wx_pay_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_pay_id 查找微信支付设置是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  wx_pay_id: WxPayId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = wx_pay_dao::get_is_locked_by_id(
    wx_pay_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 wx_pay_ids 锁定或者解锁微信支付设置
#[allow(dead_code)]
pub async fn lock_by_ids(
  wx_pay_ids: Vec<WxPayId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_dao::lock_by_ids(
    wx_pay_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信支付设置字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxPayFieldComment> {
  
  let comments = wx_pay_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wx_pay_ids 还原微信支付设置
#[allow(dead_code)]
pub async fn revert_by_ids(
  wx_pay_ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_dao::revert_by_ids(
    wx_pay_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_pay_ids 彻底删除微信支付设置
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  wx_pay_ids: Vec<WxPayId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_pay_dao::force_delete_by_ids(
    wx_pay_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 微信支付设置 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = wx_pay_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
