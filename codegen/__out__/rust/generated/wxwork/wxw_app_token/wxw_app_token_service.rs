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

use super::wxw_app_token_model::*;
use super::wxw_app_token_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxwAppTokenSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找企微应用接口凭据列表
pub async fn find_all_wxw_app_token(
  search: Option<WxwAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_app_token_models = wxw_app_token_dao::find_all_wxw_app_token(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxw_app_token_models)
}

/// 根据条件查找企微应用接口凭据总数
pub async fn find_count_wxw_app_token(
  search: Option<WxwAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_app_token_num = wxw_app_token_dao::find_count_wxw_app_token(
    Some(search),
    options,
  ).await?;
  
  Ok(wxw_app_token_num)
}

/// 根据条件查找第一个企微应用接口凭据
pub async fn find_one_wxw_app_token(
  search: Option<WxwAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_app_token_model = wxw_app_token_dao::find_one_wxw_app_token(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_app_token_model)
}

/// 根据 id 查找企微应用接口凭据
pub async fn find_by_id_wxw_app_token(
  wxw_app_token_id: WxwAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  let wxw_app_token_model = wxw_app_token_dao::find_by_id_wxw_app_token(
    wxw_app_token_id,
    options,
  ).await?;
  
  Ok(wxw_app_token_model)
}

/// 根据 wxw_app_token_ids 查找企微应用接口凭据
pub async fn find_by_ids_wxw_app_token(
  wxw_app_token_ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  let wxw_app_token_models = wxw_app_token_dao::find_by_ids_wxw_app_token(
    wxw_app_token_ids,
    options,
  ).await?;
  
  Ok(wxw_app_token_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wxw_app_token(
  wxw_app_token_input: WxwAppTokenInput,
) -> Result<WxwAppTokenInput> {
  
  let wxw_app_token_input = wxw_app_token_dao::set_id_by_lbl_wxw_app_token(
    wxw_app_token_input,
  ).await?;
  
  Ok(wxw_app_token_input)
}

/// 创建企微应用接口凭据
#[allow(dead_code)]
pub async fn creates_wxw_app_token(
  wxw_app_token_inputs: Vec<WxwAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenId>> {
  
  let wxw_app_token_ids = wxw_app_token_dao::creates_wxw_app_token(
    wxw_app_token_inputs,
    options,
  ).await?;
  
  Ok(wxw_app_token_ids)
}

/// 企微应用接口凭据根据 wxw_app_token_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wxw_app_token(
  wxw_app_token_id: WxwAppTokenId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_token_dao::update_tenant_by_id_wxw_app_token(
    wxw_app_token_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_app_token_id 修改企微应用接口凭据
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wxw_app_token(
  wxw_app_token_id: WxwAppTokenId,
  mut wxw_app_token_input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<WxwAppTokenId> {
  
  let wxw_app_token_id = wxw_app_token_dao::update_by_id_wxw_app_token(
    wxw_app_token_id,
    wxw_app_token_input,
    options.clone(),
  ).await?;
  
  Ok(wxw_app_token_id)
}

/// 校验企微应用接口凭据是否存在
#[allow(dead_code)]
pub async fn validate_option_wxw_app_token(
  wxw_app_token_model: Option<WxwAppTokenModel>,
) -> Result<WxwAppTokenModel> {
  
  let wxw_app_token_model = wxw_app_token_dao::validate_option_wxw_app_token(wxw_app_token_model).await?;
  
  Ok(wxw_app_token_model)
}

/// 根据 wxw_app_token_ids 删除企微应用接口凭据
#[allow(dead_code)]
pub async fn delete_by_ids_wxw_app_token(
  wxw_app_token_ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_token_dao::delete_by_ids_wxw_app_token(
    wxw_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微应用接口凭据字段注释
pub async fn get_field_comments_wxw_app_token(
  options: Option<Options>,
) -> Result<WxwAppTokenFieldComment> {
  
  let comments = wxw_app_token_dao::get_field_comments_wxw_app_token(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wxw_app_token_ids 还原企微应用接口凭据
#[allow(dead_code)]
pub async fn revert_by_ids_wxw_app_token(
  wxw_app_token_ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_token_dao::revert_by_ids_wxw_app_token(
    wxw_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_app_token_ids 彻底删除企微应用接口凭据
#[allow(dead_code)]
pub async fn force_delete_by_ids_wxw_app_token(
  wxw_app_token_ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_app_token_dao::force_delete_by_ids_wxw_app_token(
    wxw_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}
