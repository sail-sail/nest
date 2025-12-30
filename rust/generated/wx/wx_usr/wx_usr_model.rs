#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
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

#[allow(unused_imports)]
use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;
use crate::common::id::{Id, impl_id};

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WX_USR: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 小程序用户 前端允许排序的字段
fn get_can_sort_in_api_wx_usr() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_WX_USR.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxUsrModel")]
#[allow(dead_code)]
pub struct WxUsrModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxUsrId,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 用户
  #[graphql(name = "usr_id")]
  pub usr_id: UsrId,
  /// 用户
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 昵称
  #[graphql(name = "nick_name")]
  pub nick_name: String,
  /// 头像
  #[graphql(name = "avatar_img")]
  pub avatar_img: String,
  /// 手机
  #[graphql(name = "mobile")]
  pub mobile: String,
  /// 小程序用户唯一标识
  #[graphql(name = "openid")]
  pub openid: String,
  /// 用户统一标识
  #[graphql(name = "unionid")]
  pub unionid: String,
  /// 性别
  #[graphql(name = "gender")]
  pub gender: i32,
  /// 性别
  #[graphql(name = "gender_lbl")]
  pub gender_lbl: String,
  /// 城市
  #[graphql(name = "city")]
  pub city: String,
  /// 省份
  #[graphql(name = "province")]
  pub province: String,
  /// 国家
  #[graphql(name = "country")]
  pub country: String,
  /// 语言
  #[graphql(name = "language")]
  pub language: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
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

impl FromRow<'_, MySqlRow> for WxUsrModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxUsrId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 用户
    let usr_id: UsrId = row.try_get("usr_id")?;
    let usr_id_lbl: Option<String> = row.try_get("usr_id_lbl")?;
    let usr_id_lbl = usr_id_lbl.unwrap_or_default();
    // 开发者ID
    let appid: String = row.try_get("appid")?;
    // 昵称
    let nick_name: String = row.try_get("nick_name")?;
    // 头像
    let avatar_img: String = row.try_get("avatar_img")?;
    // 手机
    let mobile: String = row.try_get("mobile")?;
    // 小程序用户唯一标识
    let openid: String = row.try_get("openid")?;
    // 用户统一标识
    let unionid: String = row.try_get("unionid")?;
    // 性别
    let gender: i32 = row.try_get("gender")?;
    let gender_lbl: String = gender.to_string();
    // 城市
    let city: String = row.try_get("city")?;
    // 省份
    let province: String = row.try_get("province")?;
    // 国家
    let country: String = row.try_get("country")?;
    // 语言
    let language: String = row.try_get("language")?;
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
      lbl,
      usr_id,
      usr_id_lbl,
      appid,
      nick_name,
      avatar_img,
      mobile,
      openid,
      unionid,
      gender,
      gender_lbl,
      city,
      province,
      country,
      language,
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
#[graphql(rename_fields = "snake_case", name = "WxUsrFieldComment")]
#[allow(dead_code)]
pub struct WxUsrFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 用户
  #[graphql(name = "usr_id")]
  pub usr_id: String,
  /// 用户
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 昵称
  #[graphql(name = "nick_name")]
  pub nick_name: String,
  /// 头像
  #[graphql(name = "avatar_img")]
  pub avatar_img: String,
  /// 手机
  #[graphql(name = "mobile")]
  pub mobile: String,
  /// 小程序用户唯一标识
  #[graphql(name = "openid")]
  pub openid: String,
  /// 用户统一标识
  #[graphql(name = "unionid")]
  pub unionid: String,
  /// 性别
  #[graphql(name = "gender")]
  pub gender: String,
  /// 性别
  #[graphql(name = "gender_lbl")]
  pub gender_lbl: String,
  /// 城市
  #[graphql(name = "city")]
  pub city: String,
  /// 省份
  #[graphql(name = "province")]
  pub province: String,
  /// 国家
  #[graphql(name = "country")]
  pub country: String,
  /// 语言
  #[graphql(name = "language")]
  pub language: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 创建人
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
  /// 更新人
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
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "WxUsrSearch")]
#[allow(dead_code)]
pub struct WxUsrSearch {
  /// ID
  pub id: Option<WxUsrId>,
  /// ID列表
  pub ids: Option<Vec<WxUsrId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 用户
  #[graphql(name = "usr_id")]
  pub usr_id: Option<Vec<UsrId>>,
  /// 用户
  #[graphql(name = "usr_id_save_null")]
  pub usr_id_is_null: Option<bool>,
  /// 用户
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: Option<Vec<String>>,
  /// 用户
  #[graphql(name = "usr_id_lbl_like")]
  pub usr_id_lbl_like: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid_like")]
  pub appid_like: Option<String>,
  /// 昵称
  #[graphql(skip)]
  pub nick_name: Option<String>,
  /// 昵称
  #[graphql(skip)]
  pub nick_name_like: Option<String>,
  /// 头像
  #[graphql(skip)]
  pub avatar_img: Option<String>,
  /// 头像
  #[graphql(skip)]
  pub avatar_img_like: Option<String>,
  /// 手机
  #[graphql(skip)]
  pub mobile: Option<String>,
  /// 手机
  #[graphql(skip)]
  pub mobile_like: Option<String>,
  /// 小程序用户唯一标识
  #[graphql(skip)]
  pub openid: Option<String>,
  /// 小程序用户唯一标识
  #[graphql(skip)]
  pub openid_like: Option<String>,
  /// 用户统一标识
  #[graphql(skip)]
  pub unionid: Option<String>,
  /// 用户统一标识
  #[graphql(skip)]
  pub unionid_like: Option<String>,
  /// 性别
  #[graphql(skip)]
  pub gender: Option<Vec<i32>>,
  /// 城市
  #[graphql(skip)]
  pub city: Option<String>,
  /// 城市
  #[graphql(skip)]
  pub city_like: Option<String>,
  /// 省份
  #[graphql(skip)]
  pub province: Option<String>,
  /// 省份
  #[graphql(skip)]
  pub province_like: Option<String>,
  /// 国家
  #[graphql(skip)]
  pub country: Option<String>,
  /// 国家
  #[graphql(skip)]
  pub country_like: Option<String>,
  /// 语言
  #[graphql(skip)]
  pub language: Option<String>,
  /// 语言
  #[graphql(skip)]
  pub language_like: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<String>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
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
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(name = "update_usr_id_save_null")]
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
}

