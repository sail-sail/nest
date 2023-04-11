use anyhow::Result;

use deadpool_redis::{redis, Config, Runtime, Pool};
use tracing::info;

lazy_static! {
  static ref CACHE_POOL: Pool = init_cache_pool();
}

fn init_cache_pool() -> Pool {
  let cache_hostname = dotenv!("cache_hostname");
  let cache_port = dotenv!("cache_port");
  let cache_db = dotenv!("cache_db");
  let cfg = Config::from_url(
    format!("redis://{}:{}/{}", cache_hostname, cache_port, cache_db)
  );
  let cache_pool = cfg.create_pool(
    Some(Runtime::Tokio1),
  ).unwrap();
  cache_pool
}

pub async fn get_cache(
  cache_key1: &str,
  cache_key2: &str,
) -> Result<Option<String>> {
  let mut conn = CACHE_POOL.get().await?;
  let value: Option<String> = redis::cmd("HGET")
    .arg(&[cache_key1, cache_key2])
    .query_async(&mut conn).await?;
  Ok(value)
}

pub async fn set_cache(
  cache_key1: &str,
  cache_key2: &str,
  cache_value: &str,
) -> Result<()> {
  let mut conn = CACHE_POOL.get().await?;
  let _: () = redis::cmd("HSET")
    .arg(&[cache_key1, cache_key2, cache_value])
    .query_async(&mut conn).await?;
  Ok(())
}

pub async fn del_cache(
  cache_key1: &str,
) -> Result<()> {
  info!("del_cache: {}", cache_key1);
  let mut conn = CACHE_POOL.get().await?;
  let _: () = redis::cmd("DEL")
    .arg(&[cache_key1])
    .query_async(&mut conn).await?;
  Ok(())
}

#[cfg(test)]
mod tests {
  use super::*;
  
  #[tokio::test]
  async fn test_get_cache() -> Result<()> {
    let value = get_cache("test", "test").await?;
    println!("------value:{:?}", value);
    Ok(())
  }
  
  #[tokio::test]
  async fn test_set_cache() -> Result<()> {
    set_cache("test", "test", "test").await?;
    Ok(())
  }
  
  #[tokio::test]
  async fn test_del_cache() -> Result<()> {
    del_cache("test").await?;
    Ok(())
  }
  
}
