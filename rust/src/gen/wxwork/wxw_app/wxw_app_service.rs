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

use super::wxw_app_model::*;
use super::wxw_app_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxwAppSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找企微应用列表
pub async fn find_all(
  search: Option<WxwAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = wxw_app_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找企微应用总数
pub async fn find_count(
  search: Option<WxwAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = wxw_app_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个企微应用
pub async fn find_one(
  search: Option<WxwAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = wxw_app_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微应用
pub async fn find_by_id(
  id: WxwAppId,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
  let model = wxw_app_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: WxwAppInput,
) -> Result<WxwAppInput> {
  
  let input = wxw_app_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建企微应用
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<WxwAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppId>> {
  
  let wxw_app_ids = wxw_app_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(wxw_app_ids)
}

/// 企微应用根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: WxwAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改企微应用
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: WxwAppId,
  mut input: WxwAppInput,
  options: Option<Options>,
) -> Result<WxwAppId> {
  
  let is_locked = wxw_app_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 企微应用";
    return Err(eyre!(err_msg));
  }
  
  let wxw_app_id = wxw_app_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(wxw_app_id)
}

/// 根据 ids 删除企微应用
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = wxw_app_dao::find_all(
    Some(WxwAppSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 企微应用";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = wxw_app_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找企微应用是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: WxwAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = wxw_app_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用企微应用
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<WxwAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找企微应用是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: WxwAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = wxw_app_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁企微应用
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<WxwAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微应用字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwAppFieldComment> {
  
  let comments = wxw_app_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原企微应用
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除企微应用
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<WxwAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 企微应用 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = wxw_app_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
