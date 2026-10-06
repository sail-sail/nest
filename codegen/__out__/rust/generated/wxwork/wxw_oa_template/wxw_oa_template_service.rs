
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

use super::wxw_oa_template_model::*;
use super::wxw_oa_template_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut WxwOaTemplateSearch,
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

/// 根据搜索条件和分页查找审批模板列表
pub async fn find_all_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_template_models = wxw_oa_template_dao::find_all_wxw_oa_template(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(wxw_oa_template_models)
}

/// 根据条件查找审批模板总数
pub async fn find_count_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_template_num = wxw_oa_template_dao::find_count_wxw_oa_template(
    Some(search),
    options,
  ).await?;
  
  Ok(wxw_oa_template_num)
}

/// 根据条件查找第一个审批模板
pub async fn find_one_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwOaTemplateModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_template_model = wxw_oa_template_dao::find_one_wxw_oa_template(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_oa_template_model)
}

/// 根据条件查找第一个审批模板, 如果不存在则抛错
pub async fn find_one_ok_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxwOaTemplateModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let wxw_oa_template_model = wxw_oa_template_dao::find_one_ok_wxw_oa_template(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(wxw_oa_template_model)
}

/// 根据 id 查找审批模板
pub async fn find_by_id_wxw_oa_template(
  wxw_oa_template_id: WxwOaTemplateId,
  options: Option<Options>,
) -> Result<Option<WxwOaTemplateModel>> {
  
  let wxw_oa_template_model = wxw_oa_template_dao::find_by_id_wxw_oa_template(
    wxw_oa_template_id,
    options,
  ).await?;
  
  Ok(wxw_oa_template_model)
}

/// 根据 id 查找审批模板, 如果不存在则抛错
pub async fn find_by_id_ok_wxw_oa_template(
  wxw_oa_template_id: WxwOaTemplateId,
  options: Option<Options>,
) -> Result<WxwOaTemplateModel> {
  
  let wxw_oa_template_model = wxw_oa_template_dao::find_by_id_ok_wxw_oa_template(
    wxw_oa_template_id,
    options,
  ).await?;
  
  Ok(wxw_oa_template_model)
}

/// 根据 ids 查找审批模板
pub async fn find_by_ids_wxw_oa_template(
  wxw_oa_template_ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateModel>> {
  
  let wxw_oa_template_models = wxw_oa_template_dao::find_by_ids_wxw_oa_template(
    wxw_oa_template_ids,
    options,
  ).await?;
  
  Ok(wxw_oa_template_models)
}

/// 根据搜索条件判断审批模板是否存在
pub async fn exists_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let exists_res = wxw_oa_template_dao::exists_wxw_oa_template(
    Some(search),
    options,
  ).await?;
  
  Ok(exists_res)
}

/// 根据 ids 查找审批模板, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_wxw_oa_template(
  wxw_oa_template_ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateModel>> {
  
  let wxw_oa_template_models = wxw_oa_template_dao::find_by_ids_ok_wxw_oa_template(
    wxw_oa_template_ids,
    options,
  ).await?;
  
  Ok(wxw_oa_template_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_wxw_oa_template(
  wxw_oa_template_input: WxwOaTemplateInput,
) -> Result<WxwOaTemplateInput> {
  
  let wxw_oa_template_input = wxw_oa_template_dao::set_id_by_lbl_wxw_oa_template(
    wxw_oa_template_input,
  ).await?;
  
  Ok(wxw_oa_template_input)
}

/// 创建审批模板
#[allow(dead_code)]
pub async fn creates_wxw_oa_template(
  wxw_oa_template_inputs: Vec<WxwOaTemplateInput>,
  options: Option<Options>,
) -> Result<Vec<WxwOaTemplateId>> {
  
  let wxw_oa_template_ids = wxw_oa_template_dao::creates_wxw_oa_template(
    wxw_oa_template_inputs,
    options,
  ).await?;
  
  Ok(wxw_oa_template_ids)
}

/// 审批模板根据 wxw_oa_template_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_wxw_oa_template(
  wxw_oa_template_id: WxwOaTemplateId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_oa_template_dao::update_tenant_by_id_wxw_oa_template(
    wxw_oa_template_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_oa_template_id 修改审批模板
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_wxw_oa_template(
  wxw_oa_template_id: WxwOaTemplateId,
  mut wxw_oa_template_input: WxwOaTemplateInput,
  options: Option<Options>,
) -> Result<WxwOaTemplateId> {
  
  let wxw_oa_template_id = wxw_oa_template_dao::update_by_id_wxw_oa_template(
    wxw_oa_template_id,
    wxw_oa_template_input,
    options,
  ).await?;
  
  Ok(wxw_oa_template_id)
}

/// 校验审批模板是否存在
#[allow(dead_code)]
pub async fn validate_option_wxw_oa_template(
  wxw_oa_template_model: Option<WxwOaTemplateModel>,
) -> Result<WxwOaTemplateModel> {
  
  let wxw_oa_template_model = wxw_oa_template_dao::validate_option_wxw_oa_template(wxw_oa_template_model).await?;
  
  Ok(wxw_oa_template_model)
}

/// 根据 wxw_oa_template_ids 删除审批模板
#[allow(dead_code)]
pub async fn delete_by_ids_wxw_oa_template(
  wxw_oa_template_ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_oa_template_dao::delete_by_ids_wxw_oa_template(
    wxw_oa_template_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_oa_template_id 查找审批模板是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_wxw_oa_template(
  wxw_oa_template_id: WxwOaTemplateId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = wxw_oa_template_dao::get_is_enabled_by_id_wxw_oa_template(
    wxw_oa_template_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 wxw_oa_template_ids 启用或者禁用审批模板
#[allow(dead_code)]
pub async fn enable_by_ids_wxw_oa_template(
  wxw_oa_template_ids: Vec<WxwOaTemplateId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_oa_template_dao::enable_by_ids_wxw_oa_template(
    wxw_oa_template_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取审批模板字段注释
pub async fn get_field_comments_wxw_oa_template(
  options: Option<Options>,
) -> Result<WxwOaTemplateFieldComment> {
  
  let comments = wxw_oa_template_dao::get_field_comments_wxw_oa_template(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 wxw_oa_template_ids 还原审批模板
#[allow(dead_code)]
pub async fn revert_by_ids_wxw_oa_template(
  wxw_oa_template_ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_oa_template_dao::revert_by_ids_wxw_oa_template(
    wxw_oa_template_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 wxw_oa_template_ids 彻底删除审批模板
#[allow(dead_code)]
pub async fn force_delete_by_ids_wxw_oa_template(
  wxw_oa_template_ids: Vec<WxwOaTemplateId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = wxw_oa_template_dao::force_delete_by_ids_wxw_oa_template(
    wxw_oa_template_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 审批模板 order_by 字段的最大值
pub async fn find_last_order_by_wxw_oa_template(
  search: Option<WxwOaTemplateSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = wxw_oa_template_dao::find_last_order_by_wxw_oa_template(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
