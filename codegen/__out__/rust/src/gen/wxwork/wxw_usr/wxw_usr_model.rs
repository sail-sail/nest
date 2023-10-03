use serde::{
  Serialize,
  Deserialize,
};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

use async_graphql::{
  SimpleObject,
  InputObject,
};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrModel {
  /// 租户ID
  pub tenant_id: String,
  /// ID
  pub id: String,
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
    let id: String = row.try_get("id")?;
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
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrFieldComment {
  /// ID
  pub id: String,
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
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
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
  pub mobile: Option<String>,
  /// 手机号
  pub mobile_like: Option<String>,
  /// 性别
  pub gender: Option<String>,
  /// 性别
  pub gender_like: Option<String>,
  /// 邮箱
  pub email: Option<String>,
  /// 邮箱
  pub email_like: Option<String>,
  /// 企业邮箱
  pub biz_email: Option<String>,
  /// 企业邮箱
  pub biz_email_like: Option<String>,
  /// 直属上级
  pub direct_leader: Option<String>,
  /// 直属上级
  pub direct_leader_like: Option<String>,
  /// 职位
  pub position: Option<String>,
  /// 职位
  pub position_like: Option<String>,
  /// 头像
  pub avatar: Option<String>,
  /// 头像
  pub avatar_like: Option<String>,
  /// 头像缩略图
  pub thumb_avatar: Option<String>,
  /// 头像缩略图
  pub thumb_avatar_like: Option<String>,
  /// 个人二维码
  pub qr_code: Option<String>,
  /// 个人二维码
  pub qr_code_like: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwUsrInput {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  /// ID
  pub id: Option<String>,
  /// 姓名
  pub lbl: Option<String>,
  /// 用户ID
  pub userid: Option<String>,
  /// 手机号
  pub mobile: Option<String>,
  /// 性别
  pub gender: Option<String>,
  /// 邮箱
  pub email: Option<String>,
  /// 企业邮箱
  pub biz_email: Option<String>,
  /// 直属上级
  pub direct_leader: Option<String>,
  /// 职位
  pub position: Option<String>,
  /// 头像
  pub avatar: Option<String>,
  /// 头像缩略图
  pub thumb_avatar: Option<String>,
  /// 个人二维码
  pub qr_code: Option<String>,
  /// 备注
  pub rem: Option<String>,
}

impl From<WxwUsrInput> for WxwUsrSearch {
  fn from(input: WxwUsrInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      // 住户ID
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
