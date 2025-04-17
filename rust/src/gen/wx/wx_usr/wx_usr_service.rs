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

use super::wx_usr_model::*;
use super::wx_usr_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxUsrSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找小程序用户列表
pub async fn find_all_wx_usr(
  search: Option<WxUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxUsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_usr_models = wx_usr_dao::find_all_wx_usr(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wx_usr_models)
}

/// 根据条件查找小程序用户总数
pub async fn find_count_wx_usr(
  search: Option<WxUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_usr_num = wx_usr_dao::find_count_wx_usr(
    Some(search),
    options,
  ).await?;
  
  Ok(wx_usr_num)
}

/// 根据条件查找第一个小程序用户
pub async fn find_one_wx_usr(
  search: Option<WxUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxUsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wx_usr_model = wx_usr_dao::find_one_wx_usr(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wx_usr_model)
}

/// 根据 id 查找小程序用户
pub async fn find_by_id_wx_usr(
  wx_usr_id: WxUsrId,
  options: Option<Options>,
) -> Result<Option<WxUsrModel>> {
  
  let wx_usr_model = wx_usr_dao::find_by_id_wx_usr(
    wx_usr_id,
    options,
  ).await?;
  
  Ok(wx_usr_model)
}

/// 根据 wx_usr_ids 查找小程序用户
pub async fn find_by_ids_wx_usr(
  wx_usr_ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxUsrModel>> {
  
  let wx_usr_models = wx_usr_dao::find_by_ids_wx_usr(
    wx_usr_ids,
    options,
  ).await?;
  
  Ok(wx_usr_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wx_usr(
  wx_usr_input: WxUsrInput,
) -> Result<WxUsrInput> {
  
  let wx_usr_input = wx_usr_dao::set_id_by_lbl_wx_usr(
    wx_usr_input,
  ).await?;
  
  Ok(wx_usr_input)
}

/// 创建小程序用户
#[allow(dead_code)]
pub async fn creates_wx_usr(
  wx_usr_inputs: Vec<WxUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxUsrId>> {
  
  let wx_usr_ids = wx_usr_dao::creates_wx_usr(
    wx_usr_inputs,
    options,
  ).await?;
  
  Ok(wx_usr_ids)
}

/// 小程序用户根据 wx_usr_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wx_usr(
  wx_usr_id: WxUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_usr_dao::update_tenant_by_id_wx_usr(
    wx_usr_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_usr_id 修改小程序用户
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wx_usr(
  wx_usr_id: WxUsrId,
  mut wx_usr_input: WxUsrInput,
  options: Option<Options>,
) -> Result<WxUsrId> {
  
  let wx_usr_id = wx_usr_dao::update_by_id_wx_usr(
    wx_usr_id,
    wx_usr_input,
    options.clone(),
  ).await?;
  
  Ok(wx_usr_id)
}

/// 校验小程序用户是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_usr(
  wx_usr_model: Option<WxUsrModel>,
) -> Result<WxUsrModel> {
  
  let wx_usr_model = wx_usr_dao::validate_option_wx_usr(wx_usr_model).await?;
  
  Ok(wx_usr_model)
}

/// 根据 wx_usr_ids 删除小程序用户
#[allow(dead_code)]
pub async fn delete_by_ids_wx_usr(
  wx_usr_ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_usr_dao::delete_by_ids_wx_usr(
    wx_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取小程序用户字段注释
pub async fn get_field_comments_wx_usr(
  options: Option<Options>,
) -> Result<WxUsrFieldComment> {
  
  let comments = wx_usr_dao::get_field_comments_wx_usr(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wx_usr_ids 还原小程序用户
#[allow(dead_code)]
pub async fn revert_by_ids_wx_usr(
  wx_usr_ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_usr_dao::revert_by_ids_wx_usr(
    wx_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wx_usr_ids 彻底删除小程序用户
#[allow(dead_code)]
pub async fn force_delete_by_ids_wx_usr(
  wx_usr_ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wx_usr_dao::force_delete_by_ids_wx_usr(
    wx_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}
