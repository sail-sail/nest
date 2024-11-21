use std::env;
use anyhow::Result;

use deadpool_redis::{redis, Config, Runtime, Pool};
use tracing::info;

use crate::common::context::get_req_id;

lazy_static! {
  static ref CACHE_POOL: Option<Pool> = init_cache_pool();
}

fn init_cache_pool() -> Option<Pool> {
  let cache_enable = {
    let cache_enable = env::var("cache_enable").unwrap_or("true".to_owned());
    !matches!(cache_enable.trim().to_lowercase().as_str(), "false")
  };
  if !cache_enable {
    return None;
  }
  let cache_hostname = env::var("cache_hostname").unwrap_or("127.0.0.1".to_owned());
  let cache_username = env::var("cache_username").unwrap_or("".to_owned());
  let cache_password = env::var("cache_password").unwrap_or("".to_owned());
  let cache_port = env::var("cache_port").unwrap_or("6379".to_owned());
  let cache_db = env::var("cache_db").unwrap_or("0".to_owned());
  let cache_user = {
    if cache_username.is_empty() {
      "".to_owned()
    } else {
      format!("{}:{}@", cache_username, cache_password)
    }
  };
  let url = format!("redis://{cache_user}{cache_hostname}:{cache_port}/{cache_db}");
  info!("cache: {}", &url);
  let cfg = Config::from_url(url);
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

pub async fn exists(
  cache_key1: &str,
) -> Result<bool> {
  if CACHE_POOL.is_none() {
    return Ok(false);
  }
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let value: bool = redis::cmd("EXISTS")
    .arg(&[cache_key1])
    .query_async(&mut conn).await?;
  Ok(value)
}

#[allow(dead_code)]
pub async fn get(
  cache_key1: &str,
) -> Result<Option<String>> {
  if CACHE_POOL.is_none() {
    return Ok(None);
  }
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let value: Option<String> = redis::cmd("GET")
    .arg(&[cache_key1])
    .query_async(&mut conn).await?;
  Ok(value)
}

pub async fn set(
  cache_key1: &str,
  cache_value: &str,
) -> Result<String> {
  if CACHE_POOL.is_none() {
    return Ok(String::new());
  }
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let res = redis::cmd("SET")
    .arg(&[cache_key1, cache_value])
    .query_async(&mut conn).await?;
  Ok(res)
}

pub async fn set_cache(
  cache_key1: &str,
  cache_key2: &str,
  cache_value: &str,
) -> Result<String> {
  if CACHE_POOL.is_none() {
    return Ok(String::new());
  }
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let res = redis::cmd("HSET")
    .arg(&[cache_key1, cache_key2, cache_value])
    .query_async::<String>(&mut conn).await?;
  Ok(res)
}

pub async fn expire(
  cache_key1: &str,
  expire: u32,
) -> Result<String> {
  if CACHE_POOL.is_none() {
    return Ok(String::new());
  }
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let res = redis::cmd("EXPIRE")
    .arg(&[cache_key1, &expire.to_string()])
    .query_async::<String>(&mut conn).await?;
  Ok(res)
}

pub async fn del_cache(
  cache_key1: &str,
) -> Result<()> {
  if CACHE_POOL.is_none() {
    return Ok(());
  }
  info!("del_cache: {}: {}", get_req_id(), cache_key1);
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  redis::cmd("DEL")
    .arg(&[cache_key1])
    .query_async::<()>(&mut conn).await?;
  Ok(())
}

pub async fn del_caches(
  del_cache_key1s: &[&str],
) -> Result<()> {
  if CACHE_POOL.is_none() {
    return Ok(());
  }
  info!("del_caches: {}: {:?}", get_req_id(), del_cache_key1s);
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let mut pipe: redis::Pipeline = redis::pipe();
  let pipe = pipe.atomic();
  pipe.cmd("DEL").arg(del_cache_key1s).ignore();
  pipe.query_async::<()>(&mut conn).await?;
  Ok(())
}

pub async fn flash_db() -> Result<String> {
  if CACHE_POOL.is_none() {
    return Ok(String::new());
  }
  info!("flash_db: {}", get_req_id());
  let cache_pool = CACHE_POOL.as_ref().unwrap();
  let mut conn = cache_pool.get().await?;
  let res = redis::cmd("FLUSHDB")
    .query_async::<String>(&mut conn).await?;
  Ok(res)
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
