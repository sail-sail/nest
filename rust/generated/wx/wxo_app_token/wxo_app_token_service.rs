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

use super::wxo_app_token_model::*;
use super::wxo_app_token_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxoAppTokenSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找小程序接口凭据列表
pub async fn find_all_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_app_token_models = wxo_app_token_dao::find_all_wxo_app_token(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxo_app_token_models)
}

/// 根据条件查找小程序接口凭据总数
pub async fn find_count_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_app_token_num = wxo_app_token_dao::find_count_wxo_app_token(
    Some(search),
    options,
  ).await?;
  
  Ok(wxo_app_token_num)
}

/// 根据条件查找第一个小程序接口凭据
pub async fn find_one_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoAppTokenModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_app_token_model = wxo_app_token_dao::find_one_wxo_app_token(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxo_app_token_model)
}

/// 根据条件查找第一个小程序接口凭据, 如果不存在则抛错
pub async fn find_one_ok_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxoAppTokenModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_app_token_model = wxo_app_token_dao::find_one_ok_wxo_app_token(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxo_app_token_model)
}

/// 根据 id 查找小程序接口凭据
pub async fn find_by_id_wxo_app_token(
  wxo_app_token_id: WxoAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxoAppTokenModel>> {
  
  let wxo_app_token_model = wxo_app_token_dao::find_by_id_wxo_app_token(
    wxo_app_token_id,
    options,
  ).await?;
  
  Ok(wxo_app_token_model)
}

/// 根据 id 查找小程序接口凭据, 如果不存在则抛错
pub async fn find_by_id_ok_wxo_app_token(
  wxo_app_token_id: WxoAppTokenId,
  options: Option<Options>,
) -> Result<WxoAppTokenModel> {
  
  let wxo_app_token_model = wxo_app_token_dao::find_by_id_ok_wxo_app_token(
    wxo_app_token_id,
    options,
  ).await?;
  
  Ok(wxo_app_token_model)
}

/// 根据 ids 查找小程序接口凭据
pub async fn find_by_ids_wxo_app_token(
  wxo_app_token_ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  let wxo_app_token_models = wxo_app_token_dao::find_by_ids_wxo_app_token(
    wxo_app_token_ids,
    options,
  ).await?;
  
  Ok(wxo_app_token_models)
}

/// 根据 ids 查找小程序接口凭据, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wxo_app_token(
  wxo_app_token_ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  let wxo_app_token_models = wxo_app_token_dao::find_by_ids_ok_wxo_app_token(
    wxo_app_token_ids,
    options,
  ).await?;
  
  Ok(wxo_app_token_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wxo_app_token(
  wxo_app_token_input: WxoAppTokenInput,
) -> Result<WxoAppTokenInput> {
  
  let wxo_app_token_input = wxo_app_token_dao::set_id_by_lbl_wxo_app_token(
    wxo_app_token_input,
  ).await?;
  
  Ok(wxo_app_token_input)
}

/// 创建小程序接口凭据
#[allow(dead_code)]
pub async fn creates_wxo_app_token(
  wxo_app_token_inputs: Vec<WxoAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenId>> {
  
  let wxo_app_token_ids = wxo_app_token_dao::creates_wxo_app_token(
    wxo_app_token_inputs,
    options,
  ).await?;
  
  Ok(wxo_app_token_ids)
}

/// 根据 wxo_app_token_id 修改小程序接口凭据
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wxo_app_token(
  wxo_app_token_id: WxoAppTokenId,
  mut wxo_app_token_input: WxoAppTokenInput,
  options: Option<Options>,
) -> Result<WxoAppTokenId> {
  
  let wxo_app_token_id = wxo_app_token_dao::update_by_id_wxo_app_token(
    wxo_app_token_id,
    wxo_app_token_input,
    options.clone(),
  ).await?;
  
  Ok(wxo_app_token_id)
}

/// 校验小程序接口凭据是否存在
#[allow(dead_code)]
pub async fn validate_option_wxo_app_token(
  wxo_app_token_model: Option<WxoAppTokenModel>,
) -> Result<WxoAppTokenModel> {
  
  let wxo_app_token_model = wxo_app_token_dao::validate_option_wxo_app_token(wxo_app_token_model).await?;
  
  Ok(wxo_app_token_model)
}

/// 根据 wxo_app_token_ids 删除小程序接口凭据
#[allow(dead_code)]
pub async fn delete_by_ids_wxo_app_token(
  wxo_app_token_ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_token_dao::delete_by_ids_wxo_app_token(
    wxo_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取小程序接口凭据字段注释
pub async fn get_field_comments_wxo_app_token(
  options: Option<Options>,
) -> Result<WxoAppTokenFieldComment> {
  
  let comments = wxo_app_token_dao::get_field_comments_wxo_app_token(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wxo_app_token_ids 还原小程序接口凭据
#[allow(dead_code)]
pub async fn revert_by_ids_wxo_app_token(
  wxo_app_token_ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_token_dao::revert_by_ids_wxo_app_token(
    wxo_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxo_app_token_ids 彻底删除小程序接口凭据
#[allow(dead_code)]
pub async fn force_delete_by_ids_wxo_app_token(
  wxo_app_token_ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_app_token_dao::force_delete_by_ids_wxo_app_token(
    wxo_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}
