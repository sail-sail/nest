use std::collections::HashMap;
use std::env;
use std::time::{Duration, Instant};

use async_trait::async_trait;
use color_eyre::eyre::{Result, eyre};
use deadpool_redis::{Config, Pool, Runtime, redis};
use rmcp::transport::streamable_http_server::session::store::{
  SessionState,
  SessionStore,
  SessionStoreError,
};
use tokio::sync::RwLock;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum StoreType {
  Memory,
  Redis,
}

#[derive(Clone)]
struct MemorySessionState {
  state: SessionState,
  expires_at: Instant,
}

pub struct RmcpSessionStore {
  store_type: StoreType,
  memory: RwLock<HashMap<String, MemorySessionState>>,
  redis_pool: Option<Pool>,
  session_timeout: Duration,
}

impl RmcpSessionStore {
  pub fn new() -> Self {
    let store_type = store_type();
    let redis_pool = match store_type {
      StoreType::Memory => None,
      StoreType::Redis => Some(init_redis_pool()),
    };
    Self {
      store_type,
      memory: RwLock::new(HashMap::new()),
      redis_pool,
      session_timeout: session_timeout(),
    }
  }

  pub fn session_timeout(&self) -> Duration {
    self.session_timeout
  }

  pub async fn touch(
    &self,
    session_id: &str,
  ) -> Result<()> {
    match self.store_type {
      StoreType::Memory => {
        let mut memory = self.memory.write().await;
        if let Some(record) = memory.get_mut(session_id) {
          record.expires_at = Instant::now() + self.session_timeout;
        }
        Ok(())
      },
      StoreType::Redis => {
        let mut conn = self.redis_conn().await?;
        let _res: i64 = redis::cmd("EXPIRE")
          .arg(session_key(session_id))
          .arg(self.session_timeout.as_secs().max(1))
          .query_async(&mut conn)
          .await?;
        Ok(())
      },
    }
  }

  pub async fn purge(
    &self,
    session_id: &str,
  ) -> Result<()> {
    match self.store_type {
      StoreType::Memory => {
        self.memory.write().await.remove(session_id);
        Ok(())
      },
      StoreType::Redis => {
        let mut conn = self.redis_conn().await?;
        let _res: i64 = redis::cmd("DEL")
          .arg(session_key(session_id))
          .query_async(&mut conn)
          .await?;
        Ok(())
      },
    }
  }

  async fn redis_conn(&self) -> Result<deadpool_redis::Connection> {
    let pool = self.redis_pool.as_ref()
      .ok_or_else(|| eyre!("rmcp session redis pool 未初始化"))?;
    Ok(pool.get().await?)
  }
}

impl Default for RmcpSessionStore {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl SessionStore for RmcpSessionStore {
  async fn load(
    &self,
    session_id: &str,
  ) -> Result<Option<SessionState>, SessionStoreError> {
    let ret = match self.store_type {
      StoreType::Memory => {
        let mut memory = self.memory.write().await;
        let Some(record) = memory.get(session_id).cloned() else {
          return Ok(None);
        };
        if Instant::now() >= record.expires_at {
          memory.remove(session_id);
          return Ok(None);
        }
        Some(record.state)
      },
      StoreType::Redis => {
        let mut conn = self.redis_conn().await?;
        let value: Option<String> = redis::cmd("GET")
          .arg(session_key(session_id))
          .query_async(&mut conn)
          .await?;
        let Some(value) = value else {
          return Ok(None);
        };
        Some(serde_json::from_str::<SessionState>(&value)?)
      },
    };
    Ok(ret)
  }

  async fn store(
    &self,
    session_id: &str,
    state: &SessionState,
  ) -> Result<(), SessionStoreError> {
    match self.store_type {
      StoreType::Memory => {
        self.memory.write().await.insert(
          session_id.to_owned(),
          MemorySessionState {
            state: state.clone(),
            expires_at: Instant::now() + self.session_timeout,
          },
        );
        Ok(())
      },
      StoreType::Redis => {
        let mut conn = self.redis_conn().await?;
        let payload = serde_json::to_string(state)?;
        let _res: String = redis::cmd("SETEX")
          .arg(session_key(session_id))
          .arg(self.session_timeout.as_secs().max(1))
          .arg(payload)
          .query_async(&mut conn)
          .await?;
        Ok(())
      },
    }
  }

  async fn delete(
    &self,
    session_id: &str,
  ) -> Result<(), SessionStoreError> {
    self.purge(session_id).await?;
    Ok(())
  }
}

fn store_type() -> StoreType {
  match env::var("mcp_token_type")
    .unwrap_or_else(|_| "memory".to_owned())
    .trim()
    .to_ascii_lowercase()
    .as_str() {
      "redis" => StoreType::Redis,
      _ => StoreType::Memory,
    }
}

fn session_timeout() -> Duration {
  let sec = env::var("mcp_rmcp_session_timeout")
    .ok()
    .and_then(|value| value.trim().parse::<u64>().ok())
    .filter(|value| *value > 0)
    .unwrap_or(60 * 5);
  Duration::from_secs(sec)
}

fn init_redis_pool() -> Pool {
  let hostname = env::var("mcp_token_redis_hostname")
    .unwrap_or_else(|_| "127.0.0.1".to_owned());
  let username = env::var("mcp_token_redis_username")
    .unwrap_or_default();
  let password = env::var("mcp_token_redis_password")
    .unwrap_or_default();
  let port = env::var("mcp_token_redis_port")
    .unwrap_or_else(|_| "6379".to_owned());
  let db = env::var("mcp_token_redis_db")
    .unwrap_or_else(|_| "0".to_owned());
  let auth_part = if username.is_empty() {
    if password.is_empty() {
      String::new()
    } else {
      format!(":{password}@")
    }
  } else {
    format!("{username}:{password}@")
  };
  let url = format!("redis://{auth_part}{hostname}:{port}/{db}");
  let cfg = Config::from_url(url);
  cfg.create_pool(Some(Runtime::Tokio1))
    .unwrap_or_else(|err| panic!("rmcp session redis pool init failed: {err}"))
}

fn session_key(session_id: &str) -> String {
  format!("mcp:rmcp:session:{session_id}")
}