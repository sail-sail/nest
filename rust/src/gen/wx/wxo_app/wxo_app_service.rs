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

use super::wxo_app_model::*;
use super::wxo_app_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxoAppSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找公众号设置列表
pub async fn find_all_wxo_app(
  search: Option<WxoAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_app_models = wxo_app_dao::find_all_wxo_app(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxo_app_models)
}

/// 根据条件查找公众号设置总数
pub async fn find_count_wxo_app(
  search: Option<WxoAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_app_num = wxo_app_dao::find_count_wxo_app(
    Some(search),
    options,
  ).await?;
  
  Ok(wxo_app_num)
}

/// 根据条件查找第一个公众号设置
pub async fn find_one_wxo_app(
  search: Option<WxoAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_app_model = wxo_app_dao::find_one_wxo_app(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxo_app_model)
}

/// 根据 id 查找公众号设置
pub async fn find_by_id_wxo_app(
  wxo_app_id: WxoAppId,
  options: Option<Options>,
) -> Result<Option<WxoAppModel>> {
  
  let wxo_app_model = wxo_app_dao::find_by_id_wxo_app(
    wxo_app_id,
    options,
  ).await?;
  
  Ok(wxo_app_model)
}

/// 根据 wxo_app_ids 查找公众号设置
pub async fn find_by_ids_wxo_app(
  wxo_app_ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  let wxo_app_models = wxo_app_dao::find_by_ids_wxo_app(
    wxo_app_ids,
    options,
  ).await?;
  
  Ok(wxo_app_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wxo_app(
  wxo_app_input: WxoAppInput,
) -> Result<WxoAppInput> {
  
  let wxo_app_input = wxo_app_dao::set_id_by_lbl_wxo_app(
    wxo_app_input,
  ).await?;
  
  Ok(wxo_app_input)
}

/// 创建公众号设置
#[allow(dead_code)]
pub async fn creates_wxo_app(
  wxo_app_inputs: Vec<WxoAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppId>> {
  
  let wxo_app_ids = wxo_app_dao::creates_wxo_app(
    wxo_app_inputs,
    options,
  ).await?;
  
  Ok(wxo_app_ids)
}

/// 公众号设置根据 wxo_app_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wxo_app(
  wxo_app_id: WxoAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_dao::update_tenant_by_id_wxo_app(
    wxo_app_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxo_app_id 修改公众号设置
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wxo_app(
  wxo_app_id: WxoAppId,
  mut wxo_app_input: WxoAppInput,
  options: Option<Options>,
) -> Result<WxoAppId> {
  
  let is_locked = wxo_app_dao::get_is_locked_by_id_wxo_app(
    wxo_app_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 公众号设置";
    return Err(eyre!(err_msg));
  }
  
  let wxo_app_id = wxo_app_dao::update_by_id_wxo_app(
    wxo_app_id,
    wxo_app_input,
    options.clone(),
  ).await?;
  
  Ok(wxo_app_id)
}

/// 校验公众号设置是否存在
#[allow(dead_code)]
pub async fn validate_option_wxo_app(
  wxo_app_model: Option<WxoAppModel>,
) -> Result<WxoAppModel> {
  
  let wxo_app_model = wxo_app_dao::validate_option_wxo_app(wxo_app_model).await?;
  
  Ok(wxo_app_model)
}

/// 根据 wxo_app_ids 删除公众号设置
#[allow(dead_code)]
pub async fn delete_by_ids_wxo_app(
  wxo_app_ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = wxo_app_dao::find_all_wxo_app(
    Some(WxoAppSearch {
      ids: Some(wxo_app_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 公众号设置";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = wxo_app_dao::delete_by_ids_wxo_app(
    wxo_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxo_app_id 查找公众号设置是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_wxo_app(
  wxo_app_id: WxoAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = wxo_app_dao::get_is_enabled_by_id_wxo_app(
    wxo_app_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 wxo_app_ids 启用或者禁用公众号设置
#[allow(dead_code)]
pub async fn enable_by_ids_wxo_app(
  wxo_app_ids: Vec<WxoAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_dao::enable_by_ids_wxo_app(
    wxo_app_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxo_app_id 查找公众号设置是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_wxo_app(
  wxo_app_id: WxoAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = wxo_app_dao::get_is_locked_by_id_wxo_app(
    wxo_app_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 wxo_app_ids 锁定或者解锁公众号设置
#[allow(dead_code)]
pub async fn lock_by_ids_wxo_app(
  wxo_app_ids: Vec<WxoAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_dao::lock_by_ids_wxo_app(
    wxo_app_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取公众号设置字段注释
pub async fn get_field_comments_wxo_app(
  options: Option<Options>,
) -> Result<WxoAppFieldComment> {
  
  let comments = wxo_app_dao::get_field_comments_wxo_app(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wxo_app_ids 还原公众号设置
#[allow(dead_code)]
pub async fn revert_by_ids_wxo_app(
  wxo_app_ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_dao::revert_by_ids_wxo_app(
    wxo_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxo_app_ids 彻底删除公众号设置
#[allow(dead_code)]
pub async fn force_delete_by_ids_wxo_app(
  wxo_app_ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_dao::force_delete_by_ids_wxo_app(
    wxo_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 公众号设置 order_by 字段的最大值
pub async fn find_last_order_by_wxo_app(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = wxo_app_dao::find_last_order_by_wxo_app(
    options,
  ).await?;
  
  Ok(res)
}
