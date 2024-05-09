use anyhow::Result;

use super::health_dao;

pub async fn health_check() -> Result<()> {
  
  health_dao::health_check().await?;
  
  Ok(())
}
