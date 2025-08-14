
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

use super::wx_app_token_model::*;
use super::wx_app_token_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxAppTokenSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找小程序接口凭据列表
pub async fn find_all_wx_app_token(
  search: Option<WxAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxAppTokenModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_app_token_models = wx_app_token_dao::find_all_wx_app_token(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wx_app_token_models)
}

/// 根据条件查找小程序接口凭据总数
pub async fn find_count_wx_app_token(
  search: Option<WxAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_app_token_num = wx_app_token_dao::find_count_wx_app_token(
    Some(search),
    options,
  ).await?;
  
  Ok(wx_app_token_num)
}

/// 根据条件查找第一个小程序接口凭据
pub async fn find_one_wx_app_token(
  search: Option<WxAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxAppTokenModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_app_token_model = wx_app_token_dao::find_one_wx_app_token(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_app_token_model)
}

/// 根据条件查找第一个小程序接口凭据, 如果不存在则抛错
pub async fn find_one_ok_wx_app_token(
  search: Option<WxAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxAppTokenModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_app_token_model = wx_app_token_dao::find_one_ok_wx_app_token(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_app_token_model)
}

/// 根据 id 查找小程序接口凭据
pub async fn find_by_id_wx_app_token(
  wx_app_token_id: WxAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxAppTokenModel>> {
  
  let wx_app_token_model = wx_app_token_dao::find_by_id_wx_app_token(
    wx_app_token_id,
    options,
  ).await?;
  
  Ok(wx_app_token_model)
}

/// 根据 id 查找小程序接口凭据, 如果不存在则抛错
pub async fn find_by_id_ok_wx_app_token(
  wx_app_token_id: WxAppTokenId,
  options: Option<Options>,
) -> Result<WxAppTokenModel> {
  
  let wx_app_token_model = wx_app_token_dao::find_by_id_ok_wx_app_token(
    wx_app_token_id,
    options,
  ).await?;
  
  Ok(wx_app_token_model)
}

/// 根据 ids 查找小程序接口凭据
pub async fn find_by_ids_wx_app_token(
  wx_app_token_ids: Vec<WxAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxAppTokenModel>> {
  
  let wx_app_token_models = wx_app_token_dao::find_by_ids_wx_app_token(
    wx_app_token_ids,
    options,
  ).await?;
  
  Ok(wx_app_token_models)
}

/// 根据 ids 查找小程序接口凭据, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wx_app_token(
  wx_app_token_ids: Vec<WxAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxAppTokenModel>> {
  
  let wx_app_token_models = wx_app_token_dao::find_by_ids_ok_wx_app_token(
    wx_app_token_ids,
    options,
  ).await?;
  
  Ok(wx_app_token_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wx_app_token(
  wx_app_token_input: WxAppTokenInput,
) -> Result<WxAppTokenInput> {
  
  let wx_app_token_input = wx_app_token_dao::set_id_by_lbl_wx_app_token(
    wx_app_token_input,
  ).await?;
  
  Ok(wx_app_token_input)
}

/// 创建小程序接口凭据
#[allow(dead_code)]
pub async fn creates_wx_app_token(
  wx_app_token_inputs: Vec<WxAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxAppTokenId>> {
  
  let wx_app_token_ids = wx_app_token_dao::creates_wx_app_token(
    wx_app_token_inputs,
    options,
  ).await?;
  
  Ok(wx_app_token_ids)
}

/// 根据 wx_app_token_id 修改小程序接口凭据
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wx_app_token(
  wx_app_token_id: WxAppTokenId,
  mut wx_app_token_input: WxAppTokenInput,
  options: Option<Options>,
) -> Result<WxAppTokenId> {
  
  let wx_app_token_id = wx_app_token_dao::update_by_id_wx_app_token(
    wx_app_token_id,
    wx_app_token_input,
    options.clone(),
  ).await?;
  
  Ok(wx_app_token_id)
}

/// 校验小程序接口凭据是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_app_token(
  wx_app_token_model: Option<WxAppTokenModel>,
) -> Result<WxAppTokenModel> {
  
  let wx_app_token_model = wx_app_token_dao::validate_option_wx_app_token(wx_app_token_model).await?;
  
  Ok(wx_app_token_model)
}

/// 根据 wx_app_token_ids 删除小程序接口凭据
#[allow(dead_code)]
pub async fn delete_by_ids_wx_app_token(
  wx_app_token_ids: Vec<WxAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_token_dao::delete_by_ids_wx_app_token(
    wx_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取小程序接口凭据字段注释
pub async fn get_field_comments_wx_app_token(
  options: Option<Options>,
) -> Result<WxAppTokenFieldComment> {
  
  let comments = wx_app_token_dao::get_field_comments_wx_app_token(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wx_app_token_ids 还原小程序接口凭据
#[allow(dead_code)]
pub async fn revert_by_ids_wx_app_token(
  wx_app_token_ids: Vec<WxAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_token_dao::revert_by_ids_wx_app_token(
    wx_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_app_token_ids 彻底删除小程序接口凭据
#[allow(dead_code)]
pub async fn force_delete_by_ids_wx_app_token(
  wx_app_token_ids: Vec<WxAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_app_token_dao::force_delete_by_ids_wx_app_token(
    wx_app_token_ids,
    options,
  ).await?;
  
  Ok(num)
}
