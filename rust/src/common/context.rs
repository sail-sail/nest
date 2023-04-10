use anyhow::{Result, anyhow};
use std::fmt::{Debug, Display};
use std::num::ParseIntError;

use async_trait::async_trait;
use chrono::{Local, DateTime};
use base64::{engine::general_purpose, Engine};

use sqlx::mysql::{MySqlConnectOptions, MySqlPoolOptions};
use sqlx::{Pool, MySql, Transaction, Executor};
use tracing::{info, error};

use super::auth::auth_dao::{get_auth_model_by_token, get_token_by_auth_model};
use super::auth::auth_model::AuthModel;
use super::gql::model::SortInput;

lazy_static! {
  static ref SERVER_TOKEN_TIMEOUT: i64 = dotenv!("server_tokentimeout").parse::<i64>().unwrap_or(3600);
  static ref DB_POOL: Pool<MySql> = init_db_pool().unwrap();
}

fn init_db_pool() -> Result<Pool<MySql>> {
  let database_hostname = dotenv!("database_hostname");
  let database_port = dotenv!("database_port");
  let database_port: Result<u16, ParseIntError> = database_port.parse();
  let database_port = database_port.or_else(|_| Ok::<u16, ParseIntError>(3306)).unwrap();
  let database_username = dotenv!("database_username");
  let database_password = dotenv!("database_password");
  let database_database = dotenv!("database_database");
  let database_pool_size = dotenv!("database_pool_size");
  let default_pool_size: u32 = 10;
  let database_pool_size: Result<u32, ParseIntError> = database_pool_size.parse();
  let database_pool_size = database_pool_size.or_else(|_| Ok::<u32, ParseIntError>(default_pool_size)).unwrap();
  let mysql_url = format!("mysql://{database_username}:xxxxx@{database_hostname}:{database_port}/{database_database}");
  
  info!("mysql_url: {}", &mysql_url);
  
  let pool = MySqlPoolOptions::new()
    .max_connections(database_pool_size)
    // .after_connect(|conn, _meta| Box::pin(async move {
    //   sqlx::query("SET NAMES utf8mb4;").execute(conn).await?;
    //   Ok(())
    // }))
    .connect_lazy_with(
      MySqlConnectOptions::new()
        .host(&database_hostname)
        .port(database_port)
        .username(&database_username)
        .password(&database_password)
        .database(&database_database)
    );
  Ok(pool)
}

