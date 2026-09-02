use serde::{Serialize, Deserialize};

use async_graphql::SimpleObject;

#[derive(Serialize, Deserialize)]
pub struct GetuserRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: String,
  #[serde(default)]
  pub userid: String,
  #[serde(default)]
  pub name: String,
  #[serde(default)]
  pub department: Vec<i32>,
  #[serde(default)]
  pub position: String,
  #[serde(default)]
  pub status: i32,
  #[serde(default)]
  pub isleader: i32,
  #[serde(default)]
  pub telephone: String,
  #[serde(default)]
  pub enable: i32,
  #[serde(default)]
  pub hide_mobile: i32,
  #[serde(default)]
  pub order: Vec<i32>,
  #[serde(default)]
  pub main_department: i32,
  #[serde(default)]
  pub alias: String,
  #[serde(default)]
  pub is_leader_in_dept: Vec<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct GetuserinfoModel {
  #[serde(default)]
  pub userid: String,
  #[serde(default)]
  pub user_ticket: String,
}

/**
 * errcode 返回码
 * errmsg 对返回码的文本描述内容
 * userid 成员UserID
 * gender 性别。0表示未定义，1表示男性，2表示女性。仅在用户同意snsapi_privateinfo授权时返回真实值，否则返回0.
 * avatar 头像url。仅在用户同意snsapi_privateinfo授权时返回真实头像，否则返回默认头像
 * qr_code 员工个人二维码（扫描可添加为外部联系人），仅在用户同意snsapi_privateinfo授权时返回
 * mobile 手机，仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 * email 邮箱，仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 * biz_mail 企业邮箱，仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 * address 仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 */
#[derive(Serialize, Deserialize)]
pub struct GetuserDetailRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: String,
  #[serde(default)]
  pub userid: String,
  #[serde(default)]
  pub gender: i32,
  #[serde(default)]
  pub avatar: String,
  #[serde(default)]
  pub qr_code: String,
  #[serde(default)]
  pub mobile: String,
  #[serde(default)]
  pub email: String,
  #[serde(default)]
  pub biz_mail: String,
  #[serde(default)]
  pub address: String,
}

#[derive(Serialize, Deserialize)]
pub struct GetJsapiTicketRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: String,
  #[serde(default)]
  pub ticket: String,
  #[serde(default)]
  pub expires_in: u32,
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwGetConfigSignature {
  pub timestamp: String,
  #[graphql(name = "nonceStr")]
  pub nonce_str: String,
  pub signature: String,
}
