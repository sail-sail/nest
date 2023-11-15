use serde::{Deserialize, Serialize};

use crate::common::id::ID;

pub const SECRET_KEY: &str = "38e52379-9e94-467c-8e63-17ad318fc845";
pub const AUTHORIZATION: &str = "authorization";

#[derive(Deserialize, Serialize, Clone, Default)]
pub struct AuthModel {
  pub id: ID,
  pub wx_usr_id: Option<ID>,
  pub org_id: Option<ID>,
  pub lang: String,
  pub tenant_id: ID,
  pub exp: i64,
}

pub type AuthToken = String;
