use std::borrow::Cow;
use std::env;
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

use async_trait::async_trait;
use chrono::{Local, DateTime, NaiveDate, NaiveTime, NaiveDateTime};
use base64::{engine::general_purpose, Engine};

use sqlx::mysql::{MySqlConnectOptions, MySqlPoolOptions};
use sqlx::{Pool, MySql, Transaction, Executor, FromRow};

use super::auth::auth_dao::{get_auth_model_by_token, get_token_by_auth_model};
use super::auth::auth_model::{AuthModel, AUTHORIZATION};
use super::cache::cache_dao::{get_cache, set_cache, del_caches, del_cache};
use super::gql::model::{SortInput, PageInput};

lazy_static! {
  static ref SERVER_TOKEN_TIMEOUT: i64 = env::var("server_tokentimeout").unwrap()
    .parse::<i64>()
    .unwrap_or(3600);
  static ref DB_POOL: Pool<MySql> = init_db_pool().unwrap();
  static ref IS_DEBUG: bool = init_debug();
}

fn init_debug() -> bool {
  let is_debug = event_enabled!(Level::INFO);
  is_debug
}

fn init_db_pool() -> Result<Pool<MySql>> {
  let database_hostname = env::var("database_hostname").unwrap_or("localhost".to_owned());
  let database_port = env::var("database_port").unwrap_or("3306".to_owned());
  let database_port: Result<u16, ParseIntError> = database_port.parse();
  let database_port = database_port.or_else(|_| Ok::<u16, ParseIntError>(3306)).unwrap();
  let database_username = env::var("database_username").unwrap_or("root".to_owned());
  let database_password = env::var("database_password").unwrap_or_default();
  let database_database = env::var("database_database").unwrap_or_default();
  let database_pool_size = env::var("database_pool_size").unwrap_or("10".to_owned());
  let default_pool_size: u32 = 10;
  let database_pool_size: Result<u32, ParseIntError> = database_pool_size.parse();
  let database_pool_size = database_pool_size.or_else(|_| Ok::<u32, ParseIntError>(default_pool_size)).unwrap();
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

#[async_trait]
pub trait Ctx<'a>: Send + Sized {
  
  fn get_not_verify_token(&self) -> bool;
  
  fn get_is_tran(&self) -> bool;
  
  fn set_is_tran(&mut self, is_tran: bool);
  
  fn get_req_id(&self) -> &str;
  
  fn get_auth_model_impl(&self) -> &Option<AuthModel>;
  
  fn set_auth_model_impl(&mut self, auth_model: Option<AuthModel>);
  
  fn set_auth_token(&mut self, auth_token: Option<String>);
  
  fn get_auth_token(&self) -> Option<String>;
  
  fn get_tran(&mut self) -> Option<&mut Transaction<'a, MySql>>;
  
  fn get_tran_owned(self) -> Option<Transaction<'a, MySql>>;
  
  fn set_tran(&mut self, tran: Transaction<'a, MySql>);
  
  fn get_now(&self) -> NaiveDateTime;
  
  fn get_server_tokentimeout(&self) -> i64 {
    SERVER_TOKEN_TIMEOUT.to_owned()
  }
  
  fn get_auth_model(
    &mut self,
  ) -> Option<AuthModel> {
    let auth_model = self.get_auth_model_impl();
    if auth_model.is_some() {
      return auth_model.to_owned();
    }
    let auth_token = self.get_auth_token();
    if auth_token.is_none() {
      return None;
    }
    let auth_token = auth_token.unwrap();
    let auth_model = get_auth_model_by_token(auth_token);
    if auth_model.is_err() {
      error!("{}", auth_model.err().unwrap());
      return None;
    }
    let auth_model = auth_model.unwrap();
    self.set_auth_model_impl(auth_model.to_owned().into());
    auth_model.into()
  }
  
  fn get_auth_tenant_id(&mut self) -> Option<String> {
    match self.get_auth_model() {
      Some(item) => item.tenant_id.into(),
      None => None,
    }
  }
  
  fn get_auth_dept_id(&mut self) -> Option<String> {
    match self.get_auth_model() {
      Some(item) => item.dept_id,
      None => None,
    }
  }
  
  fn get_auth_lang(&mut self) -> Option<String> {
    match self.get_auth_model() {
      Some(item) => item.lang.into(),
      None => None,
    }
  }
  
  /// 开启事务
  async fn begin(&mut self) -> Result<()> {
    if self.get_tran().is_some() {
      return Ok(());
    }
    info!("{} begin;", self.get_req_id());
    let tran = DB_POOL.clone().begin().await?;
    self.set_tran(tran);
    Ok(())
  }
  
  /// 提交事务
  async fn commit(mut self) -> Result<()> {
    let req_id = self.get_req_id().to_owned();
    let tran = self.get_tran_owned();
    if let Some(tran) = tran {
      info!("{} commit;", req_id);
      tran.commit().await?;
    }
    Ok(())
  }
  
  /// 回滚事务
  async fn rollback(mut self) -> Result<()> {
    let req_id = self.get_req_id().to_owned();
    let tran = self.get_tran_owned();
    if let Some(tran) = tran {
      info!("{} rollback;", req_id);
      tran.rollback().await?;
    }
    Ok(())
  }
  
  async fn ok<T>(self, res: Result<T>) -> Result<T>
  where
    T: Send + Sized,
  {
    if let Err(e) = res {
      let req_id = self.get_req_id().to_owned();
      self.rollback().await?;
      error!("{} {}", req_id, e);
      return Err(e);
    }
    self.commit().await?;
    res
  }
  
  /// 带参数执行查询
  async fn execute(
    &mut self,
    sql: String,
    args: Vec<ArgType>,
    options: Option<Options>,
  ) -> Result<u64> {
    let sql: &'a str = Box::leak(sql.into_boxed_str());
    
    let mut is_debug: bool = IS_DEBUG.clone();
    let mut is_tran = self.get_is_tran();
    if let Some(options) = &options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.get_tran().is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(arg.to_string());
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
          };
        }
        let mut debug_sql = sql.to_string();
        for arg in debug_args {
          debug_sql = debug_sql.replacen("?", &format!("'{}'", arg.replace("'", "''")), 1);
        }
        info!("{} {}", self.get_req_id(), debug_sql);
      } else {
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
          };
        }
      }
      let tran = self.get_tran().unwrap();
      let res = tran.execute(query).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.get_req_id(), e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      let rows_affected = res.rows_affected();
      if rows_affected > 0 {
        if let Some(options) = &options {
          if let Some(del_cache_key1s) = &options.del_cache_key1s {
            del_caches(del_cache_key1s).await?;
          }
        }
      }
      return Ok(rows_affected);
    }
    let mut query = sqlx::query(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(arg.to_string());
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
        };
      }
      let mut debug_sql = sql.to_string();
      for arg in debug_args {
        debug_sql = debug_sql.replacen("?", &format!("'{}'", arg.replace("'", "''")), 1);
      }
      info!("{} {}", self.get_req_id(), debug_sql);
    } else {
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
        };
      }
    }
    let res = query.execute(&DB_POOL.clone()).await?;
    let rows_affected = res.rows_affected();
    if rows_affected > 0 {
      if let Some(options) = &options {
        if let Some(del_cache_key1s) = &options.del_cache_key1s {
          del_caches(del_cache_key1s).await?;
        }
      }
    }
    Ok(rows_affected)
  }
  
  /// 带参数执行查询
  async fn query<R>(
    &mut self,
    sql: String,
    args: Vec<ArgType>,
    options: Option<Options>,
  ) -> Result<Vec<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r> + Debug,
  {
    if let Some(options) = &options {
      if options.cache_key1.is_some() && options.cache_key2.is_some() {
        let cache_key1 = options.cache_key1.as_ref().unwrap();
        let cache_key2 = options.cache_key2.as_ref().unwrap();
        let str = get_cache(cache_key1, cache_key2).await?;
        if str.is_some() {
          let str = str.unwrap();
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
    
    let sql: &'a str = Box::leak(sql.into_boxed_str());
    
    let mut is_debug: bool = IS_DEBUG.clone();
    let mut is_tran = self.get_is_tran();
    if let Some(options) = options.as_ref() {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.get_tran().is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(arg.to_string());
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
          };
        }
        let mut debug_sql = sql.to_string();
        for arg in debug_args {
          debug_sql = debug_sql.replacen("?", &format!("'{}'", arg.replace("'", "''")), 1);
        }
        info!("{} {}", self.get_req_id(), debug_sql);
      } else {
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
          };
        }
      }
      let tran = self.get_tran().unwrap();
      let res = query.fetch_all(&mut **tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.get_req_id(), e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
      
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
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(arg.to_string());
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
        };
      }
      let mut debug_sql = sql.to_string();
      for arg in debug_args {
        debug_sql = debug_sql.replacen("?", &format!("'{}'", arg.replace("'", "''")), 1);
      }
      info!("{} {}", self.get_req_id(), debug_sql);
    } else {
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
        };
      }
    }
    let res = query.fetch_all(&DB_POOL.clone()).await?;
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
  
  /// 带参数查询一条数据
  async fn query_one<R>(
    &mut self,
    sql: String,
    args: Vec<ArgType>,
    options: Option<Options>,
  ) -> Result<Option<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + Send + Sized + Unpin + Serialize + for<'r> Deserialize<'r> + Debug + Sync,
  {
    if let Some(options) = &options {
      if options.cache_key1.is_some() && options.cache_key2.is_some() {
        let cache_key1 = options.cache_key1.as_ref().unwrap();
        let cache_key2 = options.cache_key2.as_ref().unwrap();
        let str = get_cache(cache_key1, cache_key2).await?;
        if str.is_some() {
          let str = str.unwrap();
          let res2: Option<R>;
          let res = serde_json::from_str::<R>(&str);
          if let Ok(res) = res {
            res2 = res.into();
          } else {
            res2 = None;
            del_cache(cache_key1).await?;
          }
          return Ok(res2);
        }
      }
    }
    
    let sql: &'a str = Box::leak(sql.into_boxed_str());
    
    let mut is_debug = true;
    let mut is_tran = self.get_is_tran();
    if let Some(options) = &options {
      is_debug = options.is_debug;
      if let Some(is_tran0) = options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.get_tran().is_none() {
        self.begin().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      if is_debug {
        let mut debug_args = vec![];
        for arg in args {
          debug_args.push(arg.to_string());
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
          };
        }
        let query_params: sqlformat::QueryParams = sqlformat::QueryParams::Indexed(debug_args);
        let debug_sql = sqlformat::format(sql, &query_params, sqlformat::FormatOptions::default());
        info!("{} {}", self.get_req_id(), debug_sql);
      } else {
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
          };
        }
      }
      let tran = self.get_tran().unwrap();
      let res = query.fetch_optional(&mut **tran).await
        .map_err(|e| {
          let err_msg = format!("{} {}", self.get_req_id(), e.to_string());
          error!("{}", err_msg);
          anyhow::anyhow!(err_msg)
        })?;
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
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(arg.to_string());
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
        };
      }
      let query_params: sqlformat::QueryParams = sqlformat::QueryParams::Indexed(debug_args);
      let debug_sql = sqlformat::format(sql, &query_params, sqlformat::FormatOptions::default());
      info!("{} {}", self.get_req_id(), debug_sql);
    } else {
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
        };
      }
    }
    let res = query.fetch_optional(&DB_POOL.clone()).await?;
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
  
  fn insert_auth_header(&self) -> Result<()>;
  
  /// 校验token是否已经过期
  fn auth(mut self) -> Result<Self> {
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
    let now = self.get_now();
    let server_tokentimeout = self.get_server_tokentimeout();
    let now_sec = now.timestamp_millis() / 1000;
    if now_sec - server_tokentimeout > auth_model.exp {
      if now_sec - server_tokentimeout * 2 > auth_model.exp {
        return Err(anyhow!("refresh_token_expired"));
      }
      auth_model.exp = now_sec + server_tokentimeout;
      let auth_token = get_token_by_auth_model(&auth_model)?;
      self.set_auth_model_impl(Some(auth_model));
      self.insert_auth_header()?;
      self.set_auth_token(Some(auth_token));
      return Ok(self);
    }
    Ok(self)
  }
  
}

