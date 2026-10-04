use std::collections::HashMap;
use std::env;
use std::sync::OnceLock;
use std::time::{SystemTime, UNIX_EPOCH};

use base64::Engine;
use color_eyre::eyre::{Result, eyre};
use deadpool_redis::{Config, Pool, Runtime, redis};
use generated::common::auth::auth_model::AuthModel;
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use tracing::info;
use uuid::Uuid;

use super::mcp_model::OAuthRegisterInput;

pub const ACCESS_TOKEN_PREFIX: &str = "mcp_at_";
pub const REFRESH_TOKEN_PREFIX: &str = "mcp_rt_";

static OAUTH_STORE: OnceLock<OAuthStore> = OnceLock::new();

pub fn oauth_store() -> &'static OAuthStore {
  OAUTH_STORE.get_or_init(OAuthStore::new)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum OAuthStoreType {
  Memory,
  Redis,
}

pub struct OAuthStore {
  store_type: OAuthStoreType,
  memory: Mutex<OAuthMemoryStore>,
  redis_pool: Option<Pool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OAuthClient {
  pub client_id: String,
  pub client_id_issued_at: i64,
  pub client_name: Option<String>,
  pub redirect_uris: Vec<String>,
  pub grant_types: Vec<String>,
  pub response_types: Vec<String>,
  pub token_endpoint_auth_method: String,
  pub scope: Option<String>,
  pub client_uri: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OAuthAuthorizationCode {
  pub code: String,
  pub client_id: String,
  pub redirect_uri: String,
  pub code_challenge: String,
  pub scopes: Vec<String>,
  pub resource: String,
  pub auth_model: AuthModel,
  pub expires_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OAuthSession {
  pub session_id: String,
  pub client_id: String,
  pub scopes: Vec<String>,
  pub resource: String,
  pub auth_model: AuthModel,
  pub access_token: String,
  pub refresh_token: String,
  pub access_expires_at: i64,
  pub refresh_expires_at: i64,
}

#[derive(Default)]
struct OAuthMemoryStore {
  clients: HashMap<String, OAuthClient>,
  authorization_codes: HashMap<String, OAuthAuthorizationCode>,
  sessions_by_id: HashMap<String, OAuthSession>,
  sessions_by_access_token: HashMap<String, String>,
  sessions_by_refresh_token: HashMap<String, String>,
}

impl OAuthStore {
  fn new() -> Self {
    let store_type = oauth_store_type();
    let redis_pool = match store_type {
      OAuthStoreType::Memory => None,
      OAuthStoreType::Redis => Some(init_redis_pool()),
    };
    info!(
      mcp_token_type = match store_type {
        OAuthStoreType::Memory => "memory",
        OAuthStoreType::Redis => "redis",
      },
      "mcp oauth token store initialized"
    );
    Self {
      store_type,
      memory: Mutex::new(OAuthMemoryStore::default()),
      redis_pool,
    }
  }

  pub async fn register_client(
    &self,
    input: OAuthRegisterInput,
  ) -> Result<OAuthClient> {
    let client = build_client(input);
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        memory.clients.insert(client.client_id.clone(), client.clone());
        Ok(client)
      },
      OAuthStoreType::Redis => {
        self.redis_set_json(
          &client_key(&client.client_id),
          &client,
          None,
        ).await?;
        Ok(client)
      },
    }
  }

  pub async fn get_client(
    &self,
    client_id: &str,
  ) -> Result<Option<OAuthClient>> {
    match self.store_type {
      OAuthStoreType::Memory => {
        let memory = self.memory.lock().await;
        Ok(memory.clients.get(client_id).cloned())
      },
      OAuthStoreType::Redis => {
        self.redis_get_json(&client_key(client_id)).await
      },
    }
  }

  pub async fn ensure_client(
    &self,
    client: OAuthClient,
  ) -> Result<OAuthClient> {
    if let Some(existing) = self.get_client(&client.client_id).await? {
      return Ok(existing);
    }
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        memory.clients.insert(client.client_id.clone(), client.clone());
        Ok(client)
      },
      OAuthStoreType::Redis => {
        self.redis_set_json(
          &client_key(&client.client_id),
          &client,
          None,
        ).await?;
        Ok(client)
      },
    }
  }

  pub async fn create_authorization_code(
    &self,
    client_id: String,
    redirect_uri: String,
    code_challenge: String,
    scopes: Vec<String>,
    resource: String,
    auth_model: AuthModel,
  ) -> Result<OAuthAuthorizationCode> {
    let code = build_authorization_code(
      client_id,
      redirect_uri,
      code_challenge,
      scopes,
      resource,
      auth_model,
    );
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        memory.authorization_codes.insert(code.code.clone(), code.clone());
        Ok(code)
      },
      OAuthStoreType::Redis => {
        let ttl = (code.expires_at - now_sec()).max(1);
        self.redis_set_json(
          &authorization_code_key(&code.code),
          &code,
          Some(ttl),
        ).await?;
        Ok(code)
      },
    }
  }

  pub async fn take_authorization_code(
    &self,
    code: &str,
  ) -> Result<Option<OAuthAuthorizationCode>> {
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        let record = memory.authorization_codes.remove(code);
        Ok(record.filter(|record| now_sec() < record.expires_at))
      },
      OAuthStoreType::Redis => {
        let mut conn = self.redis_conn().await?;
        let key = authorization_code_key(code);
        let (value, _): (Option<String>, i64) = redis::pipe()
          .atomic()
          .cmd("GET")
          .arg(&key)
          .cmd("DEL")
          .arg(&key)
          .query_async(&mut conn)
          .await?;
        let Some(value) = value else {
          return Ok(None);
        };
        let record = serde_json::from_str::<OAuthAuthorizationCode>(&value)?;
        if now_sec() >= record.expires_at {
          return Ok(None);
        }
        Ok(Some(record))
      },
    }
  }

  pub async fn create_session(
    &self,
    client_id: String,
    scopes: Vec<String>,
    resource: String,
    auth_model: AuthModel,
  ) -> Result<OAuthSession> {
    let session = build_session(
      client_id,
      scopes,
      resource,
      auth_model,
    );
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        memory.attach_session(session.clone());
        Ok(session)
      },
      OAuthStoreType::Redis => {
        self.redis_write_session(&session).await?;
        Ok(session)
      },
    }
  }

  pub async fn find_session_by_access_token(
    &self,
    token: &str,
  ) -> Result<Option<OAuthSession>> {
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        Ok(memory.find_session_by_access_token(token))
      },
      OAuthStoreType::Redis => {
        self.redis_find_session_by_access_token(token).await
      },
    }
  }

  pub async fn find_session_by_refresh_token(
    &self,
    token: &str,
  ) -> Result<Option<OAuthSession>> {
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        Ok(memory.find_session_by_refresh_token(token))
      },
      OAuthStoreType::Redis => {
        self.redis_find_session_by_refresh_token(token).await
      },
    }
  }

  pub async fn rotate_session(
    &self,
    session_id: &str,
    scopes: Vec<String>,
    resource: String,
  ) -> Result<Option<OAuthSession>> {
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        Ok(memory.rotate_session(session_id, scopes, resource))
      },
      OAuthStoreType::Redis => {
        self.redis_rotate_session(session_id, scopes, resource).await
      },
    }
  }

  pub async fn revoke_token(
    &self,
    token: &str,
    client_id: Option<&str>,
  ) -> Result<bool> {
    match self.store_type {
      OAuthStoreType::Memory => {
        let mut memory = self.memory.lock().await;
        Ok(memory.revoke_token(token, client_id))
      },
      OAuthStoreType::Redis => {
        self.redis_revoke_token(token, client_id).await
      },
    }
  }

  async fn redis_find_session_by_access_token(
    &self,
    token: &str,
  ) -> Result<Option<OAuthSession>> {
    let Some(session_id) = self.redis_get_string(&access_index_key(token)).await? else {
      return Ok(None);
    };
    let Some(session) = self.redis_get_json::<OAuthSession>(&session_key(&session_id)).await? else {
      let _ = self.redis_delete_key(&access_index_key(token)).await;
      return Ok(None);
    };
    if now_sec() >= session.access_expires_at {
      self.redis_delete_key(&access_index_key(token)).await?;
      return Ok(None);
    }
    if now_sec() >= session.refresh_expires_at {
      self.redis_revoke_session(&session.session_id).await?;
      return Ok(None);
    }
    Ok(Some(session))
  }

  async fn redis_find_session_by_refresh_token(
    &self,
    token: &str,
  ) -> Result<Option<OAuthSession>> {
    let Some(session_id) = self.redis_get_string(&refresh_index_key(token)).await? else {
      return Ok(None);
    };
    let Some(session) = self.redis_get_json::<OAuthSession>(&session_key(&session_id)).await? else {
      let _ = self.redis_delete_key(&refresh_index_key(token)).await;
      return Ok(None);
    };
    if now_sec() >= session.refresh_expires_at {
      self.redis_revoke_session(&session.session_id).await?;
      return Ok(None);
    }
    Ok(Some(session))
  }

  async fn redis_rotate_session(
    &self,
    session_id: &str,
    scopes: Vec<String>,
    resource: String,
  ) -> Result<Option<OAuthSession>> {
    let Some(mut session) = self.redis_get_json::<OAuthSession>(&session_key(session_id)).await? else {
      return Ok(None);
    };
    let old_access_token = session.access_token.clone();
    let old_refresh_token = session.refresh_token.clone();
    let now = now_sec();
    session.scopes = scopes;
    session.resource = resource;
    session.access_token = issue_id("mcp_at");
    session.refresh_token = issue_id("mcp_rt");
    session.access_expires_at = now + access_token_ttl_sec();
    session.refresh_expires_at = now + refresh_token_ttl_sec();
    self.redis_write_session(&session).await?;
    self.redis_delete_key(&access_index_key(&old_access_token)).await?;
    self.redis_delete_key(&refresh_index_key(&old_refresh_token)).await?;
    Ok(Some(session))
  }

  async fn redis_revoke_token(
    &self,
    token: &str,
    client_id: Option<&str>,
  ) -> Result<bool> {
    if let Some(session) = self.redis_find_session_by_access_token(token).await? {
      if client_id.is_none() || client_id == Some(session.client_id.as_str()) {
        return self.redis_revoke_session(&session.session_id).await;
      }
      return Ok(false);
    }
    if let Some(session) = self.redis_find_session_by_refresh_token(token).await? {
      if client_id.is_none() || client_id == Some(session.client_id.as_str()) {
        return self.redis_revoke_session(&session.session_id).await;
      }
      return Ok(false);
    }
    Ok(false)
  }

  async fn redis_revoke_session(
    &self,
    session_id: &str,
  ) -> Result<bool> {
    let Some(session) = self.redis_get_json::<OAuthSession>(&session_key(session_id)).await? else {
      return Ok(false);
    };
    let mut conn = self.redis_conn().await?;
    redis::pipe()
      .atomic()
      .cmd("DEL")
      .arg(session_key(session_id))
      .ignore()
      .cmd("DEL")
      .arg(access_index_key(&session.access_token))
      .ignore()
      .cmd("DEL")
      .arg(refresh_index_key(&session.refresh_token))
      .ignore()
      .query_async::<()>(&mut conn)
      .await?;
    Ok(true)
  }

  async fn redis_write_session(
    &self,
    session: &OAuthSession,
  ) -> Result<()> {
    let session_json = serde_json::to_string(session)?;
    let access_ttl = (session.access_expires_at - now_sec()).max(1);
    let refresh_ttl = (session.refresh_expires_at - now_sec()).max(1);
    let mut conn = self.redis_conn().await?;
    redis::pipe()
      .atomic()
      .cmd("SETEX")
      .arg(session_key(&session.session_id))
      .arg(refresh_ttl)
      .arg(session_json)
      .ignore()
      .cmd("SETEX")
      .arg(access_index_key(&session.access_token))
      .arg(access_ttl)
      .arg(&session.session_id)
      .ignore()
      .cmd("SETEX")
      .arg(refresh_index_key(&session.refresh_token))
      .arg(refresh_ttl)
      .arg(&session.session_id)
      .ignore()
      .query_async::<()>(&mut conn)
      .await?;
    Ok(())
  }

  async fn redis_set_json<T>(
    &self,
    key: &str,
    value: &T,
    ttl_sec: Option<i64>,
  ) -> Result<()>
  where
    T: Serialize,
  {
    let value = serde_json::to_string(value)?;
    let mut conn = self.redis_conn().await?;
    if let Some(ttl_sec) = ttl_sec {
      let _res: String = redis::cmd("SETEX")
        .arg(key)
        .arg(ttl_sec.max(1))
        .arg(value)
        .query_async(&mut conn)
        .await?;
    } else {
      let _res: String = redis::cmd("SET")
        .arg(key)
        .arg(value)
        .query_async(&mut conn)
        .await?;
    }
    Ok(())
  }

  async fn redis_get_json<T>(
    &self,
    key: &str,
  ) -> Result<Option<T>>
  where
    T: for<'de> Deserialize<'de>,
  {
    let Some(value) = self.redis_get_string(key).await? else {
      return Ok(None);
    };
    Ok(Some(serde_json::from_str(&value)?))
  }

  async fn redis_get_string(
    &self,
    key: &str,
  ) -> Result<Option<String>> {
    let mut conn = self.redis_conn().await?;
    let value: Option<String> = redis::cmd("GET")
      .arg(key)
      .query_async(&mut conn)
      .await?;
    Ok(value)
  }

  async fn redis_delete_key(
    &self,
    key: &str,
  ) -> Result<()> {
    let mut conn = self.redis_conn().await?;
    let _res: i64 = redis::cmd("DEL")
      .arg(key)
      .query_async(&mut conn)
      .await?;
    Ok(())
  }

  async fn redis_conn(&self) -> Result<deadpool_redis::Connection> {
    let pool = self.redis_pool.as_ref()
      .ok_or_else(|| eyre!("mcp oauth redis pool 未初始化"))?;
    Ok(pool.get().await?)
  }
}

