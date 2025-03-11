use serde::{
  Serialize,
  Deserialize,
};

use async_graphql::{
  InputObject,
  SimpleObject,
};

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::base::org::org_model::OrgId;
use crate::r#gen::base::usr::usr_model::UsrId;

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
pub struct LoginModel {
  pub usr_id: UsrId,
  pub username: String,
  pub tenant_id: TenantId,
  pub authorization: String,
  pub org_id: Option<OrgId>,
  pub lang: String,
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfo {
  pub lbl: String,
  pub username: String,
  pub lang: Option<String>,
  pub org_id: Option<OrgId>,
  pub org_id_models: Vec<GetLoginInfoorgIdModel>,
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfoorgIdModel {
  pub id: OrgId,
  pub lbl: String,
}
