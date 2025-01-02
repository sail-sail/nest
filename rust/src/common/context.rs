use std::borrow::Cow;
use std::env;
use std::collections::HashMap;

use tracing::{info, error, event_enabled, Level};
use anyhow::{Result, anyhow};
use async_graphql::SimpleObject;
use poem::http::{HeaderName, HeaderValue};
use rust_decimal::Decimal;
use serde::{Serialize, Deserialize};
use serde_json::json;
use uuid::Uuid;
use std::fmt::{Debug, Display};
use std::num::ParseIntError;
use smol_str::SmolStr;

use std::sync::OnceLock;
use std::sync::Arc;
use tokio::sync::Mutex;

use chrono::{Local, NaiveDate, NaiveTime, NaiveDateTime};
use base64::{engine::general_purpose, Engine};
// use regex::Regex;

use sqlx::mysql::{MySqlConnectOptions, MySqlPoolOptions, MySqlRow};
use sqlx::{Pool, MySql, Executor, FromRow, Row};
use sqlx::pool::PoolConnection;

use super::auth::auth_dao::{get_auth_model_by_token, get_token_by_auth_model};
use super::auth::auth_model::{AuthModel, AUTHORIZATION};
use super::cache::cache_dao::{get_cache, set_cache, del_cache};

pub use super::cache::cache_dao::del_caches;

use super::gql::model::{PageInput, SortInput};

pub use super::gql::model::UniqueType;
pub use super::util::string::hash;

use crate::common::exceptions::service_exception::ServiceException;
use crate::gen::base::usr::usr_model::UsrId;
use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::base::org::org_model::OrgId;

pub const FIND_ALL_IDS_LIMIT: usize = 5000;
pub const MAX_SAFE_INTEGER: u64 = 9007199254740991;

static SERVER_TOKEN_TIMEOUT: OnceLock<i64> = OnceLock::new();
static DB_POOL: OnceLock<Pool<MySql>> = OnceLock::new();
static DB_POOL_DW: OnceLock<Pool<MySql>> = OnceLock::new();
static IS_DEBUG: OnceLock<bool> = OnceLock::new();
// static MULTIPLE_SPACE_REGEX: OnceLock<Regex> = OnceLock::new();

fn server_token_timeout() -> i64 {
  SERVER_TOKEN_TIMEOUT.get_or_init(|| env::var("server_tokentimeout").unwrap()
    .parse::<i64>().unwrap_or(3600))
    .to_owned()
}

fn db_pool() -> Pool<MySql> {
  DB_POOL.get_or_init(|| init_db_pool("").unwrap())
    .clone()
}

fn db_pool_dw() -> Pool<MySql> {
  DB_POOL_DW.get_or_init(|| init_db_pool("_dw").unwrap())
    .clone()
}

pub fn is_debug() -> bool {
  IS_DEBUG.get_or_init(init_debug)
    .to_owned()
}

// pub fn multiple_space_regex() -> Regex {
//   MULTIPLE_SPACE_REGEX.get_or_init(|| Regex::new(r"\s+").unwrap())
//     .clone()
// }

tokio::task_local! {
  pub static CTX: Arc<Ctx>;
}

fn init_debug() -> bool {
  let is_debug = event_enabled!(Level::INFO);
  is_debug
}

