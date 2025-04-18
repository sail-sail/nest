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

/// 通过host获取appid, agentid
#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwGetAppid {
  
  /// 企业微信appid
  pub appid: String,
  
  /// 企业微信agentid
  pub agentid: String,
  
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
  
  /// 用户名
  pub username: String,
  
  /// 姓名
  pub name: String,
  
  /// 租户id
  pub tenant_id: TenantId,
  
  /// 语言
  pub lang: String,
  
}
