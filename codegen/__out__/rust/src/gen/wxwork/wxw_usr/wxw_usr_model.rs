
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result,eyre};

use sqlx::encode::{Encode, IsNull};
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
use smol_str::SmolStr;

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

use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::wxwork::wxw_app::wxw_app_model::WxwAppId;
use crate::r#gen::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WXW_USR: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 企微用户 前端允许排序的字段
fn get_can_sort_in_api_wxw_usr() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_WXW_USR.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwUsrModel")]
#[allow(dead_code)]
pub struct WxwUsrModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwUsrId,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: WxwAppId,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: String,
  /// 企业ID
  #[graphql(skip)]
  pub corpid: String,
  /// 应用ID
  #[graphql(skip)]
  pub agentid: String,
  /// 姓名
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 用户ID
  #[graphql(name = "userid")]
  pub userid: String,
  /// 手机号
  #[graphql(skip)]
  pub mobile: String,
  /// 性别
  #[graphql(skip)]
  pub gender: String,
  /// 邮箱
  #[graphql(skip)]
  pub email: String,
  /// 企业邮箱
  #[graphql(skip)]
  pub biz_email: String,
  /// 直属上级
  #[graphql(skip)]
  pub direct_leader: String,
  /// 职位
  #[graphql(skip)]
  pub position: String,
  /// 头像
  #[graphql(skip)]
  pub avatar: String,
  /// 头像缩略图
  #[graphql(skip)]
  pub thumb_avatar: String,
  /// 个人二维码
  #[graphql(skip)]
  pub qr_code: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: UsrId,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: String,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: String,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: UsrId,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: String,
}