impl OAuthMemoryStore {
  fn attach_session(
    &mut self,
    session: OAuthSession,
  ) {
    self.sessions_by_access_token.insert(session.access_token.clone(), session.session_id.clone());
    self.sessions_by_refresh_token.insert(session.refresh_token.clone(), session.session_id.clone());
    self.sessions_by_id.insert(session.session_id.clone(), session);
  }

  fn find_session_by_access_token(
    &mut self,
    token: &str,
  ) -> Option<OAuthSession> {
    let session_id = self.sessions_by_access_token.get(token)?.clone();
    let session = self.sessions_by_id.get(&session_id)?.clone();
    if now_sec() >= session.access_expires_at {
      self.sessions_by_access_token.remove(token);
      return None;
    }
    if now_sec() >= session.refresh_expires_at {
      self.revoke_session(&session.session_id);
      return None;
    }
    Some(session)
  }

  fn find_session_by_refresh_token(
    &mut self,
    token: &str,
  ) -> Option<OAuthSession> {
    let session_id = self.sessions_by_refresh_token.get(token)?.clone();
    let session = self.sessions_by_id.get(&session_id)?.clone();
    if now_sec() >= session.refresh_expires_at {
      self.revoke_session(&session.session_id);
      return None;
    }
    Some(session)
  }