fn init_db_pool(
  _database_name: &'static str,
) -> Result<Pool<MySql>> {
  
  let database_hostname = env::var(
    format!("database{_database_name}_hostname")
  ).unwrap_or("localhost".to_owned());
  
  let database_port = env::var(
    format!("database{_database_name}_port")
  ).unwrap_or("3306".to_owned());
  let database_port: Result<u16, ParseIntError> = database_port.parse();
  let database_port = database_port.unwrap_or(3306);
  
  let database_username = env::var(
    format!("database{_database_name}_username")
  ).unwrap_or("root".to_owned());
  
  let database_password = env::var(
    format!("database{_database_name}_password")
  ).unwrap_or_default();
  
  let database_database = env::var(
    format!("database{_database_name}_database")
  ).unwrap_or_default();
  
  let database_pool_size = env::var(
    format!("database{_database_name}_pool_size")
  ).unwrap_or("10".to_owned());
  
  let default_pool_size: u32 = 10;
  let database_pool_size: Result<u32, ParseIntError> = database_pool_size.parse();
  let database_pool_size = database_pool_size.unwrap_or(default_pool_size);
  let mysql_url = format!("mysql://{database_username}:xxx@{database_hostname}:{database_port}/{database_database}");
  
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

pub fn get_server_tokentimeout() -> i64 {
  server_token_timeout()
}

/// 获取当前请求id, 不保证唯一, 仅用于日志
pub fn get_req_id() -> Arc<String> {
  CTX.with(|ctx| {
    ctx.req_id.clone()
  })
}

/// 获取当前请求的时间点
pub fn get_now() -> NaiveDateTime {
  CTX.with(|ctx| {
    ctx.now
  })
}

/// 获取当前登录用户
#[allow(dead_code)]
pub fn get_auth_model() -> Option<AuthModel> {
  CTX.with(|ctx| {
    ctx.auth_model.clone()
  })
}

#[allow(dead_code)]
pub fn has_auth_model() -> bool {
  CTX.with(|ctx| {
    ctx.auth_model.is_some()
  })
}

/// 获取当前登录用户, 如果不存在则返回错误
#[allow(dead_code)]
pub fn get_auth_model_err() -> Result<AuthModel> {
  CTX.with(|ctx| {
    if ctx.auth_model.is_some() {
      return Ok(ctx.auth_model.clone().unwrap());
    }
    error!(
      "{req_id} Not login! - validate_auth_model is none",
      req_id = ctx.req_id,
    );
    Err(anyhow!("Not login!"))
  })
}

/// 获取当前登录用户的id
pub fn get_auth_id() -> Option<UsrId> {
  CTX.with(|ctx| {
    match ctx.auth_model.clone() {
      Some(item) => item.id.into(),
      None => None,
    }
  })
}

/// 获取当前登录用户的id
pub fn get_auth_id_err() -> Result<UsrId> {
  get_auth_id()
    .ok_or(anyhow!("Not login!"))
}

/// 获取当前登录用户的租户id
pub fn get_auth_tenant_id() -> Option<TenantId> {
  CTX.with(|ctx| {
    match ctx.auth_model.clone() {
      Some(item) => item.tenant_id.into(),
      None => None,
    }
  })
}

/// 获取当前登录用户的组织id
pub fn get_auth_org_id() -> Option<OrgId> {
  CTX.with(|ctx| {
    match ctx.auth_model.clone() {
      Some(item) => item.org_id,
      None => None,
    }
  })
}

/// 获取当前登录用户的组织id, 如果不存在则返回错误
#[allow(dead_code)]
pub fn get_auth_org_id_err() -> Result<OrgId> {
  get_auth_org_id()
    .ok_or(anyhow!("Not login!"))
}

/// 获取当前登录用户的语言
pub fn get_auth_lang() -> Option<String> {
  CTX.with(|ctx| {
    match ctx.auth_model.clone() {
      Some(item) => item.lang.into(),
      None => None,
    }
  })
}

/// 查找当前数据库连接的连接ID, 如果数据库事务尚未开启则返回0
#[allow(dead_code)]
pub async fn query_conn_id() -> Result<u64> {
  let ctx = &CTX.with(|ctx| ctx.clone());
  ctx.query_conn_id().await
}

/// 执行sql
pub async fn execute(
  sql: String,
  args: Vec<ArgType>,
  options: Option<Options>,
) -> Result<u64> {
  let ctx = &CTX.with(|ctx| ctx.clone());
  ctx.execute(sql, args, options).await
}

/// 查询数据仓库多条记录
#[allow(dead_code)]
pub async fn query_dw<R>(
  sql: String,
  args: Vec<ArgType>,
  options: Option<Options>,
) -> Result<Vec<R>>
where
  R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r>,
{
  let ctx = &CTX.with(|ctx| ctx.clone());
  let mut options = Options::from(options);
  options.database_name = "dw";
  ctx.query(sql, args, options.into()).await
}

/// 查询多条记录
pub async fn query<R>(
  sql: String,
  args: Vec<ArgType>,
  options: Option<Options>,
) -> Result<Vec<R>>
where
  R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r>,
{
  let ctx = &CTX.with(|ctx| ctx.clone());
  ctx.query(sql, args, options).await
}

/// 查询数据仓库一条记录
#[allow(dead_code)]
pub async fn query_one_dw<R>(
  sql: String,
  args: Vec<ArgType>,
  options: Option<Options>,
) -> Result<Option<R>>
where
  R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r> + Sync,
{
  let ctx = &CTX.with(|ctx| ctx.clone());
  let mut options = Options::from(options);
  options.database_name = "dw";
  ctx.query_one(sql, args, options.into()).await
}

/// 查询一条记录
pub async fn query_one<R>(
  sql: String,
  args: Vec<ArgType>,
  options: Option<Options>,
) -> Result<Option<R>>
where
  R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r> + Sync,
{
  let ctx = &CTX.with(|ctx| ctx.clone());
  ctx.query_one(sql, args, options).await
}

impl Ctx {
  
  pub fn builder<'a>(
    ctx: &'a async_graphql::Context<'a>,
  ) -> CtxBuilder<'a> {
    CtxBuilder::new(ctx.into())
  }
  
  pub fn resful_builder(
    req: Option<&poem::Request>,
  ) -> CtxBuilder<'_> {
    if let Some(req) = req {
      CtxBuilder::new(None)
        .with_resful_req(req)
    } else {
      CtxBuilder::new(None)
    }
  }
  
  pub fn set_auth_model(
    &mut self,
    auth_model: AuthModel,
  ) {
    self.auth_model = Some(auth_model);
  }
  
  /// 查找当前数据库连接的连接id, 如果数据库事务尚未开启则返回0
  async fn query_conn_id(&self) -> Result<u64> {
    let mut tran = self.tran.lock().await;
    if tran.is_none() {
      return Ok(0);
    }
    let tran = tran.as_mut().unwrap();
    let row = tran.fetch_one("select connection_id()").await?;
    let connection_id: u64 = row.try_get(0)?;
    Ok(connection_id)
  }
  
  /// 开启事务
  async fn begin(&self) -> Result<()> {
    {
      let tran = self.tran.lock().await;
      if (*tran).is_some() {
        return Ok(());
      }
    }
    let mut tran = db_pool().acquire().await?;
    tran.execute("begin").await?;
    let connection_id: u64 = tran
      .fetch_one("select connection_id()").await?
      .try_get(0)?;
    info!(
      "{req_id} begin; -- {connection_id}",
      req_id = self.req_id,
    );
    let mut tran0 = self.tran.lock().await;
    *tran0 = Some(tran);
    Ok(())
  }
  
  pub async fn ok<T>(&self, res: Result<T>) -> Result<T>
  where
    T: Send + Sized + Debug,
  {
    let mut tran = self.tran.lock().await;
    let tran = tran.take();
    if let Some(mut tran) = tran {
      let connection_id: u64 = tran
        .fetch_one("select connection_id()").await?
        .try_get(0)?;
      if let Err(err) = res {
        let exception = err.downcast_ref::<ServiceException>();
        if exception.is_some() {
          info!(
            "{} {}",
            self.req_id,
            err,
          );
        } else {
          // 双引号开始并且双引号结束的用 info! 宏打印
          let msg = format!("{:#?}", err);
          if msg.starts_with('"') && msg.ends_with('"') {
            info!(
              "{} {}",
              self.req_id,
              err,
            );
          } else {
            error!(
              "{} {:#?}",
              self.req_id,
              err,
            );
          }
        }
        let rollback = match exception {
          Some(err) => err.rollback,
          None => true,
        };
        if rollback {
          info!(
            "{req_id} rollback; -- {connection_id}",
            req_id = self.req_id,
          );
          tran.execute("rollback").await?;
        } else {
          info!(
            "{req_id} commit; -- {connection_id}",
            req_id = self.req_id,
          );
          tran.execute("commit").await?;
        }
        return Err(err);
      }
      info!(
        "{req_id} commit; -- {connection_id}",
        req_id = self.req_id,
      );
      tran.execute("commit").await?;
      return res;
    }
    if let Err(err) = res {
      let exception = err.downcast_ref::<ServiceException>();
      if exception.is_some() {
        info!(
          "{} {}",
          self.req_id,
          err,
        );
      } else {
        // 双引号开始并且双引号结束的用 info! 宏打印
        let msg = format!("{:#?}", err);
        if msg.starts_with('"') && msg.ends_with('"') {
          info!(
            "{} {}",
            self.req_id,
            err,
          );
        } else {
          error!(
            "{} {:#?}",
            self.req_id,
            err,
          );
        }
      }
      return Err(err);
    }
    res
  }
  
  /// 执行sql
  async fn execute(
    &self,
    sql: String,
    args: Vec<ArgType>,
    options: Option<Options>,
  ) -> Result<u64> {
    
    let mut is_tran = self.is_tran;
    if let Some(options) = &options {
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if let Some(options) = &options {
      if let Some(del_cache_key1s) = &options.del_cache_key1s {
        del_caches(
          del_cache_key1s
            .iter()
            .map(|item| item.as_str())
            .collect::<Vec<&str>>()
            .as_slice()
        ).await?;
      }
    }
    
    if is_tran {
      let mut query = sqlx::query(&sql);
      for arg in args {
        match arg {
          ArgType::Bool(s) => {
            query = query.bind(s);
          }
          ArgType::I8(s) => {
            query = query.bind(s);
          }
          ArgType::I16(s) => {
            query = query.bind(s);
          }
          ArgType::I32(s) => {
            query = query.bind(s);
          }
          ArgType::I64(s) => {
            query = query.bind(s);
          }
          ArgType::Decimal(s) => {
            query = query.bind(s);
          }
          ArgType::U8(s) => {
            query = query.bind(s);
          }
          ArgType::U16(s) => {
            query = query.bind(s);
          }
          ArgType::U32(s) => {
            query = query.bind(s);
          }
          ArgType::U64(s) => {
            query = query.bind(s);
          }
          ArgType::F32(s) => {
            query = query.bind(s);
          }
          ArgType::F64(s) => {
            query = query.bind(s);
          }
          ArgType::String(s) => {
            query = query.bind(s);
          }
          ArgType::CowStr(s) => {
            query = query.bind(s);
          }
          ArgType::TimeStamp(s) => {
            query = query.bind(s);
          }
          ArgType::Date(s) => {
            query = query.bind(s);
          }
          ArgType::DateTime(s) => {
            query = query.bind(s);
          }
          ArgType::Time(s) => {
            query = query.bind(s);
          }
          ArgType::Json(s) => {
            query = query.bind(s);
          }
          ArgType::Uuid(s) => {
            query = query.bind(s);
          }
          ArgType::SmolStr(s) => {
            query = query.bind(s.to_string());
          }
        };
      }
      let res = {
        self.begin().await?;
        let mut tran = self.tran.lock().await;
        let tran = tran.as_mut().unwrap();
        tran.execute(query).await?
      };
      let rows_affected = res.rows_affected();
      if rows_affected > 0 {
        if let Some(options) = &options {
          if let Some(del_cache_key1s) = &options.del_cache_key1s {
            del_caches(
              del_cache_key1s
                .iter()
                .map(|item| item.as_str())
                .collect::<Vec<&str>>()
                .as_slice()
            ).await?;
          }
        }
      }
      return Ok(rows_affected);
    }
    let mut query = sqlx::query(&sql);
    for arg in args {
      match arg {
        ArgType::Bool(s) => {
          query = query.bind(s);
        }
        ArgType::I8(s) => {
          query = query.bind(s);
        }
        ArgType::I16(s) => {
          query = query.bind(s);
        }
        ArgType::I32(s) => {
          query = query.bind(s);
        }
        ArgType::I64(s) => {
          query = query.bind(s);
        }
        ArgType::Decimal(s) => {
          query = query.bind(s);
        }
        ArgType::U8(s) => {
          query = query.bind(s);
        }
        ArgType::U16(s) => {
          query = query.bind(s);
        }
        ArgType::U32(s) => {
          query = query.bind(s);
        }
        ArgType::U64(s) => {
          query = query.bind(s);
        }
        ArgType::F32(s) => {
          query = query.bind(s);
        }
        ArgType::F64(s) => {
          query = query.bind(s);
        }
        ArgType::String(s) => {
          query = query.bind(s);
        }
        ArgType::CowStr(s) => {
          query = query.bind(s);
        }
        ArgType::TimeStamp(s) => {
          query = query.bind(s);
        }
        ArgType::Date(s) => {
          query = query.bind(s);
        }
        ArgType::DateTime(s) => {
          query = query.bind(s);
        }
        ArgType::Time(s) => {
          query = query.bind(s);
        }
        ArgType::Json(s) => {
          query = query.bind(s);
        }
        ArgType::Uuid(s) => {
          query = query.bind(s);
        }
        ArgType::SmolStr(s) => {
          query = query.bind(s.to_string());
        }
      };
    }
    let db_pool = db_pool();
    let res = query.execute(&db_pool).await?;
    let rows_affected = res.rows_affected();
    if rows_affected > 0 {
      if let Some(options) = &options {
        if let Some(del_cache_key1s) = &options.del_cache_key1s {
          del_caches(
            del_cache_key1s
              .iter()
              .map(|item| item.as_str())
              .collect::<Vec<&str>>()
              .as_slice()
          ).await?;
        }
      }
    }
    Ok(rows_affected)
  }
  
  /// 查询多条记录
  async fn query<R>(
    &self,
    sql: String,
    args: Vec<ArgType>,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r>,
  {
    if let Some(options) = &options {
      if options.cache_key1.is_some() && options.cache_key2.is_some() {
        let cache_key1 = options.cache_key1.as_ref().unwrap();
        let cache_key2 = options.cache_key2.as_ref().unwrap();
        let str = get_cache(cache_key1, cache_key2).await?;
        if let Some(str) = str {
          let res2: Vec<R>;
          let res = serde_json::from_str::<Vec<R>>(&str);
          if let Ok(res) = res {
            res2 = res;
          } else {
            res2 = vec![];
            del_cache(cache_key1).await?;
          }
          return Ok(res2);
        }
      }
    }
    
    let mut is_tran = self.is_tran;
    if let Some(options) = options.as_ref() {
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      let mut query = sqlx::query_as::<_, R>(&sql);
      for arg in args {
        match arg {
          ArgType::Bool(s) => {
            query = query.bind(s);
          }
          ArgType::I8(s) => {
            query = query.bind(s);
          }
          ArgType::I16(s) => {
            query = query.bind(s);
          }
          ArgType::I32(s) => {
            query = query.bind(s);
          }
          ArgType::I64(s) => {
            query = query.bind(s);
          }
          ArgType::Decimal(s) => {
            query = query.bind(s);
          }
          ArgType::U8(s) => {
            query = query.bind(s);
          }
          ArgType::U16(s) => {
            query = query.bind(s);
          }
          ArgType::U32(s) => {
            query = query.bind(s);
          }
          ArgType::U64(s) => {
            query = query.bind(s);
          }
          ArgType::F32(s) => {
            query = query.bind(s);
          }
          ArgType::F64(s) => {
            query = query.bind(s);
          }
          ArgType::String(s) => {
            query = query.bind(s);
          }
          ArgType::CowStr(s) => {
            query = query.bind(s);
          }
          ArgType::TimeStamp(s) => {
            query = query.bind(s);
          }
          ArgType::Date(s) => {
            query = query.bind(s);
          }
          ArgType::DateTime(s) => {
            query = query.bind(s);
          }
          ArgType::Time(s) => {
            query = query.bind(s);
          }
          ArgType::Json(s) => {
            query = query.bind(s);
          }
          ArgType::Uuid(s) => {
            query = query.bind(s);
          }
          ArgType::SmolStr(s) => {
            query = query.bind(s.to_string());
          }
        };
      }
      let res = {
        self.begin().await?;
        let mut tran = self.tran.lock().await;
        let tran = tran.as_mut().unwrap();
        query.fetch_all((*tran).as_mut()).await?
      };
      
      if let Some(options) = &options {
        if options.cache_key1.is_some() && options.cache_key2.is_some() {
          let cache_key1 = options.cache_key1.as_ref().unwrap();
          let cache_key2 = options.cache_key2.as_ref().unwrap();
          let str = serde_json::to_string(&res)?;
          set_cache(cache_key1, cache_key2, &str).await?;
        }
      }
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(&sql);
    for arg in args {
      match arg {
        ArgType::Bool(s) => {
          query = query.bind(s);
        }
        ArgType::I8(s) => {
          query = query.bind(s);
        }
        ArgType::I16(s) => {
          query = query.bind(s);
        }
        ArgType::I32(s) => {
          query = query.bind(s);
        }
        ArgType::I64(s) => {
          query = query.bind(s);
        }
        ArgType::Decimal(s) => {
          query = query.bind(s);
        }
        ArgType::U8(s) => {
          query = query.bind(s);
        }
        ArgType::U16(s) => {
          query = query.bind(s);
        }
        ArgType::U32(s) => {
          query = query.bind(s);
        }
        ArgType::U64(s) => {
          query = query.bind(s);
        }
        ArgType::F32(s) => {
          query = query.bind(s);
        }
        ArgType::F64(s) => {
          query = query.bind(s);
        }
        ArgType::String(s) => {
          query = query.bind(s);
        }
        ArgType::CowStr(s) => {
          query = query.bind(s);
        }
        ArgType::TimeStamp(s) => {
          query = query.bind(s);
        }
        ArgType::Date(s) => {
          query = query.bind(s);
        }
        ArgType::DateTime(s) => {
          query = query.bind(s);
        }
        ArgType::Time(s) => {
          query = query.bind(s);
        }
        ArgType::Json(s) => {
          query = query.bind(s);
        }
        ArgType::Uuid(s) => {
          query = query.bind(s);
        }
        ArgType::SmolStr(s) => {
          query = query.bind(s.to_string());
        }
      };
    }
    
    let database_name = options.as_ref().map_or("", |options| {
      options.database_name
    });
    let db_pool = if database_name == "dw" {
      db_pool_dw()
    } else {
      db_pool()
    };
    let res = query.fetch_all(&db_pool).await?;
    if let Some(options) = &options {
      if options.cache_key1.is_some() && options.cache_key2.is_some() {
        let cache_key1 = options.cache_key1.as_ref().unwrap();
        let cache_key2 = options.cache_key2.as_ref().unwrap();
        let str = serde_json::to_string(&res)?;
        set_cache(cache_key1, cache_key2, &str).await?;
      }
    }
    Ok(res)
  }
  
  /// 查询一条记录
  async fn query_one<R>(
    &self,
    sql: String,
    args: Vec<ArgType>,
    options: Option<Options>,
  ) -> Result<Option<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r> + Sync,
  {
    if let Some(options) = &options {
      if options.cache_key1.is_some() && options.cache_key2.is_some() {
        let cache_key1 = options.cache_key1.as_ref().unwrap();
        let cache_key2 = options.cache_key2.as_ref().unwrap();
        let str = get_cache(cache_key1, cache_key2).await?;
        if let Some(str) = str {
          let res = serde_json::from_str::<R>(&str);
          let res2: Option<R> = if let Ok(res) = res {
            res.into()
          } else {
            del_cache(cache_key1).await?;
            None
          };
          return Ok(res2);
        }
      }
    }
    
    let mut is_tran = self.is_tran;
    if let Some(options) = &options {
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      let mut query = sqlx::query_as::<_, R>(&sql);
      for arg in args {
        match arg {
          ArgType::Bool(s) => {
            query = query.bind(s);
          }
          ArgType::I8(s) => {
            query = query.bind(s);
          }
          ArgType::I16(s) => {
            query = query.bind(s);
          }
          ArgType::I32(s) => {
            query = query.bind(s);
          }
          ArgType::I64(s) => {
            query = query.bind(s);
          }
          ArgType::Decimal(s) => {
            query = query.bind(s);
          }
          ArgType::U8(s) => {
            query = query.bind(s);
          }
          ArgType::U16(s) => {
            query = query.bind(s);
          }
          ArgType::U32(s) => {
            query = query.bind(s);
          }
          ArgType::U64(s) => {
            query = query.bind(s);
          }
          ArgType::F32(s) => {
            query = query.bind(s);
          }
          ArgType::F64(s) => {
            query = query.bind(s);
          }
          ArgType::String(s) => {
            query = query.bind(s);
          }
          ArgType::CowStr(s) => {
            query = query.bind(s);
          }
          ArgType::TimeStamp(s) => {
            query = query.bind(s);
          }
          ArgType::Date(s) => {
            query = query.bind(s);
          }
          ArgType::DateTime(s) => {
            query = query.bind(s);
          }
          ArgType::Time(s) => {
            query = query.bind(s);
          }
          ArgType::Json(s) => {
            query = query.bind(s);
          }
          ArgType::Uuid(s) => {
            query = query.bind(s);
          }
          ArgType::SmolStr(s) => {
            query = query.bind(s.to_string());
          }
        };
      }
      let res = {
        self.begin().await?;
        let mut tran = self.tran.lock().await;
        let tran = tran.as_mut().unwrap();
        query.fetch_optional((*tran).as_mut()).await?
      };
      if let Some(res) = &res {
        if let Some(options) = &options {
          if options.cache_key1.is_some() && options.cache_key2.is_some() {
            let cache_key1 = options.cache_key1.as_ref().unwrap();
            let cache_key2 = options.cache_key2.as_ref().unwrap();
            let str = serde_json::to_string(res)?;
            set_cache(cache_key1, cache_key2, &str).await?;
          }
        }
      }
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(&sql);
    for arg in args {
      match arg {
        ArgType::Bool(s) => {
          query = query.bind(s);
        }
        ArgType::I8(s) => {
          query = query.bind(s);
        }
        ArgType::I16(s) => {
          query = query.bind(s);
        }
        ArgType::I32(s) => {
          query = query.bind(s);
        }
        ArgType::I64(s) => {
          query = query.bind(s);
        }
        ArgType::Decimal(s) => {
          query = query.bind(s);
        }
        ArgType::U8(s) => {
          query = query.bind(s);
        }
        ArgType::U16(s) => {
          query = query.bind(s);
        }
        ArgType::U32(s) => {
          query = query.bind(s);
        }
        ArgType::U64(s) => {
          query = query.bind(s);
        }
        ArgType::F32(s) => {
          query = query.bind(s);
        }
        ArgType::F64(s) => {
          query = query.bind(s);
        }
        ArgType::String(s) => {
          query = query.bind(s);
        }
        ArgType::CowStr(s) => {
          query = query.bind(s);
        }
        ArgType::TimeStamp(s) => {
          query = query.bind(s);
        }
        ArgType::Date(s) => {
          query = query.bind(s);
        }
        ArgType::DateTime(s) => {
          query = query.bind(s);
        }
        ArgType::Time(s) => {
          query = query.bind(s);
        }
        ArgType::Json(s) => {
          query = query.bind(s);
        }
        ArgType::Uuid(s) => {
          query = query.bind(s);
        }
        ArgType::SmolStr(s) => {
          query = query.bind(s.to_string());
        }
      };
    }
    
    let database_name = options.as_ref().map_or("", |options| {
      options.database_name
    });
    let db_pool = if database_name == "dw" {
      db_pool_dw()
    } else {
      db_pool()
    };
    let res = query.fetch_optional(&db_pool).await?;
    if let Some(res) = &res {
      if let Some(options) = &options {
        if options.cache_key1.is_some() && options.cache_key2.is_some() {
          let cache_key1 = options.cache_key1.as_ref().unwrap();
          let cache_key2 = options.cache_key2.as_ref().unwrap();
          let str = serde_json::to_string(res)?;
          set_cache(cache_key1, cache_key2, &str).await?;
        }
      }
    }
    Ok(res)
  }
  
}

pub struct Ctx {
  
  is_tran: bool,
  
  req_id: Arc<String>,
  
  tran: Arc<Mutex<Option<PoolConnection<MySql>>>>,
  
  is_resful: bool,
  
  auth_token: Option<String>,
  
  auth_model: Option<AuthModel>,
  
  now: NaiveDateTime,
  
  is_debug: Option<bool>,
  
  /// 静默模式
  is_silent_mode: bool,
  
  /// 是否处于创建模式, 默认为 false
  /// 创建模式 update_by_id 时不自动修改 update_usr_id, update_usr_id_lbl 跟 update_time
  /// 创建模式 delete_by_ids 时不自动修改 delete_usr_id, delete_usr_id_lbl 跟 delete_time
  is_creating: Option<bool>,
  
}

impl Ctx {
  
  pub async fn scope<F, T>(self, f: F) -> Result<T>
    where
      F: core::future::Future<Output = Result<T>>,
      T: Send + Debug,
  {
    let ctx = Arc::new(self);
    CTX.scope(ctx, async move {
      let res = f.await;
      let ctx = CTX.with(|ctx| ctx.clone());
      if ctx.is_resful {
        return Err(anyhow!("must use resful_scope()"));
      }
      // info!("{} {}", ctx.req_id, serde_json::to_string(&res).unwrap_or_default());
      ctx.ok(res).await
    }).await
  }
  
  pub async fn resful_scope<F, R>(self, f: F) -> Result<poem::Response>
    where
      F: core::future::Future<Output = R>,
      R: poem::IntoResponse,
  {
    let ctx = Arc::new(self);
    CTX.scope(ctx, async move {
      let res = f.await;
      let mut res = res.into_response();
      let ctx = CTX.with(|ctx| ctx.clone());
      if let Some(auth_token) = ctx.auth_token.as_deref() {
        res.headers_mut()
          .insert(AUTHORIZATION, auth_token.parse().unwrap());
      }
      let status_code = res.status();
      let is_success = status_code.is_success() || status_code.is_redirection() || status_code.is_informational();
      let extensions = res.extensions();
      let is_rollback = extensions.get::<bool>().copied().unwrap_or(true);
      {
        let mut tran = ctx.tran.lock().await;
        let tran = tran.take();
        if let Some(mut tran) = tran {
          let connection_id: u64 = tran
            .fetch_one("select connection_id()").await?
            .try_get(0)?;
          if is_rollback {
            if is_success {
              info!(
                "{req_id} commit; -- {connection_id}",
                req_id = ctx.req_id,
              );
              tran.execute("commit").await?;
            } else {
              info!(
                "{req_id} rollback; -- {connection_id}",
                req_id = ctx.req_id,
              );
              tran.execute("rollback").await?;
            }
          } else {
            info!(
              "{req_id} commit; -- {connection_id}",
              req_id = ctx.req_id,
            );
            tran.execute("commit").await?;
          }
        } else if !is_success {
          error!(
            "{} {}",
            ctx.req_id,
            status_code,
          );
        }
      }
      Ok(res)
    }).await
  }
  
}

// pub fn use_ctx() -> Arc<Ctx> {
//   CTX.with(|ctx| ctx.clone())
// }

#[derive(SimpleObject, Default, Serialize, Deserialize)]
pub struct CountModel {
  
  pub total: u64,
  
}

impl FromRow<'_, MySqlRow> for CountModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    
    let total: i64 = row.try_get("total")?;
    if total < 0 {
      return Err(sqlx::Error::ColumnDecode {
        index: "total".to_owned(),
        source: Box::new(sqlx::Error::Protocol(
          "total < 0".to_owned(),
        )),
      });
    }
    let total = total as u64;
    
    if total > MAX_SAFE_INTEGER {
      return Err(sqlx::Error::ColumnDecode {
        index: "total".to_owned(),
        source: Box::new(sqlx::Error::Protocol(
          "total > MAX_SAFE_INTEGER".to_owned(),
        )),
      });
    }
    
    Ok(CountModel {
      total,
    })
  }
}

#[derive(SimpleObject, FromRow, Default, Serialize, Deserialize)]
pub struct OrderByModel {
  
  pub order_by: u32,
  
}

#[derive(Clone, Debug)]
pub enum ArgType {
  Bool(bool),
  I8(i8),
  I16(i16),
  I32(i32),
  I64(i64),
  Decimal(Decimal),
  U8(u8),
  U16(u16),
  U32(u32),
  U64(u64),
  F32(f32),
  F64(f64),
  String(String),
  CowStr(Cow<'static, str>),
  TimeStamp(NaiveDateTime),
  Date(NaiveDate),
  DateTime(NaiveDateTime),
  Time(NaiveTime),
  Json(serde_json::Value),
  Uuid(Uuid),
  SmolStr(SmolStr),
}

impl Serialize for ArgType {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
      S: serde::Serializer,
  {
    match self {
      ArgType::Bool(value) => serializer.serialize_bool(*value),
      ArgType::I8(value) => serializer.serialize_i8(*value),
      ArgType::I16(value) => serializer.serialize_i16(*value),
      ArgType::I32(value) => serializer.serialize_i32(*value),
      ArgType::I64(value) => serializer.serialize_i64(*value),
      ArgType::Decimal(value) => serializer.serialize_str(&value.to_string()),
      ArgType::U8(value) => serializer.serialize_u8(*value),
      ArgType::U16(value) => serializer.serialize_u16(*value),
      ArgType::U32(value) => serializer.serialize_u32(*value),
      ArgType::U64(value) => serializer.serialize_u64(*value),
      ArgType::F32(value) => serializer.serialize_f32(*value),
      ArgType::F64(value) => serializer.serialize_f64(*value),
      ArgType::String(value) => serializer.serialize_str(value),
      ArgType::CowStr(value) => serializer.serialize_str(value),
      ArgType::TimeStamp(value) => serializer.serialize_str(&value.format("%Y-%m-%d %H:%M:%S").to_string()),
      ArgType::Date(value) => serializer.serialize_str(&value.format("%Y-%m-%d").to_string()),
      ArgType::DateTime(value) => serializer.serialize_str(&value.format("%Y-%m-%d %H:%M:%S").to_string()),
      ArgType::Time(value) => serializer.serialize_str(&value.format("%H:%M:%S").to_string()),
      ArgType::Json(value) => serializer.serialize_str(&value.to_string()),
      ArgType::Uuid(value) => serializer.serialize_str(&value.to_string()),
      ArgType::SmolStr(value) => serializer.serialize_str(value.as_str()),
    }
  }
}

impl Display for ArgType {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    match self {
      ArgType::Bool(value) => write!(f, "{}", value),
      ArgType::I8(value) => write!(f, "{}", value),
      ArgType::I16(value) => write!(f, "{}", value),
      ArgType::I32(value) => write!(f, "{}", value),
      ArgType::I64(value) => write!(f, "{}", value),
      ArgType::Decimal(value) => write!(f, "{}", value),
      ArgType::U8(value) => write!(f, "{}", value),
      ArgType::U16(value) => write!(f, "{}", value),
      ArgType::U32(value) => write!(f, "{}", value),
      ArgType::U64(value) => write!(f, "{}", value),
      ArgType::F32(value) => write!(f, "{}", value),
      ArgType::F64(value) => write!(f, "{}", value),
      ArgType::String(value) => write!(f, "{}", value),
      ArgType::CowStr(value) => write!(f, "{}", value),
      ArgType::TimeStamp(value) => write!(f, "{}", value.format("%Y-%m-%d %H:%M:%S")),
      ArgType::Date(value) => write!(f, "{}", value.format("%Y-%m-%d")),
      ArgType::DateTime(value) => write!(f, "{}", value.format("%Y-%m-%d %H:%M:%S")),
      ArgType::Time(value) => write!(f, "{}", value.format("%H:%M:%S")),
      ArgType::Json(value) => write!(f, "{}", value),
      ArgType::Uuid(value) => write!(f, "{}", value),
      ArgType::SmolStr(value) => write!(f, "{}", value),
    }
  }
}

#[derive(Default, Clone, Debug)]
pub struct QueryArgs {
  
  pub value: Vec<ArgType>,
  
}

impl QueryArgs {
  
  pub fn new() -> QueryArgs {
    QueryArgs {
      value: Vec::new(),
    }
  }
  
  pub fn push(&mut self, arg: ArgType) -> String {
    let _ = &mut self.value.push(arg);
    String::from("?")
  }
  
}

impl From<QueryArgs> for Vec<ArgType> {
  fn from(args: QueryArgs) -> Self {
    args.value
  }
}

impl From<Vec<ArgType>> for QueryArgs {
  fn from(args: Vec<ArgType>) -> Self {
    QueryArgs {
      value: args,
    }
  }
}

impl From<bool> for ArgType {
  fn from(value: bool) -> Self {
    ArgType::Bool(value)
  }
}

impl From<i8> for ArgType {
  fn from(value: i8) -> Self {
    ArgType::I8(value)
  }
}

impl From<i16> for ArgType {
  fn from(value: i16) -> Self {
    ArgType::I16(value)
  }
}

impl From<i32> for ArgType {
  fn from(value: i32) -> Self {
    ArgType::I32(value)
  }
}

impl From<i64> for ArgType {
  fn from(value: i64) -> Self {
    ArgType::I64(value)
  }
}

impl From<Decimal> for ArgType {
  fn from(value: Decimal) -> Self {
    ArgType::Decimal(value)
  }
}

impl From<u8> for ArgType {
  fn from(value: u8) -> Self {
    ArgType::U8(value)
  }
}

impl From<u16> for ArgType {
  fn from(value: u16) -> Self {
    ArgType::U16(value)
  }
}

impl From<u32> for ArgType {
  fn from(value: u32) -> Self {
    ArgType::U32(value)
  }
}

impl From<u64> for ArgType {
  fn from(value: u64) -> Self {
    ArgType::U64(value)
  }
}

impl From<f32> for ArgType {
  fn from(value: f32) -> Self {
    ArgType::F32(value)
  }
}

impl From<f64> for ArgType {
  fn from(value: f64) -> Self {
    ArgType::F64(value)
  }
}

impl From<String> for ArgType {
  fn from(value: String) -> Self {
    ArgType::String(value)
  }
}

impl From<&str> for ArgType {
  fn from(value: &str) -> Self {
    ArgType::String(value.to_string())
  }
}

impl From<Cow<'static, str>> for ArgType {
  fn from(value: Cow<'static, str>) -> Self {
    ArgType::CowStr(value)
  }
}

