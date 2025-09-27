
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

use super::wxw_app_model::*;
use super::wxw_app_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxwAppSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找企微应用列表
pub async fn find_all_wxw_app(
  search: Option<WxwAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_app_models = wxw_app_dao::find_all_wxw_app(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxw_app_models)
}

/// 根据条件查找企微应用总数
pub async fn find_count_wxw_app(
  search: Option<WxwAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_app_num = wxw_app_dao::find_count_wxw_app(
    Some(search),
    options,
  ).await?;
  
  Ok(wxw_app_num)
}

/// 根据条件查找第一个企微应用
pub async fn find_one_wxw_app(
  search: Option<WxwAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_app_model = wxw_app_dao::find_one_wxw_app(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_app_model)
}

/// 根据条件查找第一个企微应用, 如果不存在则抛错
pub async fn find_one_ok_wxw_app(
  search: Option<WxwAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxwAppModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_app_model = wxw_app_dao::find_one_ok_wxw_app(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_app_model)
}

/// 根据 id 查找企微应用
pub async fn find_by_id_wxw_app(
  wxw_app_id: WxwAppId,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
  let wxw_app_model = wxw_app_dao::find_by_id_wxw_app(
    wxw_app_id,
    options,
  ).await?;
  
  Ok(wxw_app_model)
}

/// 根据 id 查找企微应用, 如果不存在则抛错
pub async fn find_by_id_ok_wxw_app(
  wxw_app_id: WxwAppId,
  options: Option<Options>,
) -> Result<WxwAppModel> {
  
  let wxw_app_model = wxw_app_dao::find_by_id_ok_wxw_app(
    wxw_app_id,
    options,
  ).await?;
  
  Ok(wxw_app_model)
}

/// 根据 ids 查找企微应用
pub async fn find_by_ids_wxw_app(
  wxw_app_ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<Vec<WxwAppModel>> {
  
  let wxw_app_models = wxw_app_dao::find_by_ids_wxw_app(
    wxw_app_ids,
    options,
  ).await?;
  
  Ok(wxw_app_models)
}

/// 根据 ids 查找企微应用, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wxw_app(
  wxw_app_ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<Vec<WxwAppModel>> {
  
  let wxw_app_models = wxw_app_dao::find_by_ids_ok_wxw_app(
    wxw_app_ids,
    options,
  ).await?;
  
  Ok(wxw_app_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wxw_app(
  wxw_app_input: WxwAppInput,
) -> Result<WxwAppInput> {
  
  let wxw_app_input = wxw_app_dao::set_id_by_lbl_wxw_app(
    wxw_app_input,
  ).await?;
  
  Ok(wxw_app_input)
}

/// 创建企微应用
#[allow(dead_code)]
pub async fn creates_wxw_app(
  wxw_app_inputs: Vec<WxwAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppId>> {
  
  let wxw_app_ids = wxw_app_dao::creates_wxw_app(
    wxw_app_inputs,
    options,
  ).await?;
  
  Ok(wxw_app_ids)
}

/// 企微应用根据 wxw_app_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wxw_app(
  wxw_app_id: WxwAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::update_tenant_by_id_wxw_app(
    wxw_app_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_app_id 修改企微应用
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wxw_app(
  wxw_app_id: WxwAppId,
  mut wxw_app_input: WxwAppInput,
  options: Option<Options>,
) -> Result<WxwAppId> {
  
  let is_locked = wxw_app_dao::get_is_locked_by_id_wxw_app(
    wxw_app_id,
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 企微应用";
    return Err(eyre!(err_msg));
  }
  
  let wxw_app_id = wxw_app_dao::update_by_id_wxw_app(
    wxw_app_id,
    wxw_app_input,
    options.clone(),
  ).await?;
  
  Ok(wxw_app_id)
}

/// 校验企微应用是否存在
#[allow(dead_code)]
pub async fn validate_option_wxw_app(
  wxw_app_model: Option<WxwAppModel>,
) -> Result<WxwAppModel> {
  
  let wxw_app_model = wxw_app_dao::validate_option_wxw_app(wxw_app_model).await?;
  
  Ok(wxw_app_model)
}

/// 根据 wxw_app_ids 删除企微应用
#[allow(dead_code)]
pub async fn delete_by_ids_wxw_app(
  wxw_app_ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = wxw_app_dao::find_all_wxw_app(
    Some(WxwAppSearch {
      ids: Some(wxw_app_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 企微应用";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = wxw_app_dao::delete_by_ids_wxw_app(
    wxw_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_app_id 查找企微应用是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_wxw_app(
  wxw_app_id: WxwAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = wxw_app_dao::get_is_enabled_by_id_wxw_app(
    wxw_app_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 wxw_app_ids 启用或者禁用企微应用
#[allow(dead_code)]
pub async fn enable_by_ids_wxw_app(
  wxw_app_ids: Vec<WxwAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::enable_by_ids_wxw_app(
    wxw_app_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_app_id 查找企微应用是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_wxw_app(
  wxw_app_id: WxwAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = wxw_app_dao::get_is_locked_by_id_wxw_app(
    wxw_app_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 wxw_app_ids 锁定或者解锁企微应用
#[allow(dead_code)]
pub async fn lock_by_ids_wxw_app(
  wxw_app_ids: Vec<WxwAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::lock_by_ids_wxw_app(
    wxw_app_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微应用字段注释
pub async fn get_field_comments_wxw_app(
  options: Option<Options>,
) -> Result<WxwAppFieldComment> {
  
  let comments = wxw_app_dao::get_field_comments_wxw_app(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wxw_app_ids 还原企微应用
#[allow(dead_code)]
pub async fn revert_by_ids_wxw_app(
  wxw_app_ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::revert_by_ids_wxw_app(
    wxw_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_app_ids 彻底删除企微应用
#[allow(dead_code)]
pub async fn force_delete_by_ids_wxw_app(
  wxw_app_ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::force_delete_by_ids_wxw_app(
    wxw_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 企微应用 order_by 字段的最大值
pub async fn find_last_order_by_wxw_app(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = wxw_app_dao::find_last_order_by_wxw_app(
    options,
  ).await?;
  
  Ok(res)
}
