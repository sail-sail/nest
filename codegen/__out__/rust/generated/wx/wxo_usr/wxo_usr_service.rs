
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

use super::wxo_usr_model::*;
use super::wxo_usr_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxoUsrSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找公众号用户列表
pub async fn find_all_wxo_usr(
  search: Option<WxoUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_usr_models = wxo_usr_dao::find_all_wxo_usr(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxo_usr_models)
}

/// 根据条件查找公众号用户总数
pub async fn find_count_wxo_usr(
  search: Option<WxoUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_usr_num = wxo_usr_dao::find_count_wxo_usr(
    Some(search),
    options,
  ).await?;
  
  Ok(wxo_usr_num)
}

/// 根据条件查找第一个公众号用户
pub async fn find_one_wxo_usr(
  search: Option<WxoUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoUsrModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_usr_model = wxo_usr_dao::find_one_wxo_usr(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxo_usr_model)
}

/// 根据条件查找第一个公众号用户, 如果不存在则抛错
pub async fn find_one_ok_wxo_usr(
  search: Option<WxoUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxoUsrModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let wxo_usr_model = wxo_usr_dao::find_one_ok_wxo_usr(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxo_usr_model)
}

/// 根据 id 查找公众号用户
pub async fn find_by_id_wxo_usr(
  wxo_usr_id: WxoUsrId,
  options: Option<Options>,
) -> Result<Option<WxoUsrModel>> {
  
  let wxo_usr_model = wxo_usr_dao::find_by_id_wxo_usr(
    wxo_usr_id,
    options,
  ).await?;
  
  Ok(wxo_usr_model)
}

/// 根据 id 查找公众号用户, 如果不存在则抛错
pub async fn find_by_id_ok_wxo_usr(
  wxo_usr_id: WxoUsrId,
  options: Option<Options>,
) -> Result<WxoUsrModel> {
  
  let wxo_usr_model = wxo_usr_dao::find_by_id_ok_wxo_usr(
    wxo_usr_id,
    options,
  ).await?;
  
  Ok(wxo_usr_model)
}

/// 根据 ids 查找公众号用户
pub async fn find_by_ids_wxo_usr(
  wxo_usr_ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  let wxo_usr_models = wxo_usr_dao::find_by_ids_wxo_usr(
    wxo_usr_ids,
    options,
  ).await?;
  
  Ok(wxo_usr_models)
}

/// 根据 ids 查找公众号用户, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wxo_usr(
  wxo_usr_ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  let wxo_usr_models = wxo_usr_dao::find_by_ids_ok_wxo_usr(
    wxo_usr_ids,
    options,
  ).await?;
  
  Ok(wxo_usr_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wxo_usr(
  wxo_usr_input: WxoUsrInput,
) -> Result<WxoUsrInput> {
  
  let wxo_usr_input = wxo_usr_dao::set_id_by_lbl_wxo_usr(
    wxo_usr_input,
  ).await?;
  
  Ok(wxo_usr_input)
}

/// 创建公众号用户
#[allow(dead_code)]
pub async fn creates_wxo_usr(
  wxo_usr_inputs: Vec<WxoUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrId>> {
  
  let wxo_usr_ids = wxo_usr_dao::creates_wxo_usr(
    wxo_usr_inputs,
    options,
  ).await?;
  
  Ok(wxo_usr_ids)
}

/// 公众号用户根据 wxo_usr_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wxo_usr(
  wxo_usr_id: WxoUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_usr_dao::update_tenant_by_id_wxo_usr(
    wxo_usr_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxo_usr_id 修改公众号用户
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wxo_usr(
  wxo_usr_id: WxoUsrId,
  mut wxo_usr_input: WxoUsrInput,
  options: Option<Options>,
) -> Result<WxoUsrId> {
  
  let wxo_usr_id = wxo_usr_dao::update_by_id_wxo_usr(
    wxo_usr_id,
    wxo_usr_input,
    options.clone(),
  ).await?;
  
  Ok(wxo_usr_id)
}

/// 校验公众号用户是否存在
#[allow(dead_code)]
pub async fn validate_option_wxo_usr(
  wxo_usr_model: Option<WxoUsrModel>,
) -> Result<WxoUsrModel> {
  
  let wxo_usr_model = wxo_usr_dao::validate_option_wxo_usr(wxo_usr_model).await?;
  
  Ok(wxo_usr_model)
}

/// 根据 wxo_usr_ids 删除公众号用户
#[allow(dead_code)]
pub async fn delete_by_ids_wxo_usr(
  wxo_usr_ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_usr_dao::delete_by_ids_wxo_usr(
    wxo_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取公众号用户字段注释
pub async fn get_field_comments_wxo_usr(
  options: Option<Options>,
) -> Result<WxoUsrFieldComment> {
  
  let comments = wxo_usr_dao::get_field_comments_wxo_usr(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wxo_usr_ids 还原公众号用户
#[allow(dead_code)]
pub async fn revert_by_ids_wxo_usr(
  wxo_usr_ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_usr_dao::revert_by_ids_wxo_usr(
    wxo_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxo_usr_ids 彻底删除公众号用户
#[allow(dead_code)]
pub async fn force_delete_by_ids_wxo_usr(
  wxo_usr_ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxo_usr_dao::force_delete_by_ids_wxo_usr(
    wxo_usr_ids,
    options,
  ).await?;
  
  Ok(num)
}