impl From<NaiveDate> for ArgType {
  fn from(value: NaiveDate) -> Self {
    ArgType::Date(value)
  }
}

impl From<NaiveDateTime> for ArgType {
  fn from(value: NaiveDateTime) -> Self {
    ArgType::DateTime(value)
  }
}

impl From<NaiveTime> for ArgType {
  fn from(value: NaiveTime) -> Self {
    ArgType::Time(value)
  }
}

impl From<serde_json::Value> for ArgType {
  fn from(value: serde_json::Value) -> Self {
    ArgType::Json(value)
  }
}

impl From<Uuid> for ArgType {
  fn from(value: Uuid) -> Self {
    ArgType::Uuid(value)
  }
}

impl From<SmolStr> for ArgType {
  fn from(value: SmolStr) -> Self {
    ArgType::SmolStr(value)
  }
}

impl From<&SmolStr> for ArgType {
  fn from(value: &SmolStr) -> Self {
    ArgType::SmolStr(value.clone())
  }
}

#[derive(Default, new, Clone)]
pub struct Options {
  
  /// 是否打印sql调试语句
  #[new(default)]
  is_debug: Option<bool>,
  
  /// 指定当前函数的sql是否开启事务
  #[new(default)]
  is_tran: Option<bool>,
  
  #[new(default)]
  cache_key1: Option<String>,
  
