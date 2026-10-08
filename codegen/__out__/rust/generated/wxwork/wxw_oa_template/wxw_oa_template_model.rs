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

static CAN_SORT_IN_API_WXW_OA_TEMPLATE: [&str; 3] = [
  "order_by",
  "create_time",
  "update_time",
];

/// 审批模板 前端允许排序的字段
fn get_can_sort_in_api_wxw_oa_template() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_WXW_OA_TEMPLATE
}

/// 审批模板
#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwOaTemplateModel")]
#[allow(dead_code)]
pub struct WxwOaTemplateModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwOaTemplateId,
  /// 流程图
  #[graphql(name = "flow_img")]
  pub flow_img: String,
  /// 模板名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: String,
  /// 业务类型
  #[graphql(name = "business_type")]
  pub business_type: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 所属组织
  #[graphql(name = "org_id")]
  pub org_id: OrgId,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
}

impl FromRow<'_, MySqlRow> for WxwOaTemplateModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwOaTemplateId = row.try_get("id")?;
    // 流程图
    let flow_img: String = row.try_get("flow_img")?;
    // 模板名称
    let lbl: String = row.try_get("lbl")?;
    // 模板ID
    let template_id: String = row.try_get("template_id")?;
    // 业务类型
    let business_type: String = row.try_get("business_type")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 所属组织
    let org_id: OrgId = row.try_get("org_id")?;
    let org_id_lbl: Option<&str> = row.try_get("org_id_lbl")?;
    let org_id_lbl = String::from(org_id_lbl.unwrap_or_default());
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
      flow_img,
      lbl,
      template_id,
      business_type,
      is_enabled,
      is_enabled_lbl,
      order_by,
      rem,
      org_id,
      org_id_lbl,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
      update_time_lbl,
    };
    
    Ok(model)
  }
}

/// 审批模板
#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwOaTemplateFieldComment")]
#[allow(dead_code)]
pub struct WxwOaTemplateFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 流程图
  #[graphql(name = "flow_img")]
  pub flow_img: String,
  /// 模板名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: String,
  /// 业务类型
  #[graphql(name = "business_type")]
  pub business_type: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: String,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 创建人 [@fk:base_usr.id]
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: String,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: String,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
  /// 更新人 [@fk:base_usr.id]
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: String,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: String,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: String,
  /// 所属组织 [@fk:base_org.id]
  #[graphql(name = "org_id")]
  pub org_id: String,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: String,
}

/// 审批模板
#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxwOaTemplateSearch")]
#[allow(dead_code)]
pub struct WxwOaTemplateSearch {
  #[graphql(skip)]
  pub auth_usr_id: Option<UsrId>,
  /// ID
  pub id: Option<WxwOaTemplateId>,
  /// ID列表
  pub ids: Option<Vec<WxwOaTemplateId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 流程图
  #[graphql(skip)]
  pub flow_img: Option<String>,
  /// 流程图
  #[graphql(skip)]
  pub flow_img_like: Option<String>,
  /// 模板名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 模板名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: Option<String>,
  /// 模板ID
  #[graphql(name = "template_id_like")]
  pub template_id_like: Option<String>,
  /// 业务类型
  #[graphql(name = "business_type")]
  pub business_type: Option<String>,
  /// 业务类型
  #[graphql(name = "business_type_like")]
  pub business_type_like: Option<String>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<String>,
  /// 创建人 [@fk:base_usr.id]
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_is_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 更新人 [@fk:base_usr.id]
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(name = "update_usr_id_is_null")]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
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