  fn rotate_session(
    &mut self,
    session_id: &str,
    scopes: Vec<String>,
    resource: String,
  ) -> Option<OAuthSession> {
    let session = self.sessions_by_id.get_mut(session_id)?;
    self.sessions_by_access_token.remove(&session.access_token);
    self.sessions_by_refresh_token.remove(&session.refresh_token);
    let now = now_sec();
    session.scopes = scopes;
    session.resource = resource;
    session.access_token = issue_id("mcp_at");
    session.refresh_token = issue_id("mcp_rt");
    session.access_expires_at = now + access_token_ttl_sec();
    session.refresh_expires_at = now + refresh_token_ttl_sec();
    self.sessions_by_access_token.insert(session.access_token.clone(), session.session_id.clone());
    self.sessions_by_refresh_token.insert(session.refresh_token.clone(), session.session_id.clone());
    Some(session.clone())
  }

  fn revoke_token(
    &mut self,
    token: &str,
    client_id: Option<&str>,
  ) -> bool {
    if let Some(session) = self.find_session_by_access_token(token) {
      if client_id.is_none() || client_id == Some(session.client_id.as_str()) {
        return self.revoke_session(&session.session_id);
      }
      return false;
    }
    if let Some(session) = self.find_session_by_refresh_token(token) {
      if client_id.is_none() || client_id == Some(session.client_id.as_str()) {
        return self.revoke_session(&session.session_id);
      }
      return false;
    }
    false
  }