  #[new(default)]
  cache_key2: Option<String>,
  
  #[new(default)]
  del_cache_key1s: Option<Vec<String>>,
  
  #[new(default)]
  #[allow(dead_code)]
  unique_type: Option<UniqueType>,
  
  #[new(default)]
  #[allow(dead_code)]
  is_encrypt: Option<bool>,
  
  #[new(default)]
  #[allow(dead_code)]
  has_data_permit: Option<bool>,
  
  #[new(default)]
  #[allow(dead_code)]
  database_name: &'static str,
  
  #[new(default)]
  ids_limit: Option<usize>,
  
  /// 静默模式
  #[new(default)]
  is_silent_mode: Option<bool>,
  
  /// 创建状态
  #[new(default)]
  is_creating: Option<bool>,
  
}

impl Debug for Options {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("Options");
    if let Some(is_debug) = self.is_debug {
      item = item.field("is_debug", &is_debug);
    }
    if let Some(is_tran) = self.is_tran {
      if is_tran {
        item = item.field("is_tran", &is_tran);
      }
    }
    if let Some(cache_key1) = &self.cache_key1 {
      item = item.field("cache_key1", cache_key1);
    }
    if let Some(cache_key2) = &self.cache_key2 {
      item = item.field("cache_key2", cache_key2);
    }
    if let Some(del_cache_key1s) = &self.del_cache_key1s {
      item = item.field("del_cache_key1s", del_cache_key1s);
    }
    if let Some(unique_type) = &self.unique_type {
      item = item.field("unique_type", unique_type);
    }
    if let Some(is_encrypt) = self.is_encrypt {
      if is_encrypt {
        item = item.field("is_encrypt", &is_encrypt);
      }
    }
    if let Some(has_data_permit) = self.has_data_permit {
      if has_data_permit {
        item = item.field("has_data_permit", &has_data_permit);
      }
    }
    if !self.database_name.is_empty() {
      item = item.field("database_name", &self.database_name);
    }
    if let Some(ids_limit) = self.ids_limit {
      item = item.field("ids_limit", &ids_limit);
    }
    if let Some(is_silent_mode) = self.is_silent_mode {
      if is_silent_mode {
        item = item.field("is_silent_mode", &is_silent_mode);
      }
    }
    item.finish()
  }
}

