#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;

use serde::{Serialize, Deserialize};
use color_eyre::eyre::{Result, eyre};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

#[allow(unused_imports)]
use async_graphql::{
  SimpleObject,
  InputObject,
  Enum,
};

#[allow(unused_imports)]
use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;
use crate::common::exceptions::service_exception::ServiceException;

use crate::base::tenant::tenant_model::TenantId;

use crate::base::usr::usr_model::UsrId;
use crate::base::org::org_model::OrgId;

static CAN_SORT_IN_API_WXW_OA_APPROVAL_DETAIL: [&str; 1] = [
  "apply_time",
];

/// 审批申请详情 前端允许排序的字段
fn get_can_sort_in_api_wxw_oa_approval_detail() -> &'static [&'static str; 1] {
  &CAN_SORT_IN_API_WXW_OA_APPROVAL_DETAIL
}

/// 审批申请详情
#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwOaApprovalDetailModel")]
#[allow(dead_code)]
pub struct WxwOaApprovalDetailModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwOaApprovalDetailId,
  /// 审批编号
  #[graphql(name = "sp_no")]
  pub sp_no: String,
  /// 审批申请类型名称
  #[graphql(name = "sp_name")]
  pub sp_name: String,
  /// 审批申请状态
  #[graphql(name = "sp_status")]
  pub sp_status: u8,
  /// 审批申请状态
  #[graphql(name = "sp_status_lbl")]
  pub sp_status_lbl: String,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: String,
  /// 审批申请提交时间
  #[graphql(name = "apply_time")]
  pub apply_time: Option<chrono::NaiveDateTime>,
  /// 审批申请提交时间
  #[graphql(name = "apply_time_lbl")]
  pub apply_time_lbl: String,
  /// 申请人
  #[graphql(name = "applyer_userid")]
  pub applyer_userid: String,
  /// 批量申请人
  #[graphql(name = "batch_applyer_userid")]
  pub batch_applyer_userid: String,
  /// 原始数据
  #[graphql(name = "raw_data")]
  pub raw_data: Option<String>,
  /// 所属组织
  #[graphql(name = "org_id")]
  pub org_id: OrgId,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: String,
}

impl FromRow<'_, MySqlRow> for WxwOaApprovalDetailModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwOaApprovalDetailId = row.try_get("id")?;
    // 审批编号
    let sp_no: String = row.try_get("sp_no")?;
    // 审批申请类型名称
    let sp_name: String = row.try_get("sp_name")?;
    // 审批申请状态
    let sp_status: u8 = row.try_get("sp_status")?;
    let sp_status_lbl = sp_status.to_string();
    // 模板ID
    let template_id: String = row.try_get("template_id")?;
    // 审批申请提交时间
    let apply_time: Option<chrono::NaiveDateTime> = row.try_get("apply_time")?;
    let apply_time_lbl: String = match apply_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_string(),
    };
    // 申请人
    let applyer_userid: String = row.try_get("applyer_userid")?;
    // 批量申请人
    let batch_applyer_userid: String = row.try_get("batch_applyer_userid")?;
    // 原始数据
    let raw_data: Option<sqlx::types::Json<serde_json::Value>> = row.try_get("raw_data")?;
    let raw_data = raw_data.map(|v| v.to_string());
    // 所属组织
    let org_id: OrgId = row.try_get("org_id")?;
    let org_id_lbl: Option<&str> = row.try_get("org_id_lbl")?;
    let org_id_lbl = String::from(org_id_lbl.unwrap_or_default());
    
    let model = Self {
      tenant_id,
      id,
      sp_no,
      sp_name,
      sp_status,
      sp_status_lbl,
      template_id,
      apply_time,
      apply_time_lbl,
      applyer_userid,
      batch_applyer_userid,
      raw_data,
      org_id,
      org_id_lbl,
    };
    
    Ok(model)
  }
}

/// 审批申请详情
#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwOaApprovalDetailFieldComment")]
#[allow(dead_code)]
pub struct WxwOaApprovalDetailFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 审批编号
  #[graphql(name = "sp_no")]
  pub sp_no: String,
  /// 审批申请类型名称
  #[graphql(name = "sp_name")]
  pub sp_name: String,
  /// 审批申请状态
  #[graphql(name = "sp_status")]
  pub sp_status: String,
  /// 审批申请状态
  #[graphql(name = "sp_status_lbl")]
  pub sp_status_lbl: String,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: String,
  /// 审批申请提交时间
  #[graphql(name = "apply_time")]
  pub apply_time: String,
  /// 审批申请提交时间
  #[graphql(name = "apply_time_lbl")]
  pub apply_time_lbl: String,
  /// 申请人
  #[graphql(name = "applyer_userid")]
  pub applyer_userid: String,
  /// 批量申请人
  #[graphql(name = "batch_applyer_userid")]
  pub batch_applyer_userid: String,
  /// 原始数据
  #[graphql(name = "raw_data")]
  pub raw_data: String,
  /// 所属组织 [@fk:base_org.id]
  #[graphql(name = "org_id")]
  pub org_id: String,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: String,
}