#[async_trait]
impl<'a> Ctx<'a> for CtxImpl<'a> {
  
  fn get_not_verify_token(&self) -> bool {
    self.not_verify_token
  }
  
  fn get_is_tran(&self) -> bool {
    self.is_tran
  }
  
  fn set_is_tran(&mut self, is_tran: bool) {
    self.is_tran = is_tran;
  }
  
  fn get_req_id(&self) -> &str {
    &self.req_id
  }
  
  fn set_auth_model_impl(&mut self, auth_model: Option<AuthModel>) {
    self.auth_model = auth_model;
  }
  
  fn get_auth_model_impl(&self) -> &Option<AuthModel> {
    &self.auth_model
  }
  
  fn set_auth_token(&mut self, auth_token: Option<String>) {
    self.auth_token = auth_token;
  }
  
  fn insert_auth_header(&self) -> Result<()> {
    let auth_token = self.get_auth_token();
    if auth_token.is_none() {
      return Ok(());
    }
    let auth_token = auth_token.unwrap();
    self.gql_ctx.insert_http_header(AUTHORIZATION.parse::<HeaderName>()?, auth_token.parse::<HeaderValue>()?);
    Ok(())
  }
  
  fn get_auth_token(&self) -> Option<String> {
    self.auth_token.clone()
  }
  
  fn get_tran(&mut self) -> Option<&mut Transaction<'a, MySql>> {
    self.tran.as_mut()
  }
  
  fn get_tran_owned(self) -> Option<Transaction<'a, MySql>> {
    self.tran
  }
  
  fn set_tran(&mut self, tran: Transaction<'a, MySql>) {
    self.tran = Some(tran);
  }
  
  fn get_now(&self) -> NaiveDateTime {
    self.now
  }
  
}

