use serde::{
  Serialize,
  Deserialize,
};

use async_graphql::{
  InputObject,
  SimpleObject,
};

use smol_str::SmolStr;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::org::org_model::OrgId;
use crate::base::usr::usr_model::UsrId;

#[derive(InputObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginInput {
  /// 用户名
  pub username: SmolStr,
  /// 密码
  pub password: SmolStr,
  /// 租户ID
  pub tenant_id: TenantId,
  /// 组织ID
  pub org_id: Option<OrgId>,
}

#[derive(InputObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "camelCase")]
pub struct ChangePasswordInput {
  /// 旧密码
  pub old_password: SmolStr,
  /// 新密码
  pub password: SmolStr,
  /// 确认密码
  pub confirm_password: SmolStr,
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginModel {
  pub usr_id: UsrId,
  pub username: SmolStr,
  pub tenant_id: TenantId,
  pub authorization: SmolStr,
  pub org_id: Option<OrgId>,
  pub lang: SmolStr,
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfo {
  pub lbl: SmolStr,
  pub username: SmolStr,
  pub role_codes: Vec<SmolStr>,
  pub lang: Option<SmolStr>,
  pub tenant_id: TenantId,
  pub org_id: Option<OrgId>,
  pub org_id_models: Vec<GetLoginInfoorgIdModel>,
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfoorgIdModel {
  pub id: OrgId,
  pub lbl: SmolStr,
}
