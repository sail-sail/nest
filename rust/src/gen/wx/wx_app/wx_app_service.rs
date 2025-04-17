#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::wx_app_model::*;
use super::wx_app_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxAppSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找小程序设置列表
pub async fn find_all_wx_app(
  search: Option<WxAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_app_models = wx_app_dao::find_all_wx_app(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wx_app_models)
}

/// 根据条件查找小程序设置总数
pub async fn find_count_wx_app(
  search: Option<WxAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_app_num = wx_app_dao::find_count_wx_app(
    Some(search),
    options,
  ).await?;
  
  Ok(wx_app_num)
}

/// 根据条件查找第一个小程序设置
pub async fn find_one_wx_app(
  search: Option<WxAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_app_model = wx_app_dao::find_one_wx_app(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_app_model)
}

/// 根据 id 查找小程序设置
pub async fn find_by_id_wx_app(
  wx_app_id: WxAppId,
  options: Option<Options>,
) -> Result<Option<WxAppModel>> {
  
  let wx_app_model = wx_app_dao::find_by_id_wx_app(
    wx_app_id,
    options,
  ).await?;
  
  Ok(wx_app_model)
}

/// 根据 wx_app_ids 查找小程序设置
pub async fn find_by_ids_wx_app(
  wx_app_ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<Vec<WxAppModel>> {
  
  let wx_app_models = wx_app_dao::find_by_ids_wx_app(
    wx_app_ids,
    options,
  ).await?;
  
  Ok(wx_app_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wx_app(
  wx_app_input: WxAppInput,
) -> Result<WxAppInput> {
  
  let wx_app_input = wx_app_dao::set_id_by_lbl_wx_app(
    wx_app_input,
  ).await?;
  
  Ok(wx_app_input)
}

/// 创建小程序设置
#[allow(dead_code)]
pub async fn creates_wx_app(
  wx_app_inputs: Vec<WxAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxAppId>> {
  
  let wx_app_ids = wx_app_dao::creates_wx_app(
    wx_app_inputs,
    options,
  ).await?;
  
  Ok(wx_app_ids)
}

/// 小程序设置根据 wx_app_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wx_app(
  wx_app_id: WxAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_dao::update_tenant_by_id_wx_app(
    wx_app_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_app_id 修改小程序设置
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wx_app(
  wx_app_id: WxAppId,
  mut wx_app_input: WxAppInput,
  options: Option<Options>,
) -> Result<WxAppId> {
  
  let is_locked = wx_app_dao::get_is_locked_by_id_wx_app(
    wx_app_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 小程序设置";
    return Err(eyre!(err_msg));
  }
  
  let wx_app_id = wx_app_dao::update_by_id_wx_app(
    wx_app_id,
    wx_app_input,
    options.clone(),
  ).await?;
  
  Ok(wx_app_id)
}

/// 校验小程序设置是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_app(
  wx_app_model: Option<WxAppModel>,
) -> Result<WxAppModel> {
  
  let wx_app_model = wx_app_dao::validate_option_wx_app(wx_app_model).await?;
  
  Ok(wx_app_model)
}

/// 根据 wx_app_ids 删除小程序设置
#[allow(dead_code)]
pub async fn delete_by_ids_wx_app(
  wx_app_ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = wx_app_dao::find_all_wx_app(
    Some(WxAppSearch {
      ids: Some(wx_app_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 小程序设置";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = wx_app_dao::delete_by_ids_wx_app(
    wx_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_app_id 查找小程序设置是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_wx_app(
  wx_app_id: WxAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = wx_app_dao::get_is_enabled_by_id_wx_app(
    wx_app_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 wx_app_ids 启用或者禁用小程序设置
#[allow(dead_code)]
pub async fn enable_by_ids_wx_app(
  wx_app_ids: Vec<WxAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_dao::enable_by_ids_wx_app(
    wx_app_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_app_id 查找小程序设置是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_wx_app(
  wx_app_id: WxAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = wx_app_dao::get_is_locked_by_id_wx_app(
    wx_app_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 wx_app_ids 锁定或者解锁小程序设置
#[allow(dead_code)]
pub async fn lock_by_ids_wx_app(
  wx_app_ids: Vec<WxAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_dao::lock_by_ids_wx_app(
    wx_app_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取小程序设置字段注释
pub async fn get_field_comments_wx_app(
  options: Option<Options>,
) -> Result<WxAppFieldComment> {
  
  let comments = wx_app_dao::get_field_comments_wx_app(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wx_app_ids 还原小程序设置
#[allow(dead_code)]
pub async fn revert_by_ids_wx_app(
  wx_app_ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_dao::revert_by_ids_wx_app(
    wx_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_app_ids 彻底删除小程序设置
#[allow(dead_code)]
pub async fn force_delete_by_ids_wx_app(
  wx_app_ids: Vec<WxAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_dao::force_delete_by_ids_wx_app(
    wx_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 小程序设置 order_by 字段的最大值
pub async fn find_last_order_by_wx_app(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = wx_app_dao::find_last_order_by_wx_app(
    options,
  ).await?;
  
  Ok(res)
}
