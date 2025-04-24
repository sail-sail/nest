use serde::{Deserialize, Serialize};
use smol_str::SmolStr;

use crate::base::usr::usr_model::UsrId;
use crate::base::tenant::tenant_model::TenantId;
use crate::base::org::org_model::OrgId;

pub const SECRET_KEY: &str = "38e52379-9e94-467c-8e63-17ad318fc845";
pub const AUTHORIZATION: &str = "authorization";

fn default_lang() -> Option<String> {
  Some("zh-CN".to_string())
}

#[derive(Deserialize, Serialize, Clone, Default)]
pub struct AuthModel {
  
  pub id: UsrId,
  
  #[serde(skip_serializing_if = "Option::is_none", default)]
  pub wx_usr_id: Option<SmolStr>,
  
  #[serde(skip_serializing_if = "Option::is_none", default)]
  pub org_id: Option<OrgId>,
  
  #[serde(skip_serializing_if = "Option::is_none", default = "default_lang")]
  pub lang: Option<String>,
  
  pub tenant_id: TenantId,
  
  pub exp: i64,
  
}

pub type AuthToken = String;

pub type ClientTenantId = TenantId;
