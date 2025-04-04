use serde::{Serialize, Deserialize};

use async_graphql::{
  InputObject,
  Enum,
};

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
pub struct GetAccessTokenModel {
  #[serde(default)]
  pub access_token: String,
  #[serde(default)]
  pub expires_in: u32,
  pub errcode: Option<i32>,
  pub errmsg: Option<String>,
}

#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum GetwxacodeunlimitEnvVersion {
  /// 开发版
  #[graphql(name="develop")]
  #[serde(rename = "develop")]
  Develop,
  /// 体验版
  #[graphql(name="trial")]
  #[serde(rename = "trial")]
  Trial,
  /// 正式版
  #[default]
  #[graphql(name="release")]
  #[serde(rename = "release")]
  Release,
}

#[derive(
  InputObject,
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct GetwxacodeunlimitLineColor {
  pub r: u8,
  pub g: u8,
  pub b: u8,
}

#[derive(
  InputObject,
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct GetwxacodeunlimitInput {
  pub scene: String,
  pub page: Option<String>,
  pub check_path: Option<bool>,
  pub env_version: Option<GetwxacodeunlimitEnvVersion>,
  pub width: Option<u32>,
  pub auto_color: Option<bool>,
  pub line_color: Option<GetwxacodeunlimitLineColor>,
  pub is_hyaline: Option<bool>,
}
