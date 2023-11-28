
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use serde::{Serialize, Deserialize};

use sqlx::encode::{Encode, IsNull};
use sqlx::MySql;
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

use crate::gen::base::tenant::tenant_model::TenantId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwUsrId,
  /// 姓名
  pub lbl: String,
  /// 用户ID
  pub userid: String,
  /// 手机号
  pub mobile: String,
  /// 性别
  pub gender: String,
  /// 邮箱
  pub email: String,
  /// 企业邮箱
  pub biz_email: String,
  /// 直属上级
  pub direct_leader: String,
  /// 职位
  pub position: String,
  /// 头像
  pub avatar: String,
  /// 头像缩略图
  pub thumb_avatar: String,
  /// 个人二维码
  pub qr_code: String,
  /// 备注
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for WxwUsrModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwUsrId = row.try_get("id")?;
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
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
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
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrFieldComment {
  /// ID
  pub id: String,
  /// 姓名
  pub lbl: String,
  /// 用户ID
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
  pub rem: String,
}

#[derive(InputObject, Default, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrSearch {
  /// ID
  pub id: Option<WxwUsrId>,
  /// ID列表
  pub ids: Option<Vec<WxwUsrId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 姓名
  pub lbl: Option<String>,
  /// 姓名
  pub lbl_like: Option<String>,
  /// 用户ID
  pub userid: Option<String>,
  /// 用户ID
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
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrInput {
  /// ID
  pub id: Option<WxwUsrId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 姓名
  pub lbl: Option<String>,
  /// 用户ID
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
  pub rem: Option<String>,
}

impl From<WxwUsrModel> for WxwUsrInput {
  fn from(model: WxwUsrModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
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
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
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
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}