impl std::fmt::Debug for WxUsrSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxUsrSearch");
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
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 用户
    if let Some(ref usr_id) = self.usr_id {
      item = item.field("usr_id", usr_id);
    }
    if let Some(ref usr_id_lbl) = self.usr_id_lbl {
      item = item.field("usr_id_lbl", usr_id_lbl);
    }
    if let Some(ref usr_id_lbl_like) = self.usr_id_lbl_like {
      item = item.field("usr_id_lbl_like", usr_id_lbl_like);
    }
    if let Some(ref usr_id_is_null) = self.usr_id_is_null {
      item = item.field("usr_id_is_null", usr_id_is_null);
    }
    // 开发者ID
    if let Some(ref appid) = self.appid {
      item = item.field("appid", appid);
    }
    if let Some(ref appid_like) = self.appid_like {
      item = item.field("appid_like", appid_like);
    }
    // 昵称
    if let Some(ref nick_name) = self.nick_name {
      item = item.field("nick_name", nick_name);
    }
    if let Some(ref nick_name_like) = self.nick_name_like {
      item = item.field("nick_name_like", nick_name_like);
    }
    // 头像
    if let Some(ref avatar_img) = self.avatar_img {
      item = item.field("avatar_img", avatar_img);
    }
    if let Some(ref avatar_img_like) = self.avatar_img_like {
      item = item.field("avatar_img_like", avatar_img_like);
    }
    // 手机
    if let Some(ref mobile) = self.mobile {
      item = item.field("mobile", mobile);
    }
    if let Some(ref mobile_like) = self.mobile_like {
      item = item.field("mobile_like", mobile_like);
    }
    // 小程序用户唯一标识
    if let Some(ref openid) = self.openid {
      item = item.field("openid", openid);
    }
    if let Some(ref openid_like) = self.openid_like {
      item = item.field("openid_like", openid_like);
    }
    // 用户统一标识
    if let Some(ref unionid) = self.unionid {
      item = item.field("unionid", unionid);
    }
    if let Some(ref unionid_like) = self.unionid_like {
      item = item.field("unionid_like", unionid_like);
    }
    // 性别
    if let Some(ref gender) = self.gender {
      item = item.field("gender", gender);
    }
    // 城市
    if let Some(ref city) = self.city {
      item = item.field("city", city);
    }
    if let Some(ref city_like) = self.city_like {
      item = item.field("city_like", city_like);
    }
    // 省份
    if let Some(ref province) = self.province {
      item = item.field("province", province);
    }
    if let Some(ref province_like) = self.province_like {
      item = item.field("province_like", province_like);
    }
    // 国家
    if let Some(ref country) = self.country {
      item = item.field("country", country);
    }
    if let Some(ref country_like) = self.country_like {
      item = item.field("country_like", country_like);
    }
    // 语言
    if let Some(ref language) = self.language {
      item = item.field("language", language);
    }
    if let Some(ref language_like) = self.language_like {
      item = item.field("language_like", language_like);
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
    item.finish()
  }
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxUsrInput")]
#[allow(dead_code)]
pub struct WxUsrInput {
  /// ID
  pub id: Option<WxUsrId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 用户
  #[graphql(name = "usr_id")]
  pub usr_id: Option<UsrId>,
  /// 用户
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 昵称
  #[graphql(name = "nick_name")]
  pub nick_name: Option<String>,
  /// 头像
  #[graphql(name = "avatar_img")]
  pub avatar_img: Option<String>,
  /// 手机
  #[graphql(name = "mobile")]
  pub mobile: Option<String>,
  /// 小程序用户唯一标识
  #[graphql(name = "openid")]
  pub openid: Option<String>,
  /// 用户统一标识
  #[graphql(name = "unionid")]
  pub unionid: Option<String>,
  /// 性别
  #[graphql(name = "gender")]
  pub gender: Option<i32>,
  /// 性别
  #[graphql(name = "gender_lbl")]
  pub gender_lbl: Option<String>,
  /// 城市
  #[graphql(name = "city")]
  pub city: Option<String>,
  /// 省份
  #[graphql(name = "province")]
  pub province: Option<String>,
  /// 国家
  #[graphql(name = "country")]
  pub country: Option<String>,
  /// 语言
  #[graphql(name = "language")]
  pub language: Option<String>,
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

impl From<WxUsrModel> for WxUsrInput {
  fn from(model: WxUsrModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 名称
      lbl: model.lbl.into(),
      // 用户
      usr_id: model.usr_id.into(),
      usr_id_lbl: model.usr_id_lbl.into(),
      // 开发者ID
      appid: model.appid.into(),
      // 昵称
      nick_name: model.nick_name.into(),
      // 头像
      avatar_img: model.avatar_img.into(),
      // 手机
      mobile: model.mobile.into(),
      // 小程序用户唯一标识
      openid: model.openid.into(),
      // 用户统一标识
      unionid: model.unionid.into(),
      // 性别
      gender: model.gender.into(),
      gender_lbl: model.gender_lbl.into(),
      // 城市
      city: model.city.into(),
      // 省份
      province: model.province.into(),
      // 国家
      country: model.country.into(),
      // 语言
      language: model.language.into(),
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

impl From<WxUsrInput> for WxUsrSearch {
  fn from(input: WxUsrInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 用户
      usr_id: input.usr_id.map(|x| vec![x]),
      // 开发者ID
      appid: input.appid,
      // 昵称
      nick_name: input.nick_name,
      // 头像
      avatar_img: input.avatar_img,
      // 手机
      mobile: input.mobile,
      // 小程序用户唯一标识
      openid: input.openid,
      // 用户统一标识
      unionid: input.unionid,
      // 性别
      gender: input.gender.map(|x| vec![x]),
      // 城市
      city: input.city,
      // 省份
      province: input.province,
      // 国家
      country: input.country,
      // 语言
      language: input.language,
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

impl_id!(WxUsrId);

/// 小程序用户 检测字段是否允许前端排序
pub fn check_sort_wx_usr(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wx_usr = get_can_sort_in_api_wx_usr();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wx_usr.contains(&prop) {
      return Err(eyre!("check_sort_wx_usr: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wx_usr
pub fn get_page_path_wx_usr() -> &'static str {
  "/wx/wx_usr"
}

// MARK: get_table_name_wx_usr
pub fn get_table_name_wx_usr() -> &'static str {
  "wx_wx_usr"
}