impl std::fmt::Debug for WxwOaTemplateSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwOaTemplateSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    // 流程图
    if let Some(ref flow_img) = self.flow_img {
      item = item.field("flow_img", flow_img);
    }
    if let Some(ref flow_img_like) = self.flow_img_like {
      item = item.field("flow_img_like", flow_img_like);
    }
    // 模板名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 模板ID
    if let Some(ref template_id) = self.template_id {
      item = item.field("template_id", template_id);
    }
    if let Some(ref template_id_like) = self.template_id_like {
      item = item.field("template_id_like", template_id_like);
    }
    // 业务类型
    if let Some(ref business_type) = self.business_type {
      item = item.field("business_type", business_type);
    }
    if let Some(ref business_type_like) = self.business_type_like {
      item = item.field("business_type_like", business_type_like);
    }
    // 启用
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
    }
    // 排序
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    // 备注
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref rem_like) = self.rem_like {
      item = item.field("rem_like", rem_like);
    }
    // 创建人
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_usr_id_lbl_like) = self.create_usr_id_lbl_like {
      item = item.field("create_usr_id_lbl_like", create_usr_id_lbl_like);
    }
    if let Some(ref create_usr_id_is_null) = self.create_usr_id_is_null {
      item = item.field("create_usr_id_is_null", create_usr_id_is_null);
    }
    // 创建时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    // 更新人
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_lbl) = self.update_usr_id_lbl {
      item = item.field("update_usr_id_lbl", update_usr_id_lbl);
    }
    if let Some(ref update_usr_id_lbl_like) = self.update_usr_id_lbl_like {
      item = item.field("update_usr_id_lbl_like", update_usr_id_lbl_like);
    }
    if let Some(ref update_usr_id_is_null) = self.update_usr_id_is_null {
      item = item.field("update_usr_id_is_null", update_usr_id_is_null);
    }
    // 更新时间
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
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

/// 审批模板
#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxwOaTemplateInput")]
#[allow(dead_code)]
pub struct WxwOaTemplateInput {
  /// ID
  pub id: Option<WxwOaTemplateId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 流程图
  #[graphql(name = "flow_img")]
  pub flow_img: Option<String>,
  /// 模板名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 模板ID
  #[graphql(name = "template_id")]
  pub template_id: Option<String>,
  /// 业务类型
  #[graphql(name = "business_type")]
  pub business_type: Option<String>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<String>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<String>,
  /// 所属组织 [@fk:base_org.id]
  #[graphql(name = "org_id")]
  pub org_id: Option<OrgId>,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<String>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,
}

impl std::fmt::Debug for WxwOaTemplateInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwOaTemplateInput");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref flow_img) = self.flow_img {
      item = item.field("flow_img", flow_img);
    }
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref template_id) = self.template_id {
      item = item.field("template_id", template_id);
    }
    if let Some(ref business_type) = self.business_type {
      item = item.field("business_type", business_type);
    }
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
    }
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_lbl) = self.update_usr_id_lbl {
      item = item.field("update_usr_id_lbl", update_usr_id_lbl);
    }
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
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

impl From<WxwOaTemplateModel> for WxwOaTemplateInput {
  fn from(model: WxwOaTemplateModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 流程图
      flow_img: model.flow_img.into(),
      // 模板名称
      lbl: model.lbl.into(),
      // 模板ID
      template_id: model.template_id.into(),
      // 业务类型
      business_type: model.business_type.into(),
      // 启用
      is_enabled: model.is_enabled.into(),
      is_enabled_lbl: model.is_enabled_lbl.into(),
      // 排序
      order_by: model.order_by.into(),
      // 备注
      rem: model.rem.into(),
      // 所属组织
      org_id: model.org_id.into(),
      org_id_lbl: model.org_id_lbl.into(),
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      create_time_save_null: Some(true),
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
      update_time_save_null: Some(true),
    }
  }
}

impl From<WxwOaTemplateInput> for WxwOaTemplateSearch {
  fn from(input: WxwOaTemplateInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 流程图
      flow_img: input.flow_img,
      // 模板名称
      lbl: input.lbl,
      // 模板ID
      template_id: input.template_id,
      // 业务类型
      business_type: input.business_type,
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建人
      create_usr_id_lbl: input.create_usr_id_lbl.map(|x| vec![x]),
      // 创建时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新人
      update_usr_id_lbl: input.update_usr_id_lbl.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| [Some(x), Some(x)]),
      // 所属组织
      org_id: input.org_id.map(|x| vec![x]),
      // 所属组织
      org_id_lbl: input.org_id_lbl.map(|x| vec![x]),
      ..Default::default()
    }
  }
}

crate::common::id::impl_id!(WxwOaTemplateId);

/// 审批模板 检测字段是否允许前端排序
pub fn check_sort_wxw_oa_template(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_wxw_oa_template = get_can_sort_in_api_wxw_oa_template();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wxw_oa_template.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_wxw_oa_template: {}", serde_json::to_string(item)?),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wxw_oa_template
pub fn get_page_path_wxw_oa_template() -> &'static str {
  "/wxwork/wxw_oa_template"
}

// MARK: get_table_name_wxw_oa_template
pub fn get_table_name_wxw_oa_template() -> &'static str {
  "wxwork_wxw_oa_template"
}
