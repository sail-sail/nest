use serde::{Deserialize, Serialize};

pub const SECRET_KEY: &str = "38e52379-9e94-467c-8e63-17ad318fc845";
pub const AUTHORIZATION: &str = "authorization";

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct AuthModel {
  pub id: String,
  pub wx_usr_id: Option<String>,
  pub dept_id: Option<String>,
  pub lang: Option<String>,
  pub tenant_id: Option<String>,
  pub exp: i64,
}

pub type AuthToken = String;