/// 审批申请详情
#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxwOaApprovalDetailSearch")]
#[allow(dead_code)]
pub struct WxwOaApprovalDetailSearch {
  #[graphql(skip)]
  pub auth_usr_id: Option<UsrId>,
  /// ID
  pub id: Option<WxwOaApprovalDetailId>,
  /// ID列表
  pub ids: Option<Vec<WxwOaApprovalDetailId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 审批编号
  #[graphql(name = "sp_no")]
  pub sp_no: Option<String>,
  /// 审批编号
  #[graphql(name = "sp_no_like")]
  pub sp_no_like: Option<String>,
  /// 审批申请类型名称
  #[graphql(name = "sp_name")]
  pub sp_name: Option<String>,
  /// 审批申请类型名称
  #[graphql(name = "sp_name_like")]
  pub sp_name_like: Option<String>,
  /// 审批申请状态
  #[graphql(name = "sp_status")]
  pub sp_status: Option<Vec<u8>>,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: Option<String>,
  /// 模板ID
  #[graphql(name = "template_id_like")]
  pub template_id_like: Option<String>,
  /// 审批申请提交时间
  #[graphql(name = "apply_time")]
  pub apply_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 申请人
  #[graphql(skip)]
  pub applyer_userid: Option<String>,
  /// 申请人
  #[graphql(skip)]
  pub applyer_userid_like: Option<String>,
  /// 批量申请人
  #[graphql(skip)]
  pub batch_applyer_userid: Option<String>,
  /// 批量申请人
  #[graphql(skip)]
  pub batch_applyer_userid_like: Option<String>,
  /// 原始数据
  #[graphql(skip)]
  pub raw_data: Option<String>,
  /// 所属组织 [@fk:base_org.id]
  #[graphql(name = "org_id")]
  pub org_id: Option<Vec<OrgId>>,
  /// 所属组织
  #[graphql(name = "org_id_is_null")]
  pub org_id_is_null: Option<bool>,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<Vec<String>>,
  /// 所属组织
  #[graphql(name = "org_id_lbl_like")]
  pub org_id_lbl_like: Option<String>,
}

impl std::fmt::Debug for WxwOaApprovalDetailSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwOaApprovalDetailSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    // 审批编号
    if let Some(ref sp_no) = self.sp_no {
      item = item.field("sp_no", sp_no);
    }
    if let Some(ref sp_no_like) = self.sp_no_like {
      item = item.field("sp_no_like", sp_no_like);
    }
    // 审批申请类型名称
    if let Some(ref sp_name) = self.sp_name {
      item = item.field("sp_name", sp_name);
    }
    if let Some(ref sp_name_like) = self.sp_name_like {
      item = item.field("sp_name_like", sp_name_like);
    }
    // 审批申请状态
    if let Some(ref sp_status) = self.sp_status {
      item = item.field("sp_status", sp_status);
    }
    // 模板ID
    if let Some(ref template_id) = self.template_id {
      item = item.field("template_id", template_id);
    }
    if let Some(ref template_id_like) = self.template_id_like {
      item = item.field("template_id_like", template_id_like);
    }
    // 审批申请提交时间
    if let Some(ref apply_time) = self.apply_time {
      item = item.field("apply_time", apply_time);
    }
    // 申请人
    if let Some(ref applyer_userid) = self.applyer_userid {
      item = item.field("applyer_userid", applyer_userid);
    }
    if let Some(ref applyer_userid_like) = self.applyer_userid_like {
      item = item.field("applyer_userid_like", applyer_userid_like);
    }
    // 批量申请人
    if let Some(ref batch_applyer_userid) = self.batch_applyer_userid {
      item = item.field("batch_applyer_userid", batch_applyer_userid);
    }
    if let Some(ref batch_applyer_userid_like) = self.batch_applyer_userid_like {
      item = item.field("batch_applyer_userid_like", batch_applyer_userid_like);
    }
    // 原始数据
    if let Some(ref raw_data) = self.raw_data {
      item = item.field("raw_data", raw_data);
    }
    // 所属组织
    if let Some(ref org_id) = self.org_id {
      item = item.field("org_id", org_id);
    }
    if let Some(ref org_id_lbl) = self.org_id_lbl {
      item = item.field("org_id_lbl", org_id_lbl);
    }
    if let Some(ref org_id_lbl_like) = self.org_id_lbl_like {
      item = item.field("org_id_lbl_like", org_id_lbl_like);
    }
    if let Some(ref org_id_is_null) = self.org_id_is_null {
      item = item.field("org_id_is_null", org_id_is_null);
    }
    item.finish()
  }
}

