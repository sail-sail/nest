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

use super::wxw_usr_model::*;
use super::wxw_usr_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxwUsrSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找企微用户列表
pub async fn find_all(
  search: Option<WxwUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_usr_models = wxw_usr_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxw_usr_models)
}

/// 根据条件查找企微用户总数
pub async fn find_count(
  search: Option<WxwUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_usr_num = wxw_usr_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(wxw_usr_num)
}

/// 根据条件查找第一个企微用户
pub async fn find_one(
  search: Option<WxwUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxw_usr_model = wxw_usr_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_usr_model)
}

/// 根据 id 查找企微用户
pub async fn find_by_id(
  wxw_usr_id: WxwUsrId,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  let wxw_usr_model = wxw_usr_dao::find_by_id(
    wxw_usr_id,
    options,
  ).await?;
  
  Ok(wxw_usr_model)
}

/// 根据 wxw_usr_ids 查找企微用户
pub async fn find_by_ids(
  wxw_usr_ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  let wxw_usr_models = wxw_usr_dao::find_by_ids(
    wxw_usr_ids,
    options,
  ).await?;
  
  Ok(wxw_usr_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  wxw_usr_input: WxwUsrInput,
) -> Result<WxwUsrInput> {
  
  let wxw_usr_input = wxw_usr_dao::set_id_by_lbl(
    wxw_usr_input,
  ).await?;
  
  Ok(wxw_usr_input)
}

/// 创建企微用户
#[allow(dead_code)]
pub async fn creates(
  wxw_usr_inputs: Vec<WxwUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrId>> {
  
  let wxw_usr_ids = wxw_usr_dao::creates(
    wxw_usr_inputs,
    options,
  ).await?;
  
  Ok(wxw_usr_ids)
}

/// 企微用户根据 wxw_usr_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  wxw_usr_id: WxwUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_usr_dao::update_tenant_by_id(
    wxw_usr_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_usr_id 修改企微用户
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  wxw_usr_id: WxwUsrId,
  mut wxw_usr_input: WxwUsrInput,
  options: Option<Options>,
) -> Result<WxwUsrId> {
  
  let wxw_usr_id = wxw_usr_dao::update_by_id(
    wxw_usr_id,
    wxw_usr_input,
    options.clone(),
  ).await?;
  
  Ok(wxw_usr_id)
}

/// 校验企微用户是否存在
#[allow(dead_code)]
pub async fn validate_option(
  wxw_usr_model: Option<WxwUsrModel>,
) -> Result<WxwUsrModel> {
  
  let wxw_usr_model = wxw_usr_dao::validate_option(wxw_usr_model).await?;
  
  Ok(wxw_usr_model)
}

/// 根据 wxw_usr_ids 删除企微用户
#[allow(dead_code)]
pub async fn delete_by_ids(
  wxw_usr_ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_usr_dao::delete_by_ids(
    wxw_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微用户字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwUsrFieldComment> {
  
  let comments = wxw_usr_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wxw_usr_ids 还原企微用户
#[allow(dead_code)]
pub async fn revert_by_ids(
  wxw_usr_ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_usr_dao::revert_by_ids(
    wxw_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_usr_ids 彻底删除企微用户
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  wxw_usr_ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_usr_dao::force_delete_by_ids(
    wxw_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}
