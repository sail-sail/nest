use serde::{
  Serialize,
  Deserialize,
};

use async_graphql::{
  InputObject,
  SimpleObject,
};

use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::base::org::org_model::OrgId;

#[derive(InputObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginInput {
  
  /// 用户名
  pub username: String,
  
  /// 密码
  pub password: String,
  
  /// 租户ID
  pub tenant_id: TenantId,
  
  /// 组织ID
  pub org_id: Option<OrgId>,
  
  /// 语言
  pub lang: String,
  
}

#[derive(InputObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "camelCase")]
pub struct ChangePasswordInput {
  
  /// 旧密码
  pub old_password: String,
  
  /// 新密码
  pub password: String,
  
  /// 确认密码
  pub confirm_password: String,
  
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct Login {
  
  pub authorization: String,
  pub org_id: OrgId,
  
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfo {
  
  pub lbl: String,
  pub username: String,
  pub lang: String,
  pub org_id: Option<OrgId>,
  pub org_id_models: Vec<GetLoginInfoorgIdModel>,
  
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfoorgIdModel {
  
  pub id: OrgId,
  pub lbl: String,
  
}
