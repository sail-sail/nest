use serde::{Deserialize, Serialize};
use smol_str::SmolStr;

use crate::r#gen::base::usr::usr_model::UsrId;
use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::base::org::org_model::OrgId;

pub const SECRET_KEY: &str = "38e52379-9e94-467c-8e63-17ad318fc845";
pub const AUTHORIZATION: &str = "authorization";

#[derive(Deserialize, Serialize, Clone, Default)]
pub struct AuthModel {
  pub id: UsrId,
  pub wx_usr_id: Option<SmolStr>,
  pub org_id: Option<OrgId>,
  pub lang: String,
  pub tenant_id: TenantId,
  pub exp: i64,
}

pub type AuthToken = String;

pub type ClientTenantId = TenantId;
