use serde::{Serialize, Deserialize};

use async_graphql::SimpleObject;

use smol_str::SmolStr;

#[derive(Serialize, Deserialize)]
pub struct GetuserRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: SmolStr,
  #[serde(default)]
  pub userid: SmolStr,
  #[serde(default)]
  pub name: SmolStr,
  #[serde(default)]
  pub department: Vec<i32>,
  #[serde(default)]
  pub position: SmolStr,
  #[serde(default)]
  pub status: i32,
  #[serde(default)]
  pub isleader: i32,
  #[serde(default)]
  pub telephone: SmolStr,
  #[serde(default)]
  pub enable: i32,
  #[serde(default)]
  pub hide_mobile: i32,
  #[serde(default)]
  pub order: Vec<i32>,
  #[serde(default)]
  pub main_department: i32,
  #[serde(default)]
  pub alias: SmolStr,
  #[serde(default)]
  pub is_leader_in_dept: Vec<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct GetuserinfoModel {
  #[serde(default)]
  pub userid: SmolStr,
  #[serde(default)]
  pub user_ticket: SmolStr,
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
  pub errmsg: SmolStr,
  #[serde(default)]
  pub userid: SmolStr,
  #[serde(default)]
  pub gender: i32,
  #[serde(default)]
  pub avatar: SmolStr,
  #[serde(default)]
  pub qr_code: SmolStr,
  #[serde(default)]
  pub mobile: SmolStr,
  #[serde(default)]
  pub email: SmolStr,
  #[serde(default)]
  pub biz_mail: SmolStr,
  #[serde(default)]
  pub address: SmolStr,
}

#[derive(Serialize, Deserialize)]
pub struct GetJsapiTicketRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: SmolStr,
  #[serde(default)]
  pub ticket: SmolStr,
  #[serde(default)]
  pub expires_in: u32,
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwGetConfigSignature {
  pub timestamp: SmolStr,
  #[graphql(name = "nonceStr")]
  pub nonce_str: SmolStr,
  pub signature: SmolStr,
}
