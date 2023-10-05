use serde::{
  Serialize,
  Deserialize,
};

use async_graphql::{
  InputObject,
  SimpleObject,
};

#[derive(InputObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwLoginByCodeInput {
  
  /// 企业号id
  pub corpid: String,
  
  /// 应用id
  pub agentid: String,
  
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
  pub org_id: Option<String>,
  
  /// 用户名
  pub username: String,
  
  /// 姓名
  pub name: String,
  
  /// 租户id
  pub tenant_id: String,
  
  /// 语言
  pub lang: String,
  
}