impl Options {
  
  pub fn from(options: Option<Options>) -> Options {
    if options.is_none() {
      return Options::new();
    }
    options.unwrap()
  }
  
  #[inline]
  #[allow(dead_code)]
  pub fn get_is_debug(&self) -> Option<bool> {
    self.is_debug
  }
  
  #[inline]
  pub fn set_is_debug(self, is_debug: Option<bool>) -> Self {
    let mut self_ = self;
    self_.is_debug = is_debug;
    self_
  }
  
  pub fn set_cache_key(self, table: &str, sql: &str, args: &Vec<ArgType>) -> Self {
    let mut self_ = self;
    self_.cache_key1 = format!("dao.sql.{}", table).into();
    self_.cache_key2 = hash(json!([ &sql, args ]).to_string().as_bytes()).into();
    self_
  }
  
  pub fn set_del_cache_key1s(self, tables: Vec<&str>) -> Self {
    let mut self_ = self;
    self_.del_cache_key1s = tables.into_iter()
      .map(|table|
        format!("dao.sql.{}", table)
      )
      .collect::<Vec<String>>()
      .into();
    self_
  }
  
  pub fn get_del_cache_key1s(&self) -> Option<&Vec<String>> {
    self.del_cache_key1s.as_ref()
  }
  
  #[inline]
  pub fn get_is_tran(&self) -> Option<bool> {
    self.is_tran
  }
  