#[async_trait]
pub trait Ctx<'a> {
  
  fn get_not_verify_token(&self) -> bool;
  
  fn get_is_tran(&self) -> bool;
  
  fn set_is_tran(self, is_tran: bool) -> Self;
  
  fn get_req_id(&self) -> &str;
  
  fn get_auth_model(&mut self) -> Result<Option<AuthModel>>;
  
  fn verify_auth_token(&mut self) -> Result<Option<String>>;
  
  fn set_auth_token(self, auth_token: Option<String>) -> Self;
  
  fn get_auth_token(&self) -> Option<String>;
  
  fn get_tran(&self) -> Option<&Transaction<'a, MySql>>;
  
  fn set_tran(self, tran: Transaction<'a, MySql>) -> Self;
  
  fn get_server_tokentimeout(&self) -> i64;
  
  /// 开启事务
  async fn begin(&mut self) -> Result<()>;
  
  /// 提交事务
  async fn commit(mut self) -> Result<()>;
  
  /// 回滚事务
  async fn rollback(mut self) -> Result<()>;
  
  /// 返回前端数据
  async fn ok<T>(self, res: Result<T>) -> Result<T>
  where
    T: Send,
  ;
  
  /// 执行查询
  async fn execute(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<u64>;
  
  async fn execute_with<
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
  >(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<u64>;
  
  /// 带参数执行查询
  async fn query_with<T, R>(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  ;
  
  /// 执行查询
  async fn query<R>(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  ;
  
  /// 带参数查询一条数据
  async fn query_one_with<T, R>(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<R>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  ;
  
  /// 查询一条数据
  async fn query_one<R>(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<R>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  ;
  
}

#[async_trait]
impl<'a> Ctx<'a> for CtxImpl<'a> {
  
  fn get_not_verify_token(&self) -> bool {
    self.not_verify_token
  }
  
  fn get_is_tran(&self) -> bool {
    self.is_tran
  }
  
  fn set_is_tran(self, is_tran: bool) -> Self {
    let mut self_mut = self;
    self_mut.is_tran = is_tran;
    if is_tran {
      info!("{} is_tran", &self_mut.req_id);
    }
    self_mut
  }
  
  fn get_req_id(&self) -> &str {
    &self.req_id
  }
  
  /// 校验token是否已经过期
  fn verify_auth_token(&mut self) -> Result<Option<String>> {
    let auth_token = self.get_auth_token();
    if auth_token.is_none() {
      return Err(anyhow!("token_empty"));
    }
    let auth_token = auth_token.unwrap();
    let mut auth_model = get_auth_model_by_token(auth_token)?;
    let now = Local::now();
    let server_tokentimeout = self.get_server_tokentimeout();
    let now_sec = now.timestamp_millis() / 1000;
    if now_sec - server_tokentimeout > auth_model.exp {
      if now_sec - server_tokentimeout * 2 > auth_model.exp {
        return Err(anyhow!("refresh_token_expired"));
      }
      auth_model.exp = now_sec + server_tokentimeout;
      let auth_token = get_token_by_auth_model(&auth_model)?;
      self.auth_model = Some(auth_model);
      return Ok(Some(auth_token));
    }
    Ok(None)
  }
  
  fn get_auth_model(
    &mut self,
  ) -> Result<Option<AuthModel>> {
    let auth_model = &self.auth_model;
    if auth_model.is_some() {
      return Ok(auth_model.to_owned());
    }
    let auth_token = self.get_auth_token();
    if auth_token.is_none() {
      return Ok(None);
    }
    let auth_token = auth_token.unwrap();
    let auth_model = get_auth_model_by_token(auth_token)?;
    self.auth_model = Some(auth_model.to_owned());
    Ok(Some(auth_model))
  }
  
  fn set_auth_token(self, auth_token: Option<String>) -> Self {
    let mut self_mut = self;
    self_mut.auth_token = auth_token;
    self_mut
  }
  
  fn get_auth_token(&self) -> Option<String> {
    self.auth_token.clone()
  }
  
  fn get_tran(&self) -> Option<&Transaction<'a, MySql>> {
    self.tran.as_ref()
  }
  
  fn set_tran(self, tran: Transaction<'a, MySql>) -> Self {
    let mut self_mut = self;
    self_mut.tran = Some(tran);
    self_mut
  }
  
  fn get_server_tokentimeout(&self) -> i64 {
    SERVER_TOKEN_TIMEOUT.to_owned()
  }
  
  /// 开启事务
  async fn begin(&mut self) -> Result<()> {
    if self.tran.is_some() {
      return Ok(());
    }
    info!("{} begin;", self.req_id);
    let tran = DB_POOL.clone().begin().await?;
    self.tran = Some(tran);
    Ok(())
  }
  
  /// 提交事务
  async fn commit(mut self) -> Result<()> {
    let tran = self.tran.take();
    if let Some(tran) = tran {
      info!("{} commit;", self.req_id);
      tran.commit().await?;
    }
    Ok(())
  }
  
  /// 回滚事务
  async fn rollback(mut self) -> Result<()> {
    let tran = self.tran.take();
    if let Some(tran) = tran {
      info!("{} rollback;", self.req_id);
      tran.rollback().await?;
    }
    Ok(())
  }
  
  async fn ok<T>(self, res: Result<T>) -> Result<T>
  where
    T: Send,
  {
    if let Err(e) = res {
      self.rollback().await?;
      return Err(e);
    }
    self.commit().await?;
    res
  }
  
  /// 执行查询
  async fn execute(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<u64> {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query(sql);
      if is_debug {
        info!("{} {}", self.req_id, sql);
      }
      let tran = self.tran.as_mut().unwrap();
      let res = tran.execute(query).await
        .map_err(|e| {
          error!("{} {:?}", self.req_id, e);
          anyhow::anyhow!("{:?}", e)
        })?;
      let rows_affected = res.rows_affected();
      return Ok(rows_affected);
    }
    let query = sqlx::query(sql);
    if is_debug {
      info!("{} {}", self.req_id, sql);
    }
    let res = query.execute(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let rows_affected = res.rows_affected();
    Ok(rows_affected)
  }
  
  /// 带参数执行查询
  async fn execute_with<
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
  >(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<u64> {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(format!("'{}'", arg));
          query = query.bind(arg);
        }
        let mut debug_sql = sql.to_string();
        for debug_arg in debug_args {
          debug_sql = debug_sql.replace("?", &debug_arg);
        }
        info!("{} {}", self.req_id, debug_sql);
      } else {
        for arg in args {
          query = query.bind(arg);
        }
      }
      let tran = self.tran.as_mut().unwrap();
      let res = tran.execute(query).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      let rows_affected = res.rows_affected();
      return Ok(rows_affected);
    }
    let mut query = sqlx::query(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg));
        query = query.bind(arg);
      }
      let mut debug_sql = sql.to_string();
      for debug_arg in debug_args {
        debug_sql = debug_sql.replace("?", &debug_arg);
      }
      info!("{} {}", self.req_id, debug_sql);
    } else {
      for arg in args {
        query = query.bind(arg);
      }
    }
    let res = query.execute(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let rows_affected = res.rows_affected();
    Ok(rows_affected)
  }
  
  /// 带参数执行查询
  async fn query_with<T, R>(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(format!("'{}'", arg));
          query = query.bind(arg);
        }
        let mut debug_sql = sql.to_string();
        for debug_arg in debug_args {
          debug_sql = debug_sql.replace("?", &debug_arg);
        }
        // let query_params: sqlformat::QueryParams = sqlformat::QueryParams::Indexed(debug_args);
        // debug_sql = sqlformat::format(debug_sql.as_str(), &query_params, sqlformat::FormatOptions::default());
        info!("{} {}", self.req_id, debug_sql);
      } else {
        for arg in args {
          query = query.bind(arg);
        }
      }
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_all(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg));
        query = query.bind(arg);
      }
      let mut debug_sql = sql.to_string();
      for debug_arg in debug_args {
        debug_sql = debug_sql.replace("?", &debug_arg);
      }
      info!("{} {}", self.req_id, debug_sql);
    } else {
      for arg in args {
        query = query.bind(arg);
      }
    }
    let res = query.fetch_all(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
  
  /// 执行查询
  async fn query<R>(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        info!("{} {}", self.req_id, sql);
      }
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_all(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let query = sqlx::query_as::<_, R>(sql);
    info!("{} {}", self.req_id, sql);
    let res = query.fetch_all(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
  
  /// 带参数查询一条数据
  async fn query_one_with<T, R>(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<R>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(format!("'{}'", arg));
          query = query.bind(arg);
        }
        let mut debug_sql = sql.to_string();
        for debug_arg in debug_args {
          debug_sql = debug_sql.replace("?", &debug_arg);
        }
        info!("{} {}", self.req_id, debug_sql);
      } else {
        for arg in args {
          query = query.bind(arg);
        }
      }
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_one(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg));
        query = query.bind(arg);
      }
      let mut debug_sql = sql.to_string();
      for debug_arg in debug_args {
        debug_sql = debug_sql.replace("?", &debug_arg);
      }
      info!("{} {}", self.req_id, debug_sql);
    } else {
      for arg in args {
        query = query.bind(arg);
      }
    }
    let res = query.fetch_one(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
  
  /// 查询一条数据
  async fn query_one<R>(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<R>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query_as::<_, R>(sql);
      info!("{} {}", self.req_id, sql);
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_one(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      info!("{} {}", self.req_id, sql);
    }
    let res = query.fetch_one(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
  
}

pub struct CtxImpl<'a> {
  
  is_tran: bool,
  
  req_id: String,
  
  tran: Option<Transaction<'a, MySql>>,
  
  not_verify_token: bool,
  
  auth_model: Option<AuthModel>,
  
  auth_token: Option<String>,
  
}

#[derive(Debug)]
pub struct QueryArgs {
  
  pub value: Vec<serde_json::Value>,
  
}

impl QueryArgs {
  
  pub fn new() -> QueryArgs {
    QueryArgs {
      value: Vec::new(),
    }
  }
  
  pub fn push(&mut self, arg: serde_json::Value) -> String {
    let _ = &mut self.value.push(arg);
    String::from("?")
  }
  
}

#[derive(Default, new, Clone)]
pub struct Options {
  
  /** 是否打印sql语句 */
  #[new(value = "true")]
  pub is_debug: bool,
  
  /** 是否开启事务 */
  #[new(default)]
  pub is_tran: Option<bool>,
  
  #[new(default)]
  pub cache_key1: Option<String>,
  
  #[new(default)]
  pub cache_key2: Option<String>,
  
}

impl Options {
  
  #[inline]
  pub fn get_is_tran(&self) -> Option<bool> {
    self.is_tran
  }
  
}

impl<'a> Drop for CtxImpl<'a> {
  
  fn drop(&mut self) {
    if (&(self.tran)).is_some() {
      error!("{} drop; tran is not none", self.req_id);
    }
  }
  
}

impl<'a> CtxImpl<'a> {
  
  pub fn new() -> CtxImpl<'a> {
    let now: DateTime<Local> = Local::now();
    let req_id = now.timestamp_millis().to_string();
    CtxImpl {
      is_tran: false,
      req_id,
      tran: None,
      auth_model: None,
      not_verify_token: false,
      auth_token: None,
    }
  }
  
  /// 开启事务
  pub async fn begin(&mut self) -> Result<()> {
    if self.tran.is_some() {
      return Ok(());
    }
    info!("{} begin;", self.req_id);
    let pool = DB_POOL.clone();
    let tran = pool.begin().await?;
    self.tran = Some(tran);
    Ok(())
  }
  
  /// 提交事务
  pub async fn commit(mut self) -> Result<()> {
    let tran = self.tran.take();
    if let Some(tran) = tran {
      info!("{} commit;", self.req_id);
      tran.commit().await?;
    }
    Ok(())
  }
  
  /// 回滚事务
  pub async fn rollback(mut self) -> Result<()> {
    let tran = self.tran.take();
    if let Some(tran) = tran {
      info!("{} rollback;", self.req_id);
      tran.rollback().await?;
    }
    Ok(())
  }
  
  pub async fn ok<T>(self, res: Result<T>) -> Result<T> {
    if let Err(e) = res {
      self.rollback().await?;
      return Err(e);
    }
    self.commit().await?;
    res
  }
  
  /// 执行查询
  pub async fn execute(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<u64> {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query(sql);
      if is_debug {
        info!("{} {}", self.req_id, sql);
      }
      let tran = self.tran.as_mut().unwrap();
      let res = tran.execute(query).await
        .map_err(|e| {
          error!("{} {:?}", self.req_id, e);
          anyhow::anyhow!("{:?}", e)
        })?;
      let rows_affected = res.rows_affected();
      return Ok(rows_affected);
    }
    let query = sqlx::query(sql);
    if is_debug {
      info!("{} {}", self.req_id, sql);
    }
    let res = query.execute(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let rows_affected = res.rows_affected();
    Ok(rows_affected)
  }
  
  /// 带参数执行查询
  pub async fn execute_with<
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
  >(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<u64> {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(format!("'{}'", arg));
          query = query.bind(arg);
        }
        let mut debug_sql = sql.to_string();
        for debug_arg in debug_args {
          debug_sql = debug_sql.replace("?", &debug_arg);
        }
        info!("{} {}", self.req_id, debug_sql);
      } else {
        for arg in args {
          query = query.bind(arg);
        }
      }
      let tran = self.tran.as_mut().unwrap();
      let res = tran.execute(query).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      let rows_affected = res.rows_affected();
      return Ok(rows_affected);
    }
    let mut query = sqlx::query(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg));
        query = query.bind(arg);
      }
      let mut debug_sql = sql.to_string();
      for debug_arg in debug_args {
        debug_sql = debug_sql.replace("?", &debug_arg);
      }
      info!("{} {}", self.req_id, debug_sql);
    } else {
      for arg in args {
        query = query.bind(arg);
      }
    }
    let res = query.execute(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let rows_affected = res.rows_affected();
    Ok(rows_affected)
  }
  
  /// 带参数执行查询
  pub async fn query_with<T, R>(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(format!("'{}'", arg));
          query = query.bind(arg);
        }
        let mut debug_sql = sql.to_string();
        for debug_arg in debug_args {
          debug_sql = debug_sql.replace("?", &debug_arg);
        }
        // let query_params: sqlformat::QueryParams = sqlformat::QueryParams::Indexed(debug_args);
        // debug_sql = sqlformat::format(debug_sql.as_str(), &query_params, sqlformat::FormatOptions::default());
        info!("{} {}", self.req_id, debug_sql);
      } else {
        for arg in args {
          query = query.bind(arg);
        }
      }
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_all(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg));
        query = query.bind(arg);
      }
      let mut debug_sql = sql.to_string();
      for debug_arg in debug_args {
        debug_sql = debug_sql.replace("?", &debug_arg);
      }
      info!("{} {}", self.req_id, debug_sql);
    } else {
      for arg in args {
        query = query.bind(arg);
      }
    }
    let res = query.fetch_all(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
  
  /// 执行查询
  pub async fn query<R>(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        info!("{} {}", self.req_id, sql);
      }
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_all(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let query = sqlx::query_as::<_, R>(sql);
    info!("{} {}", self.req_id, sql);
    let res = query.fetch_all(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
  
  /// 带参数查询一条数据
  pub async fn query_one_with<T, R>(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
    options: Option<Options>,
  ) -> Result<R>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(format!("'{}'", arg));
          query = query.bind(arg);
        }
        let mut debug_sql = sql.to_string();
        for debug_arg in debug_args {
          debug_sql = debug_sql.replace("?", &debug_arg);
        }
        info!("{} {}", self.req_id, debug_sql);
      } else {
        for arg in args {
          query = query.bind(arg);
        }
      }
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_one(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg));
        query = query.bind(arg);
      }
      let mut debug_sql = sql.to_string();
      for debug_arg in debug_args {
        debug_sql = debug_sql.replace("?", &debug_arg);
      }
      info!("{} {}", self.req_id, debug_sql);
    } else {
      for arg in args {
        query = query.bind(arg);
      }
    }
    let res = query.fetch_one(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
  
  /// 查询一条数据
  pub async fn query_one<R>(
    &mut self,
    sql: &'a str,
    options: Option<Options>,
  ) -> Result<R>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(options) = options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query_as::<_, R>(sql);
      info!("{} {}", self.req_id, sql);
      let tran = self.tran.as_mut().unwrap();
      let res = query.fetch_one(tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.req_id, e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      drop(sql);
      return Ok(res);
    }
    let query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      info!("{} {}", self.req_id, sql);
    }
    let res = query.fetch_one(&DB_POOL.clone()).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    drop(sql);
    Ok(res)
  }
   
}

