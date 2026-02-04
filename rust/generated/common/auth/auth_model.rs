use serde::{Deserialize, Serialize};

use smol_str::SmolStr;

use crate::base::usr::usr_model::UsrId;
use crate::base::tenant::tenant_model::TenantId;
use crate::base::org::org_model::OrgId;

use crate::wx::wx_usr::wx_usr_model::WxUsrId;
use crate::wx::wxo_usr::wxo_usr_model::WxoUsrId;

pub const SECRET_KEY: &str = "38e52379-9e94-467c-8e63-17ad318fc845";
pub const AUTHORIZATION: &str = "authorization";

fn default_lang() -> Option<SmolStr> {
  Some("zh-CN".into())
}

#[derive(Deserialize, Serialize, Clone, Default)]
pub struct AuthModel {
  
  pub id: UsrId,
  
  #[serde(skip_serializing_if = "Option::is_none", default)]
  pub wx_usr_id: Option<WxUsrId>,
  
  #[serde(skip_serializing_if = "Option::is_none", default)]
  pub wxo_usr_id: Option<WxoUsrId>,
  
  #[serde(skip_serializing_if = "Option::is_none", default)]
  pub org_id: Option<OrgId>,
  
  #[serde(skip_serializing_if = "Option::is_none", default = "default_lang")]
  pub lang: Option<SmolStr>,
  
  pub tenant_id: TenantId,
  
  pub exp: i64,
  
}

pub type AuthToken = SmolStr;

pub type ClientTenantId = TenantId;
