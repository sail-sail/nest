use anyhow::Result;

use deadpool_redis::{redis, Config, Runtime, Pool};
use tracing::info;

lazy_static! {
  static ref CACHE_POOL: Option<Pool> = init_cache_pool();
}

fn init_cache_pool() -> Option<Pool> {
  let cache_enable = {
    let cache_enable = dotenv!("cache_enable");
    match cache_enable.trim().to_lowercase().as_str() {
      "false" => false,
      _ => true,
    }
  };
  if !cache_enable {
    return None;
  }
  let cache_hostname = dotenv!("cache_hostname");
  let cache_port = dotenv!("cache_port");
  let cache_db = dotenv!("cache_db");
  let cfg = Config::from_url(
    format!("redis://{}:{}/{}", cache_hostname, cache_port, cache_db)
  );
  let cache_pool: Pool = cfg.create_pool(
    Some(Runtime::Tokio1),
  ).unwrap();
  cache_pool.into()
}

pub async fn get_cache(
  cache_key1: &str,
  cache_key2: &str,
) -> Result<Option<String>> {
  if CACHE_POOL.is_none() {
    return Ok(None);
  }
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
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
  if CACHE_POOL.is_none() {
    return Ok(());
  }
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let _: () = redis::cmd("HSET")
    .arg(&[cache_key1, cache_key2, cache_value])
    .query_async(&mut conn).await?;
  Ok(())
}

pub async fn del_cache(
  cache_key1: &str,
) -> Result<()> {
  if CACHE_POOL.is_none() {
    return Ok(());
  }
  info!("del_cache: {}", cache_key1);
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let _ = redis::cmd("DEL")
    .arg(&[cache_key1])
    .query_async(&mut conn).await?;
  Ok(())
}

pub async fn del_caches(
  del_cache_key1s: &Vec<String>,
) -> Result<()> {
  if CACHE_POOL.is_none() {
    return Ok(());
  }
  info!("del_caches: {:?}", del_cache_key1s);
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let mut pipe: redis::Pipeline = redis::pipe();
  let mut pipe = pipe.atomic();
  for del_cache_key1 in del_cache_key1s {
    pipe = pipe.cmd("DEL").arg(&[del_cache_key1]).ignore();
  }
  let _ = pipe.query_async(&mut conn).await?;
  Ok(())
}

pub async fn flash_db() -> Result<()> {
  if CACHE_POOL.is_none() {
    return Ok(());
  }
  info!("flash_db");
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let _ = redis::cmd("FLUSHDB")
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
  
  #[tokio::test]
  async fn test_flash_db() -> Result<()> {
    flash_db().await?;
    Ok(())
  }
  
}