pub struct CtxImpl<'a> {
  
  is_tran: bool,
  
  req_id: String,
  
  tran: Option<Transaction<'a, MySql>>,
  
  not_verify_token: bool,
  
  auth_model: Option<AuthModel>,
  
  auth_token: Option<String>,
  
  gql_ctx: &'a async_graphql::Context<'a>,
  
  now: NaiveDateTime
  
}

#[derive(SimpleObject, FromRow, Debug, Default, Serialize, Deserialize)]
pub struct CountModel {
  
  pub total: i64,
  
}

#[derive(SimpleObject, FromRow, Debug, Default, Serialize, Deserialize)]
pub struct OrderByModel {
  
  pub order_by: u32,
  
}

/// "ignore" | "throw" | "update" = "throw"
#[allow(dead_code)]
#[derive(PartialEq, Clone, Debug)]
pub enum UniqueType {
  Ignore,
  Throw,
  Update,
}

#[derive(Debug)]
pub struct SrvErr {
  #[allow(dead_code)]
  code: Option<String>,
  msg: String,
}

impl SrvErr {
  pub fn msg(msg: String) -> Self {
    SrvErr {
      code: None,
      msg,
    }
  }
  #[allow(dead_code)]
  pub fn new(code: String, msg: String) -> Self {
    SrvErr {
      code: Some(code),
      msg,
    }
  }
}

