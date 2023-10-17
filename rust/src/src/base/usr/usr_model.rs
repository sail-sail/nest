use serde::{
  Serialize,
  Deserialize,
};

use async_graphql::{
  InputObject,
  SimpleObject,
};

/*
input LoginInput {
  username: String!
  password: String!
  tenant_id: String!
  org_id: String
  lang: String!
}
*/
#[derive(InputObject, Clone, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginInput {
  
  /// 用户名
  pub username: String,
  
  /// 密码
  pub password: String,
  
  /// 租户ID
  pub tenant_id: String,
  
  /// 组织ID
  pub org_id: Option<String>,
  
  /// 语言
  pub lang: String,
  
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct Login {
  
  pub authorization: String,
  pub org_id: String,
  
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfo {
  
  pub lbl: String,
  pub lang: String,
  pub org_id: Option<String>,
  pub org_id_models: Vec<GetLoginInfoorgIdModel>,
  
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfoorgIdModel {
  
  pub id: String,
  pub lbl: String,
  
}