  fn revoke_session(
    &mut self,
    session_id: &str,
  ) -> bool {
    let Some(session) = self.sessions_by_id.remove(session_id) else {
      return false;
    };
    self.sessions_by_access_token.remove(&session.access_token);
    self.sessions_by_refresh_token.remove(&session.refresh_token);
    true
  }
}

pub fn is_oauth_access_token(token: &str) -> bool {
  token.starts_with(ACCESS_TOKEN_PREFIX)
}

fn oauth_store_type() -> OAuthStoreType {
  match env::var("mcp_token_type")
    .unwrap_or_else(|_| "memory".to_owned())
    .trim()
    .to_ascii_lowercase()
    .as_str() {
      "redis" => OAuthStoreType::Redis,
      _ => OAuthStoreType::Memory,
    }
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
    .unwrap_or_else(|err| panic!("mcp oauth redis pool init failed: {err}"))
}

fn client_key(client_id: &str) -> String {
  format!("mcp:oauth:client:{client_id}")
}

fn authorization_code_key(code: &str) -> String {
  format!("mcp:oauth:code:{code}")
}

fn session_key(session_id: &str) -> String {
  format!("mcp:oauth:session:{session_id}")
}

fn access_index_key(token: &str) -> String {
  format!("mcp:oauth:access:{token}")
}