  #[inline]
  pub fn set_unique_type(self, unique_type: UniqueType) -> Self {
    let mut self_ = self;
    self_.unique_type = Some(unique_type);
    self_
  }
  
  #[inline]
  pub fn get_unique_type(&self) -> Option<UniqueType> {
    self.unique_type
  }
  
  #[inline]
  #[allow(dead_code)]
  pub fn set_is_encrypt(self, is_encrypt: bool) -> Self {
    let mut self_ = self;
    self_.is_encrypt = is_encrypt.into();
    self_
  }
  
  #[inline]
  #[allow(dead_code)]
  pub fn get_is_encrypt(&self) -> Option<bool> {
    self.is_encrypt
  }
  
  #[inline]
  #[allow(dead_code)]
  pub fn set_has_data_permit(self, has_data_permit: bool) -> Self {
    let mut self_ = self;
    self_.has_data_permit = has_data_permit.into();
    self_
  }
  
  #[inline]
  #[allow(dead_code)]
  pub fn get_has_data_permit(&self) -> Option<bool> {
    self.has_data_permit
  }
  
  #[inline]
  pub fn get_ids_limit(&self) -> Option<usize> {
    self.ids_limit
  }
  
}

// impl Drop for Ctx {
  
//   fn drop(&mut self) {
//     if (&(self.tran)).is_some() {
//       error!("{} drop; tran is not none", self.req_id);
//     }
//   }
  
