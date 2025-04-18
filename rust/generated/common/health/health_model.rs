use serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(
  FromRow,
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct HealthCheckModel {
  pub a: i64,
}