impl FromRow<'_, MySqlRow> for WxwUsrModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwUsrId = row.try_get("id")?;
    // 企微应用
    let wxw_app_id: WxwAppId = row.try_get("wxw_app_id")?;
    let wxw_app_id_lbl: Option<String> = row.try_get("wxw_app_id_lbl")?;
    let wxw_app_id_lbl = wxw_app_id_lbl.unwrap_or_default();
    // 企业ID
    let corpid: String = row.try_get("corpid")?;
    // 应用ID
    let agentid: String = row.try_get("agentid")?;
    // 姓名
    let lbl: String = row.try_get("lbl")?;
    // 用户ID
    let userid: String = row.try_get("userid")?;
    // 手机号
    let mobile: String = row.try_get("mobile")?;
    // 性别
    let gender: String = row.try_get("gender")?;
    // 邮箱
    let email: String = row.try_get("email")?;
    // 企业邮箱
    let biz_email: String = row.try_get("biz_email")?;
    // 直属上级
    let direct_leader: String = row.try_get("direct_leader")?;
    // 职位
    let position: String = row.try_get("position")?;
    // 头像
    let avatar: String = row.try_get("avatar")?;
    // 头像缩略图
    let thumb_avatar: String = row.try_get("thumb_avatar")?;
    // 个人二维码
    let qr_code: String = row.try_get("qr_code")?;
    // 备注
    let rem: String = row.try_get("rem")?;
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
      wxw_app_id,
      wxw_app_id_lbl,
      corpid,
      agentid,
      lbl,
      userid,
      mobile,
      gender,
      email,
      biz_email,
      direct_leader,
      position,
      avatar,
      thumb_avatar,
      qr_code,
      rem,
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

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct WxwUsrFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: String,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: String,
  /// 姓名
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 用户ID
  #[graphql(name = "userid")]
  pub userid: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct WxwUsrSearch {
  /// ID
  pub id: Option<WxwUsrId>,
  /// ID列表
  pub ids: Option<Vec<WxwUsrId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: Option<Vec<WxwAppId>>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_save_null")]
  pub wxw_app_id_is_null: Option<bool>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: Option<Vec<String>>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl_like")]
  pub wxw_app_id_lbl_like: Option<String>,
  /// 企业ID
  #[graphql(skip)]
  pub corpid: Option<String>,
  /// 企业ID
  #[graphql(skip)]
  pub corpid_like: Option<String>,
  /// 应用ID
  #[graphql(skip)]
  pub agentid: Option<String>,
  /// 应用ID
  #[graphql(skip)]
  pub agentid_like: Option<String>,
  /// 姓名
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 姓名
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 用户ID
  #[graphql(skip)]
  pub userid: Option<String>,
  /// 用户ID
  #[graphql(skip)]
  pub userid_like: Option<String>,
  /// 手机号
  #[graphql(skip)]
  pub mobile: Option<String>,
  /// 手机号
  #[graphql(skip)]
  pub mobile_like: Option<String>,
  /// 性别
  #[graphql(skip)]
  pub gender: Option<String>,
  /// 性别
  #[graphql(skip)]
  pub gender_like: Option<String>,
  /// 邮箱
  #[graphql(skip)]
  pub email: Option<String>,
  /// 邮箱
  #[graphql(skip)]
  pub email_like: Option<String>,
  /// 企业邮箱
  #[graphql(skip)]
  pub biz_email: Option<String>,
  /// 企业邮箱
  #[graphql(skip)]
  pub biz_email_like: Option<String>,
  /// 直属上级
  #[graphql(skip)]
  pub direct_leader: Option<String>,
  /// 直属上级
  #[graphql(skip)]
  pub direct_leader_like: Option<String>,
  /// 职位
  #[graphql(skip)]
  pub position: Option<String>,
  /// 职位
  #[graphql(skip)]
  pub position_like: Option<String>,
  /// 头像
  #[graphql(skip)]
  pub avatar: Option<String>,
  /// 头像
  #[graphql(skip)]
  pub avatar_like: Option<String>,
  /// 头像缩略图
  #[graphql(skip)]
  pub thumb_avatar: Option<String>,
  /// 头像缩略图
  #[graphql(skip)]
  pub thumb_avatar_like: Option<String>,
  /// 个人二维码
  #[graphql(skip)]
  pub qr_code: Option<String>,
  /// 个人二维码
  #[graphql(skip)]
  pub qr_code_like: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<String>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl_like: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for WxwUsrSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwUsrSearch");
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
    // 企微应用
    if let Some(ref wxw_app_id) = self.wxw_app_id {
      item = item.field("wxw_app_id", wxw_app_id);
    }
    if let Some(ref wxw_app_id_is_null) = self.wxw_app_id_is_null {
      item = item.field("wxw_app_id_is_null", wxw_app_id_is_null);
    }
    // 企业ID
    if let Some(ref corpid) = self.corpid {
      item = item.field("corpid", corpid);
    }
    if let Some(ref corpid_like) = self.corpid_like {
      item = item.field("corpid_like", corpid_like);
    }
    // 应用ID
    if let Some(ref agentid) = self.agentid {
      item = item.field("agentid", agentid);
    }
    if let Some(ref agentid_like) = self.agentid_like {
      item = item.field("agentid_like", agentid_like);
    }
    // 姓名
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 用户ID
    if let Some(ref userid) = self.userid {
      item = item.field("userid", userid);
    }
    if let Some(ref userid_like) = self.userid_like {
      item = item.field("userid_like", userid_like);
    }
    // 手机号
    if let Some(ref mobile) = self.mobile {
      item = item.field("mobile", mobile);
    }
    if let Some(ref mobile_like) = self.mobile_like {
      item = item.field("mobile_like", mobile_like);
    }
    // 性别
    if let Some(ref gender) = self.gender {
      item = item.field("gender", gender);
    }
    if let Some(ref gender_like) = self.gender_like {
      item = item.field("gender_like", gender_like);
    }
    // 邮箱
    if let Some(ref email) = self.email {
      item = item.field("email", email);
    }
    if let Some(ref email_like) = self.email_like {
      item = item.field("email_like", email_like);
    }
    // 企业邮箱
    if let Some(ref biz_email) = self.biz_email {
      item = item.field("biz_email", biz_email);
    }
    if let Some(ref biz_email_like) = self.biz_email_like {
      item = item.field("biz_email_like", biz_email_like);
    }
    // 直属上级
    if let Some(ref direct_leader) = self.direct_leader {
      item = item.field("direct_leader", direct_leader);
    }
    if let Some(ref direct_leader_like) = self.direct_leader_like {
      item = item.field("direct_leader_like", direct_leader_like);
    }
    // 职位
    if let Some(ref position) = self.position {
      item = item.field("position", position);
    }
    if let Some(ref position_like) = self.position_like {
      item = item.field("position_like", position_like);
    }
    // 头像
    if let Some(ref avatar) = self.avatar {
      item = item.field("avatar", avatar);
    }
    if let Some(ref avatar_like) = self.avatar_like {
      item = item.field("avatar_like", avatar_like);
    }
    // 头像缩略图
    if let Some(ref thumb_avatar) = self.thumb_avatar {
      item = item.field("thumb_avatar", thumb_avatar);
    }
    if let Some(ref thumb_avatar_like) = self.thumb_avatar_like {
      item = item.field("thumb_avatar_like", thumb_avatar_like);
    }
    // 个人二维码
    if let Some(ref qr_code) = self.qr_code {
      item = item.field("qr_code", qr_code);
    }
    if let Some(ref qr_code_like) = self.qr_code_like {
      item = item.field("qr_code_like", qr_code_like);
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
    if let Some(ref update_usr_id_is_null) = self.update_usr_id_is_null {
      item = item.field("update_usr_id_is_null", update_usr_id_is_null);
    }
    // 更新时间
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
    }
    item.finish()
  }
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwUsrInput")]
#[allow(dead_code)]
pub struct WxwUsrInput {
  /// ID
  pub id: Option<WxwUsrId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: Option<WxwAppId>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: Option<String>,
  /// 企业ID
  #[graphql(skip)]
  pub corpid: Option<String>,
  /// 应用ID
  #[graphql(skip)]
  pub agentid: Option<String>,
  /// 姓名
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 用户ID
  #[graphql(name = "userid")]
  pub userid: Option<String>,
  /// 手机号
  #[graphql(skip)]
  pub mobile: Option<String>,
  /// 性别
  #[graphql(skip)]
  pub gender: Option<String>,
  /// 邮箱
  #[graphql(skip)]
  pub email: Option<String>,
  /// 企业邮箱
  #[graphql(skip)]
  pub biz_email: Option<String>,
  /// 直属上级
  #[graphql(skip)]
  pub direct_leader: Option<String>,
  /// 职位
  #[graphql(skip)]
  pub position: Option<String>,
  /// 头像
  #[graphql(skip)]
  pub avatar: Option<String>,
  /// 头像缩略图
  #[graphql(skip)]
  pub thumb_avatar: Option<String>,
  /// 个人二维码
  #[graphql(skip)]
  pub qr_code: Option<String>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<String>,
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

impl From<WxwUsrModel> for WxwUsrInput {
  fn from(model: WxwUsrModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 企微应用
      wxw_app_id: model.wxw_app_id.into(),
      wxw_app_id_lbl: model.wxw_app_id_lbl.into(),
      // 企业ID
      corpid: model.corpid.into(),
      // 应用ID
      agentid: model.agentid.into(),
      // 姓名
      lbl: model.lbl.into(),
      // 用户ID
      userid: model.userid.into(),
      // 手机号
      mobile: model.mobile.into(),
      // 性别
      gender: model.gender.into(),
      // 邮箱
      email: model.email.into(),
      // 企业邮箱
      biz_email: model.biz_email.into(),
      // 直属上级
      direct_leader: model.direct_leader.into(),
      // 职位
      position: model.position.into(),
      // 头像
      avatar: model.avatar.into(),
      // 头像缩略图
      thumb_avatar: model.thumb_avatar.into(),
      // 个人二维码
      qr_code: model.qr_code.into(),
      // 备注
      rem: model.rem.into(),
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

impl From<WxwUsrInput> for WxwUsrSearch {
  fn from(input: WxwUsrInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 企微应用
      wxw_app_id: input.wxw_app_id.map(|x| vec![x]),
      // 企业ID
      corpid: input.corpid,
      // 应用ID
      agentid: input.agentid,
      // 姓名
      lbl: input.lbl,
      // 用户ID
      userid: input.userid,
      // 手机号
      mobile: input.mobile,
      // 性别
      gender: input.gender,
      // 邮箱
      email: input.email,
      // 企业邮箱
      biz_email: input.biz_email,
      // 直属上级
      direct_leader: input.direct_leader,
      // 职位
      position: input.position,
      // 头像
      avatar: input.avatar,
      // 头像缩略图
      thumb_avatar: input.thumb_avatar,
      // 个人二维码
      qr_code: input.qr_code,
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
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct WxwUsrId(SmolStr);

impl fmt::Display for WxwUsrId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "WxwUsrId")]
impl async_graphql::ScalarType for WxwUsrId {
  fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
    match value {
      async_graphql::Value::String(s) => Ok(Self(s.into())),
      _ => Err(async_graphql::InputValueError::expected_type(value)),
    }
  }
  
  fn to_value(&self) -> async_graphql::Value {
    async_graphql::Value::String(self.0.clone().into())
  }
}

impl From<WxwUsrId> for ArgType {
  fn from(value: WxwUsrId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&WxwUsrId> for ArgType {
  fn from(value: &WxwUsrId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<WxwUsrId> for SmolStr {
  fn from(id: WxwUsrId) -> Self {
    id.0
  }
}

impl From<SmolStr> for WxwUsrId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for WxwUsrId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for WxwUsrId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for WxwUsrId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for WxwUsrId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for WxwUsrId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for WxwUsrId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for WxwUsrId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for WxwUsrId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 企微用户 检测字段是否允许前端排序
pub fn check_sort_wxw_usr(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wxw_usr = get_can_sort_in_api_wxw_usr();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wxw_usr.contains(&prop) {
      return Err(eyre!("check_sort_wxw_usr: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_wxw_usr() -> String {
  "/wxwork/wxw_usr".to_owned()
}