// }

pub struct CtxBuilder<'a> {
  
  gql_ctx: Option<&'a async_graphql::Context<'a>>,
  
  resful_req: Option<&'a poem::Request>,
  
  is_tran: Option<bool>,
  
  auth_token: Option<String>,
  
  auth_model: Option<AuthModel>,
  
  req_id: String,
  
  now: NaiveDateTime,
  
  is_debug: Option<bool>,
  
  is_silent_mode: bool,
  
  is_creating: Option<bool>,
  
}

impl <'a> CtxBuilder<'a> {
  
  pub fn new(
    gql_ctx: Option<&'a async_graphql::Context<'a>>,
  ) -> CtxBuilder<'a> {
    let now = Local::now().naive_local();
    let req_id = now.and_utc().timestamp_millis().to_string();
    CtxBuilder {
      gql_ctx,
      resful_req: None,
      is_tran: None,
      auth_token: None,
      auth_model: None,
      req_id,
      now,
      is_debug: None,
      is_silent_mode: false,
      is_creating: None,
    }
  }
  
  /// 设置restful请求, 从而获取token
  fn with_resful_req(mut self, resful_req: &'a poem::Request) -> CtxBuilder<'a> {
    self.resful_req = Some(resful_req);
    self
  }
  
  /// 开启事务
  pub fn with_tran(mut self) -> Result<CtxBuilder<'a>> {
    self.is_tran = Some(true);
    Ok(self)
  }
  
  /// 获取token, graphql跟restful的获取方式不一样
  fn get_auth_token(&self) -> Option<String> {
    if let Some(gql_ctx) = self.gql_ctx {
      gql_ctx.data_opt
        ::<super::auth::auth_model::AuthToken>()
        .map(ToString::to_string)
    } else if let Some(resful_req) = self.resful_req {
      let auth_token = resful_req
        .headers()
        .get(AUTHORIZATION)
        .and_then(|value| value.to_str().ok())
        .map(ToString::to_string);
      if auth_token.is_some()  {
        return auth_token;
      }
      let query = resful_req.uri().query().map(|q| {
        url::form_urlencoded::parse(q.as_bytes())
          .into_owned()
          .collect::<HashMap<String, String>>()
      }).unwrap_or_default();
      query.get(AUTHORIZATION).cloned()
    } else {
      None
    }
  }
  
  /// 设置token, graphql跟restful的设置方式不一样
  fn set_auth_token(&mut self, auth_token: String) -> Result<()> {
    if let Some(gql_ctx) = self.gql_ctx {
      gql_ctx.insert_http_header(
        AUTHORIZATION.parse::<HeaderName>()?,
        auth_token.parse::<HeaderValue>()?,
      );
    } else {
      self.auth_token = Some(auth_token);
    }
    Ok(())
  }
  
  /// 校验token是否已经过期
  pub fn with_auth(mut self) -> Result<CtxBuilder<'a>> {
    if self.auth_model.is_some() {
      return Err(anyhow!("auth_model_not_none"));
    }
    let auth_token = self.get_auth_token();
    if auth_token.is_none() {
      return Err(anyhow!("token_empty"));
    }
    let auth_token = auth_token.unwrap();
    let mut auth_model = match get_auth_model_by_token(auth_token) {
      Ok(item) => item,
      Err(e) => {
        error!("{}", e.to_string());
        return Err(anyhow!("refresh_token_expired"));
      },
    };
    let now = self.now;
    let server_tokentimeout = server_token_timeout();
    let now_sec = now.and_utc().timestamp_millis() / 1000;
    if now_sec - server_tokentimeout > auth_model.exp {
      if now_sec - server_tokentimeout * 2 > auth_model.exp {
        return Err(anyhow!("refresh_token_expired"));
      }
      auth_model.exp = now_sec + server_tokentimeout;
      let auth_token = get_token_by_auth_model(&auth_model)?;
      self.set_auth_token(auth_token)?;
    }
    self.auth_model = Some(auth_model);
    Ok(self)
  }
  
  /// 如果auth_model能获取, 则获取, 否则不抛出异常
  #[allow(dead_code)]
  pub fn with_auth_optional(mut self) -> Result<CtxBuilder<'a>> {
    if self.auth_model.is_some() {
      return Err(anyhow!("auth_model_not_none"));
    }
    let auth_token = self.get_auth_token();
    if auth_token.is_none() {
      return Ok(self);
    }
    let auth_token = auth_token.unwrap();
    self.auth_model = get_auth_model_by_token(auth_token).ok();
    Ok(self)
  }
  
  /// 静默模式
  #[allow(dead_code)]
  pub fn with_silent_mode(mut self) -> CtxBuilder<'a> {
    self.is_silent_mode = true;
    self
  }
  
  #[allow(dead_code)]
  pub fn with_debug(
    mut self,
    is_debug: Option<bool>,
  ) -> CtxBuilder<'a> {
    self.is_debug = is_debug;
    self
  }
  
  #[allow(dead_code)]
  pub fn with_creating(
    mut self,
    is_creating: Option<bool>,
  ) -> CtxBuilder<'a> {
    self.is_creating = is_creating;
    self
  }
  
  pub fn build(self) -> Ctx {
    Ctx {
      is_tran: self.is_tran.unwrap_or_default(),
      req_id: Arc::new(self.req_id),
      tran: Arc::new(Mutex::new(None)),
      is_resful: self.resful_req.is_some(),
      auth_token: self.auth_token,
      auth_model: self.auth_model,
      now: self.now,
      is_debug: self.is_debug,
      is_silent_mode: self.is_silent_mode,
      is_creating: self.is_creating,
    }
  }
  
}

