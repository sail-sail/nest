
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

use crate::base::org::org_model::OrgId;

use crate::base::usr::usr_dao::{
  find_by_id_ok_usr,
};

use super::wxw_oa_approval_detail_model::*;
use super::wxw_oa_approval_detail_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxwOaApprovalDetailSearch,
  options: Option<Options>,
) -> Result<()> {
  
  let usr_id = if let Some(auth_usr_id) = search.auth_usr_id {
    auth_usr_id
  } else {
    get_auth_id_ok()?
  };
  
  let usr_model = find_by_id_ok_usr(
    usr_id,
    options,
  ).await?;
  
  let org_id = get_auth_org_id().unwrap_or_default();
  let mut org_ids: Vec<OrgId> = vec![];
  if search.auth_usr_id.unwrap_or_default().is_empty() && !org_id.is_empty() {
    org_ids.push(org_id);
  } else {
    org_ids.append(&mut usr_model.org_ids.clone());
    org_ids.push(OrgId::default());
  }
  
  search.org_id = Some(org_ids);
  
  Ok(())
}

/// 根据搜索条件和分页查找审批申请详情列表
pub async fn find_all_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_approval_detail_models = wxw_oa_approval_detail_dao::find_all_wxw_oa_approval_detail(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_models)
}

/// 根据条件查找审批申请详情总数
pub async fn find_count_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_approval_detail_num = wxw_oa_approval_detail_dao::find_count_wxw_oa_approval_detail(
    Some(search),
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_num)
}

/// 根据条件查找第一个审批申请详情
pub async fn find_one_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwOaApprovalDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_approval_detail_model = wxw_oa_approval_detail_dao::find_one_wxw_oa_approval_detail(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_model)
}

/// 根据条件查找第一个审批申请详情, 如果不存在则抛错
pub async fn find_one_ok_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_approval_detail_model = wxw_oa_approval_detail_dao::find_one_ok_wxw_oa_approval_detail(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_model)
}

/// 根据 id 查找审批申请详情
pub async fn find_by_id_wxw_oa_approval_detail(
  wxw_oa_approval_detail_id: WxwOaApprovalDetailId,
  options: Option<Options>,
) -> Result<Option<WxwOaApprovalDetailModel>> {
  
  let wxw_oa_approval_detail_model = wxw_oa_approval_detail_dao::find_by_id_wxw_oa_approval_detail(
    wxw_oa_approval_detail_id,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_model)
}

/// 根据 id 查找审批申请详情, 如果不存在则抛错
pub async fn find_by_id_ok_wxw_oa_approval_detail(
  wxw_oa_approval_detail_id: WxwOaApprovalDetailId,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  let wxw_oa_approval_detail_model = wxw_oa_approval_detail_dao::find_by_id_ok_wxw_oa_approval_detail(
    wxw_oa_approval_detail_id,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_model)
}

/// 根据 ids 查找审批申请详情
pub async fn find_by_ids_wxw_oa_approval_detail(
  wxw_oa_approval_detail_ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let wxw_oa_approval_detail_models = wxw_oa_approval_detail_dao::find_by_ids_wxw_oa_approval_detail(
    wxw_oa_approval_detail_ids,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_models)
}

/// 根据搜索条件判断审批申请详情是否存在
pub async fn exists_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let exists_res = wxw_oa_approval_detail_dao::exists_wxw_oa_approval_detail(
    Some(search),
    options,
  ).await?;
  
  Ok(exists_res)
}

/// 根据 ids 查找审批申请详情, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wxw_oa_approval_detail(
  wxw_oa_approval_detail_ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let wxw_oa_approval_detail_models = wxw_oa_approval_detail_dao::find_by_ids_ok_wxw_oa_approval_detail(
    wxw_oa_approval_detail_ids,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wxw_oa_approval_detail(
  wxw_oa_approval_detail_input: WxwOaApprovalDetailInput,
) -> Result<WxwOaApprovalDetailInput> {
  
  let wxw_oa_approval_detail_input = wxw_oa_approval_detail_dao::set_id_by_lbl_wxw_oa_approval_detail(
    wxw_oa_approval_detail_input,
  ).await?;
  
  Ok(wxw_oa_approval_detail_input)
}

/// 创建审批申请详情
#[allow(dead_code)]
pub async fn creates_wxw_oa_approval_detail(
  wxw_oa_approval_detail_inputs: Vec<WxwOaApprovalDetailInput>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailId>> {
  
  let wxw_oa_approval_detail_ids = wxw_oa_approval_detail_dao::creates_wxw_oa_approval_detail(
    wxw_oa_approval_detail_inputs,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_ids)
}

/// 审批申请详情根据 wxw_oa_approval_detail_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wxw_oa_approval_detail(
  wxw_oa_approval_detail_id: WxwOaApprovalDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_oa_approval_detail_dao::update_tenant_by_id_wxw_oa_approval_detail(
    wxw_oa_approval_detail_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_oa_approval_detail_id 修改审批申请详情
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wxw_oa_approval_detail(
  wxw_oa_approval_detail_id: WxwOaApprovalDetailId,
  mut wxw_oa_approval_detail_input: WxwOaApprovalDetailInput,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailId> {
  
  let wxw_oa_approval_detail_id = wxw_oa_approval_detail_dao::update_by_id_wxw_oa_approval_detail(
    wxw_oa_approval_detail_id,
    wxw_oa_approval_detail_input,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_id)
}

/// 校验审批申请详情是否存在
#[allow(dead_code)]
pub async fn validate_option_wxw_oa_approval_detail(
  wxw_oa_approval_detail_model: Option<WxwOaApprovalDetailModel>,
) -> Result<WxwOaApprovalDetailModel> {
  
  let wxw_oa_approval_detail_model = wxw_oa_approval_detail_dao::validate_option_wxw_oa_approval_detail(wxw_oa_approval_detail_model).await?;
  
  Ok(wxw_oa_approval_detail_model)
}

/// 根据 wxw_oa_approval_detail_ids 删除审批申请详情
#[allow(dead_code)]
pub async fn delete_by_ids_wxw_oa_approval_detail(
  wxw_oa_approval_detail_ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_oa_approval_detail_dao::delete_by_ids_wxw_oa_approval_detail(
    wxw_oa_approval_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取审批申请详情字段注释
pub async fn get_field_comments_wxw_oa_approval_detail(
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailFieldComment> {
  
  let comments = wxw_oa_approval_detail_dao::get_field_comments_wxw_oa_approval_detail(
    options,
  ).await?;
  
  Ok(comments)
}