fn refresh_index_key(token: &str) -> String {
  format!("mcp:oauth:refresh:{token}")
}

fn build_client(input: OAuthRegisterInput) -> OAuthClient {
  OAuthClient {
    client_id: issue_id("mcp_client"),
    client_id_issued_at: now_sec(),
    client_name: input.client_name.filter(|item| !item.trim().is_empty()),
    redirect_uris: input.redirect_uris,
    grant_types: input.grant_types
      .filter(|items| !items.is_empty())
      .unwrap_or_else(|| vec!["authorization_code".to_owned(), "refresh_token".to_owned()]),
    response_types: input.response_types
      .filter(|items| !items.is_empty())
      .unwrap_or_else(|| vec!["code".to_owned()]),
    token_endpoint_auth_method: input.token_endpoint_auth_method
      .filter(|item| !item.trim().is_empty())
      .unwrap_or_else(|| "none".to_owned()),
    scope: input.scope.filter(|item| !item.trim().is_empty()),
    client_uri: input.client_uri.filter(|item| !item.trim().is_empty()),
  }
}

fn build_authorization_code(
  client_id: String,
  redirect_uri: String,
  code_challenge: String,
  scopes: Vec<String>,
  resource: String,
  auth_model: AuthModel,
) -> OAuthAuthorizationCode {
  OAuthAuthorizationCode {
    code: issue_id("mcp_code"),
    client_id,
    redirect_uri,
    code_challenge,
    scopes,
    resource,
    auth_model,
    expires_at: now_sec() + authorization_code_ttl_sec(),
  }
}

fn build_session(
  client_id: String,
  scopes: Vec<String>,
  resource: String,
  auth_model: AuthModel,
) -> OAuthSession {
  let now = now_sec();
  OAuthSession {
    session_id: issue_id("mcp_session"),
    client_id,
    scopes,
    resource,
    auth_model,
    access_token: issue_id("mcp_at"),
    refresh_token: issue_id("mcp_rt"),
    access_expires_at: now + access_token_ttl_sec(),
    refresh_expires_at: now + refresh_token_ttl_sec(),
  }
}

fn issue_id(prefix: &str) -> String {
  let encoded = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(Uuid::new_v4().as_bytes());
  format!("{prefix}_{encoded}")
}

fn now_sec() -> i64 {
  SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap_or_default()
    .as_secs() as i64
}

fn access_token_ttl_sec() -> i64 {
  env_ttl("mcp_oauth_access_token_timeout", 10 * 365 * 24 * 60 * 60)
}

fn refresh_token_ttl_sec() -> i64 {
  env_ttl("mcp_oauth_refresh_token_timeout", 30 * 24 * 60 * 60)
}

fn authorization_code_ttl_sec() -> i64 {
  env_ttl("mcp_oauth_authorization_code_timeout", 5 * 60)
}

fn env_ttl(
  key: &str,
  default_value: i64,
) -> i64 {
  env::var(key)
    .ok()
    .and_then(|value| value.trim().parse::<i64>().ok())
    .filter(|value| *value > 0)
    .unwrap_or(default_value)
}