use color_eyre::eyre::{Result,eyre};

use super::super::context::query_one;

use super::health_model::HealthCheckModel;

static SQL: &str = "select 1 a";

pub async fn health_check() -> Result<()> {
  
  let res = query_one::<HealthCheckModel>(
    SQL.to_owned(),
    vec![],
    None,
  ).await?;
  
  if res.is_none() || res.unwrap().a != 1 {
    return Err(eyre!("health check failed"));
  }
  
  Ok(())
}