/**
 * 转义sql语句中的字段
 */
pub fn escape_id(mut val: String) -> String {
  val = val.replace("`", "``");
  val = val.replace(".", "`.`");
  val = val.trim().lines().map(|part| {
    part.trim().split_inclusive(char::is_whitespace)
      .filter(|part| !part.trim().is_empty())
      .map(|item| item.trim())
      .collect()
  }).collect::<Vec<String>>().join("");
  val
}

/**
 * 转义sql语句中的值
 */
pub fn escape(mut val: String) -> String {
  val = val.replace("`", "``");
  val = val.replace("'", "''");
  val = val.trim().lines().map(|part| {
    part.trim().split_inclusive(char::is_whitespace)
      .filter(|part| !part.trim().is_empty())
      .map(|item| item.trim())
      .collect()
  }).collect::<Vec<String>>().join("");
  val
}

/**
 * 获取sql语句中order_by的部分
 */
pub fn get_order_by_query(
  sort: Option<Vec<SortInput>>,
) -> String {
  let mut sort = sort.unwrap_or(vec![]);
  sort = sort.into_iter()
    .filter(|item| item.prop.is_empty())
    .collect();
  let mut order_by_query = String::from("");
  for item in sort {
    let prop = item.prop;
    let order = item.order;
    if !order_by_query.is_empty() {
      order_by_query += ",";
    }
    order_by_query += &format!(" {} {}", escape_id(prop), escape(order));
  }
  if !order_by_query.is_empty() {
    order_by_query = " order by".to_owned() + order_by_query.as_ref();
  }
  order_by_query
}

pub fn get_short_uuid() -> String {
  let uuid = uuid::Uuid::new_v4();
  let uuid = uuid.to_string();
  let uuid = uuid.replace("-", "");
  // base64编码
  let uuid = general_purpose::STANDARD.encode(uuid);
  // 切割字符串22位
  let uuid = utf8_slice::from(&uuid, 22);
  uuid.to_owned()
}