impl std::error::Error for SrvErr { }

impl std::fmt::Display for SrvErr {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    write!(f, "{}", self.msg)
  }
}

#[derive(Debug, Clone)]
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
    }
  }
}

#[derive(Debug)]
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

#[derive(Default, new, Clone, Debug)]
pub struct Options {
  
  /// 是否打印sql调试语句
  #[new(value = "true")]
  is_debug: bool,
  
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
  pub fn get_is_debug(&self) -> bool {
    self.is_debug
  }
  
  #[inline]
  pub fn set_is_debug(self, is_debug: bool) -> Self {
    let mut self_ = self;
    self_.is_debug = is_debug;
    self_
  }
  
  pub fn set_cache_key(self, table: &str, sql: &str, args: &Vec<ArgType>) -> Self {
    let mut self_ = self;
    self_.cache_key1 = format!("dao.sql.{}", table).into();
    self_.cache_key2 = json!([ &sql, args ]).to_string().into();
    self_
  }
  
  pub fn set_del_cache_key1s(self, tables: Vec<&str>) -> Self {
    let mut self_ = self;
    self_.del_cache_key1s = tables.into_iter()
      .map(|table|
        format!("dao.sql.{}", table)
      )
      .collect::<Vec<String>>()
      .into()
      ;
    self_
  }
  
