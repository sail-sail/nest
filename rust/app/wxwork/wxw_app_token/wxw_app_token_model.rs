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
  pub nonce_str: String,
  pub signature: String,
}
