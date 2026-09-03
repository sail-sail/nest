use serde::{Deserialize, Serialize};
use std::sync::LazyLock;

use crate::base::usr::usr_model::UsrId;
use crate::base::tenant::tenant_model::TenantId;
use crate::base::org::org_model::OrgId;

const DEFAULT_SECRET_KEY: &str = "38e52379-9e94-467c-8e63-17ad318fc845";
pub static SECRET_KEY: LazyLock<String> = LazyLock::new(|| {
  dotenv::dotenv().ok();
  std::env::var("server_secret_key").unwrap_or_else(|_| DEFAULT_SECRET_KEY.to_owned())
});
pub const AUTHORIZATION: &str = "authorization";

fn default_lang() -> Option<String> {
  Some("zh-CN".into())
}

#[derive(Deserialize, Serialize, Clone, Default, Debug)]
pub struct AuthModel {
  
  pub id: UsrId,
  
  #[serde(skip_serializing_if = "Option::is_none", default)]
  pub wx_usr_id: Option<String>,
  
  #[serde(skip_serializing_if = "Option::is_none", default)]
  pub org_id: Option<OrgId>,
  
  #[serde(skip_serializing_if = "Option::is_none", default = "default_lang")]
  pub lang: Option<String>,
  
  pub tenant_id: TenantId,
  
  pub exp: i64,
  
}

pub type AuthToken = String;

pub type ClientTenantId = TenantId;