  pub fn get_del_cache_key1s(&self) -> Option<&Vec<String>> {
    self.del_cache_key1s.as_ref()
  }
  
  #[inline]
  pub fn get_is_tran(&self) -> Option<bool> {
    self.is_tran
  }
  
}

// impl<'a> Drop for CtxImpl<'a> {
  
//   fn drop(&mut self) {
//     if (&(self.tran)).is_some() {
//       error!("{} drop; tran is not none", self.req_id);
//     }
//   }
  
// }

impl<'a> CtxImpl<'a> {
  
  pub fn new(
    gql_ctx: &'a async_graphql::Context<'a>,
  ) -> CtxImpl<'a> {
    let now = Local::now();
    let now = NaiveDateTime::from_timestamp_opt(
      now.timestamp() + now.offset().local_minus_utc() as i64,
      now.timestamp_subsec_nanos(),
    ).unwrap();
    let req_id = now.timestamp_millis().to_string();
    let mut ctx = CtxImpl {
      is_tran: false,
      req_id,
      tran: None,
      auth_model: None,
      not_verify_token: false,
      auth_token: None,
      gql_ctx,
      now,
    };
    ctx.set_auth_token(
      gql_ctx.data_opt::<super::auth::auth_model::AuthToken>()
        .map(ToString::to_string)
    );
    ctx
  }
  
  pub fn with_tran(
    gql_ctx: &'a async_graphql::Context<'a>,
  ) -> CtxImpl<'a> {
    let mut ctx = CtxImpl::new(gql_ctx);
    ctx.set_is_tran(true);
    ctx
  }
  
}

/**
 * 转义sql语句中的字段
 */
pub fn escape_id(val: impl AsRef<str>) -> String {
  let mut val = val.as_ref().to_owned();
  val = val.replace("`", "``");
  val = val.replace(".", "`.`");
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
pub fn escape(val: impl AsRef<str>) -> String {
  let mut val = val.as_ref().to_owned();
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
 * 获取 sql 语句中 limit 的部分
 */
pub fn get_page_query(page: Option<PageInput>) -> String {
  let mut page_query = String::with_capacity(32);
  if let Some(page) = page {
    let pg_size = page.pg_size;
    if let Some(pg_size) = pg_size {
      let pg_offset = page.pg_offset.unwrap_or(0);
      page_query = format!(" limit {}, {} ", pg_offset, pg_size);
    }
  }
  page_query
}

/**
 * 获取 sql 语句中 order by 的部分
 */
pub fn get_order_by_query(
  sort: Option<Vec<SortInput>>,
) -> String {
  if sort.is_none() {
    return "".to_owned();
  }
  let sort = sort.unwrap().into_iter()
    .filter(|item| 
      !item.prop.is_empty()
    )
    .collect::<Vec<SortInput>>();
  let mut order_by_query = String::with_capacity(128);
  for item in sort {
    let prop = item.prop;
    let mut order = item.order;
    if !order_by_query.is_empty() {
      order_by_query += ",";
    }
    if order == "ascending" {
      order = "asc".to_owned();
    } else if order == "descending" {
      order = "desc".to_owned();
    }
    if order != "asc" && order != "desc" {
      continue;
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

#[cfg(test)]
mod tests {
  
  use super::*;
  
  #[test]
  fn test_get_short_uuid() {
    let uuid = get_short_uuid();
    println!("{}", uuid);
  }
  
  #[test]
  fn test_escape_id() {
    let val = "a.b.c";
    let val = escape_id(val);
    println!("{}", val);
  }
  
  #[test]
  fn test_debug_sql() {
    let debug_args = vec!["a", "b"];
    let sql = "select * from `a`.`b` where a = ? and b = ?";
    let mut debug_sql = sql.to_string();
    for arg in debug_args {
      debug_sql = debug_sql.replacen("?", &format!("'{}'", arg.replace("'", "''")), 1);
    }
    println!("{}", debug_sql);
  }
  
}
