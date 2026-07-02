use serde::{Serialize, Deserialize};
use sqlx::FromRow;

use crate::base::org::org_model::OrgId;

#[derive(Debug, Default, Clone, Serialize, Deserialize, FromRow)]
pub struct OrgIdModel {
  pub id: OrgId,
}