/// 审批申请详情
#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxwOaApprovalDetailInput")]
#[allow(dead_code)]
pub struct WxwOaApprovalDetailInput {
  /// ID
  pub id: Option<WxwOaApprovalDetailId>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 审批编号
  #[graphql(name = "sp_no")]
  pub sp_no: Option<String>,
  /// 审批申请类型名称
  #[graphql(name = "sp_name")]
  pub sp_name: Option<String>,
  /// 审批申请状态
  #[graphql(name = "sp_status")]
  pub sp_status: Option<u8>,
  /// 审批申请状态
  #[graphql(name = "sp_status_lbl")]
  pub sp_status_lbl: Option<String>,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: Option<String>,
  /// 审批申请提交时间
  #[graphql(name = "apply_time")]
  pub apply_time: Option<chrono::NaiveDateTime>,
  /// 审批申请提交时间
  #[graphql(name = "apply_time_lbl")]
  pub apply_time_lbl: Option<String>,
  /// 审批申请提交时间
  #[graphql(name = "apply_time_save_null")]
  pub apply_time_save_null: Option<bool>,
  /// 申请人
  #[graphql(name = "applyer_userid")]
  pub applyer_userid: Option<String>,
  /// 批量申请人
  #[graphql(name = "batch_applyer_userid")]
  pub batch_applyer_userid: Option<String>,
  /// 原始数据
  #[graphql(name = "raw_data")]
  pub raw_data: Option<String>,
  /// 所属组织 [@fk:base_org.id]
  #[graphql(name = "org_id")]
  pub org_id: Option<OrgId>,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<String>,
}

impl std::fmt::Debug for WxwOaApprovalDetailInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwOaApprovalDetailInput");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref sp_no) = self.sp_no {
      item = item.field("sp_no", sp_no);
    }
    if let Some(ref sp_name) = self.sp_name {
      item = item.field("sp_name", sp_name);
    }
    if let Some(ref sp_status) = self.sp_status {
      item = item.field("sp_status", sp_status);
    }
    if let Some(ref template_id) = self.template_id {
      item = item.field("template_id", template_id);
    }
    if let Some(ref apply_time) = self.apply_time {
      item = item.field("apply_time", apply_time);
    }
    if let Some(ref applyer_userid) = self.applyer_userid {
      item = item.field("applyer_userid", applyer_userid);
    }
    if let Some(ref batch_applyer_userid) = self.batch_applyer_userid {
      item = item.field("batch_applyer_userid", batch_applyer_userid);
    }
    if let Some(ref raw_data) = self.raw_data {
      item = item.field("raw_data", raw_data);
    }
    if let Some(ref org_id) = self.org_id {
      item = item.field("org_id", org_id);
    }
    if let Some(ref org_id_lbl) = self.org_id_lbl {
      item = item.field("org_id_lbl", org_id_lbl);
    }
    item.finish()
  }
}

impl From<WxwOaApprovalDetailModel> for WxwOaApprovalDetailInput {
  fn from(model: WxwOaApprovalDetailModel) -> Self {
    Self {
      id: model.id.into(),
      tenant_id: model.tenant_id.into(),
      // 审批编号
      sp_no: model.sp_no.into(),
      // 审批申请类型名称
      sp_name: model.sp_name.into(),
      // 审批申请状态
      sp_status: model.sp_status.into(),
      sp_status_lbl: model.sp_status_lbl.into(),
      // 模板ID
      template_id: model.template_id.into(),
      // 审批申请提交时间
      apply_time: model.apply_time,
      apply_time_lbl: model.apply_time_lbl.into(),
      apply_time_save_null: Some(true),
      // 申请人
      applyer_userid: model.applyer_userid.into(),
      // 批量申请人
      batch_applyer_userid: model.batch_applyer_userid.into(),
      // 原始数据
      raw_data: model.raw_data,
      // 所属组织
      org_id: model.org_id.into(),
      org_id_lbl: model.org_id_lbl.into(),
    }
  }
}

impl From<WxwOaApprovalDetailInput> for WxwOaApprovalDetailSearch {
  fn from(input: WxwOaApprovalDetailInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      // 审批编号
      sp_no: input.sp_no,
      // 审批申请类型名称
      sp_name: input.sp_name,
      // 审批申请状态
      sp_status: input.sp_status.map(|x| vec![x]),
      // 模板ID
      template_id: input.template_id,
      // 审批申请提交时间
      apply_time: input.apply_time.map(|x| [Some(x), Some(x)]),
      // 申请人
      applyer_userid: input.applyer_userid,
      // 批量申请人
      batch_applyer_userid: input.batch_applyer_userid,
      // 原始数据
      raw_data: input.raw_data,
      // 所属组织
      org_id: input.org_id.map(|x| vec![x]),
      // 所属组织
      org_id_lbl: input.org_id_lbl.map(|x| vec![x]),
      ..Default::default()
    }
  }
}

crate::common::id::impl_id!(WxwOaApprovalDetailId);

/// 审批申请详情 检测字段是否允许前端排序
pub fn check_sort_wxw_oa_approval_detail(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_wxw_oa_approval_detail = get_can_sort_in_api_wxw_oa_approval_detail();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wxw_oa_approval_detail.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_wxw_oa_approval_detail: {}", serde_json::to_string(item)?),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wxw_oa_approval_detail
pub fn get_page_path_wxw_oa_approval_detail() -> &'static str {
  "/wxwork/wxw_oa_approval_detail"
}

// MARK: get_table_name_wxw_oa_approval_detail
pub fn get_table_name_wxw_oa_approval_detail() -> &'static str {
  "wxwork_wxw_oa_approval_detail"
}
