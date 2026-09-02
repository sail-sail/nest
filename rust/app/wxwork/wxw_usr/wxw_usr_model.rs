use serde::{
  Serialize,
  Deserialize,
};

use async_graphql::{
  InputObject,
  SimpleObject,
};

use generated::base::org::org_model::OrgId;
use generated::base::tenant::tenant_model::TenantId;
use generated::base::usr::usr_model::UsrId;
use generated::common::usr::usr_model::GetLoginInfoorgIdModel;

/// 通过host获取appid, agentid
#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwGetAppid {
  
  /// 企业微信appid
  pub appid: String,
  
  /// 企业微信agentid
  pub agentid: String,
  
  /// 企业微信授权范围
  pub scope: String,
  
}

#[derive(InputObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwLoginByCodeInput {
  
  /// 域名
  pub host: String,
  
  /// 企业微信登录时获取的code
  pub code: String,
  
  /// 语言
  pub lang: Option<String>,
  
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwLoginByCode {
  
  /// 授权码
  pub authorization: String,
  
  /// 组织id
  pub org_id: Option<OrgId>,
  
  /// 用户id
  pub usr_id: UsrId,
  
  /// 用户名
  pub username: String,
  
  /// 姓名
  pub name: String,
  
  /// 用户展示名
  pub lbl: String,
  
  /// 角色编码
  pub role_codes: Vec<String>,
  
  /// 可用组织
  pub org_id_models: Vec<GetLoginInfoorgIdModel>,
  
  /// 租户id
  pub tenant_id: TenantId,
  
  /// 语言
  pub lang: String,
  
}

#[derive(Deserialize)]
pub struct NotifyQuery {
  #[serde(rename = "msg_signature")]
  pub msg_signature: String,
  #[serde(rename = "timestamp")]
  pub timestamp: String,
  #[serde(rename = "nonce")]
  pub nonce: String,
  #[serde(rename = "echostr")]
  pub echostr: String,
  pub corpid: String,
  pub agentid: String,
}
