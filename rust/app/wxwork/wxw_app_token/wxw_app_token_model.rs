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
  pub nonce_str: SmolStr,
  pub signature: SmolStr,
}