/**
 * 转义sql语句中的字段
 */
#[must_use]
pub fn escape_id(val: impl AsRef<str>) -> String {
  let mut val = val.as_ref().to_owned();
  val = val.replace('`', "``");
  val = val.replace('.', "`.`");
  val = val.trim().lines().map(|part| {
    part.trim().split_inclusive(char::is_whitespace)
      .filter(|part| !part.trim().is_empty())
      .map(|item| item.trim())
      .collect()
  }).collect::<Vec<String>>().join("");
  format!("`{}`", val)
}

/**
 * 转义sql语句中的值
 */
#[must_use]
#[allow(dead_code)]
pub fn escape(val: impl AsRef<str>) -> String {
  let mut val = val.as_ref().to_owned();
  val = val.replace('`', "``");
  val = val.replace('\'', "''");
  val = val.trim().lines().map(|part| {
    part.trim().split_inclusive(char::is_whitespace)
      .filter(|part| !part.trim().is_empty())
      .map(|item| item.trim())
      .collect()
  }).collect::<Vec<String>>().join("");
  val
}

/**
 * 获取 sql 语句中 limit 的部分
 */
#[must_use]
pub fn get_page_query(page: Option<PageInput>) -> String {
  let mut page_query = String::with_capacity(32);
  if let Some(page) = page {
    let pg_size = page.pg_size;
    if let Some(pg_size) = pg_size {
      let pg_offset = page.pg_offset.unwrap_or(0);
      page_query.push_str(" limit ");
      page_query.push_str(&pg_offset.to_string());
      page_query.push(',');
      page_query.push_str(&pg_size.to_string());
    }
  }
  page_query
}

/**
 * 获取 sql 语句中 order by 的部分
 */
#[must_use]
pub fn get_order_by_query(
  sort: Option<Vec<SortInput>>,
) -> String {
  if sort.is_none() {
    return String::new();
  }
  let sort = sort.unwrap().into_iter()
    .filter(|item| 
      !item.prop.is_empty()
    )
    .collect::<Vec<SortInput>>();
  let mut order_by_query = String::with_capacity(128);
  for item in sort {
    let prop = item.prop;
    if !order_by_query.is_empty() {
      order_by_query += ",";
    }
    order_by_query += &format!(" {} {}", escape_id(prop), item.order);
  }
  if !order_by_query.is_empty() {
    order_by_query = " order by".to_owned() + order_by_query.as_ref();
  }
  order_by_query
}

#[must_use]
pub fn get_short_uuid() -> SmolStr {
  let uuid = uuid::Uuid::new_v4();
  let uuid = uuid.to_string();
  let uuid = uuid.replace('-', "");
  // base64编码
  let uuid = general_purpose::STANDARD.encode(uuid);
  // 切割字符串22位
  let uuid = utf8_slice::from(&uuid, 22);
  uuid.into()
}

#[must_use]
pub fn get_is_debug(
  options: Option<&Options>,
) -> bool {
  if let Some(Some(is_debug)) = options.map(|options| options.get_is_debug()) {
    return is_debug;
  }
  let ctx = CTX.try_with(|ctx| ctx.clone());
  let ctx = match ctx {
    Ok(context) => context,
    Err(_) => return is_debug(),
  };
  if let Some(is_debug) = ctx.is_debug {
    return is_debug;
  }
  is_debug()
}

#[must_use]
pub fn get_is_silent_mode(
  options: Option<&Options>,
) -> bool {
  if let Some(options) = options {
    if let Some(is_silent_mode) = options.is_silent_mode {
      return is_silent_mode;
    }
  }
  let ctx = CTX.with(|ctx| ctx.clone());
  ctx.is_silent_mode
}

#[must_use]
pub fn get_is_creating(
  options: Option<&Options>,
) -> bool {
  if let Some(options) = options {
    if let Some(is_creating) = options.is_creating {
      return is_creating;
    }
  }
  let ctx = CTX.with(|ctx| ctx.clone());
  ctx.is_creating.unwrap_or_default()
}

// #[cfg(test)]
// mod tests {
  
//   use super::*;
  
//   #[test]
//   fn test_get_short_uuid() {
//     let uuid = get_short_uuid();
//     println!("{}", uuid);
//   }
  
//   #[test]
//   fn test_escape_id() {
//     let val = "a.b.c";
//     let val = escape_id(val);
//     println!("{}", val);
//   }
  
//   #[test]
//   fn test_debug_sql() {
//     let debug_args = vec!["a", "b"];
//     let sql = r#"
//       select
//         *
//       from
//         `a`.`b`
//       where 
//         a = ?
//         and b = ?
//     "#;
//     let mut debug_sql = sql.to_owned();
//     debug_sql = multiple_space_regex().replace_all(&debug_sql, " ").to_string();
//     for arg in debug_args {
//       debug_sql = debug_sql.replacen('?', &format!("'{}'", arg.replace('\'', "''")), 1);
//     }
//     println!("{}", debug_sql);
//   }
  
// }
