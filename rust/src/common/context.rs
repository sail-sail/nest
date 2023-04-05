use std::fmt::{Debug, Display};
use std::collections::HashMap;

use anyhow::{Ok, Result};
use chrono::{Local, DateTime};

use async_graphql::Context;
use sqlx::{Pool, MySql, Transaction, Executor, Execute};
use tracing::{info, error};

use super::gql::model::SortInput;

pub struct Ctx<'a> {
  
  pub gql_ctx: Context<'a>,
  
  is_tran: bool,
  pub req_id: String,
  
  pub cache_key1s: Vec<String>,
  
  pub tran: Option<Transaction<'a, MySql>>,
  
  /**
   * 缓存map
   *   auth_model: AuthModel
   *   tenant_id: "usr_tenant_id_" + usr_id
   */
  pub cache_map: HashMap<String, String>,
  
  pub not_verify_token: bool,
  
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

pub struct QueryOptions {
  
  /** 是否打印sql语句 */
  pub is_debug: Option<bool>,
  
  /** 是否开启事务 */
  pub is_tran: Option<bool>,
  
  pub cache_key1: Option<String>,
  
  pub cache_key2: Option<String>,
  
}

impl QueryOptions {
  
  #[inline]
  pub fn get_is_tran(&self) -> Option<bool> {
    self.is_tran
  }
  
}

impl<'a> Drop for Ctx<'a> {
  
  fn drop(&mut self) {
    if (&(self.tran)).is_some() {
      error!("{} drop; tran is not none", self.req_id);
    }
  }
  
}

impl<'a> Ctx<'a> {
  
  pub fn new(
    gql_ctx: &'a Context<'a>,
    is_tran: bool,
  ) -> Ctx {
    let now: DateTime<Local> = Local::now();
    let req_id = now.timestamp_millis().to_string();
    if is_tran {
      info!("{} is_tran", req_id);
    }
    let gql_ctx = gql_ctx.to_owned();
    Ctx {
      gql_ctx,
      is_tran,
      req_id,
      cache_key1s: Vec::new(),
      tran: None,
      cache_map: HashMap::new(),
      not_verify_token: false,
    }
  }
  
  // pub fn get_is_tran(&self) -> bool {
  //   return self.is_tran;
  // }
  
  /// 开启事务
  pub async fn begin(&mut self) -> Result<()> {
    if self.tran.is_some() {
      return Ok(());
    }
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| anyhow::anyhow!(e.message))?;
    info!("{} begin;", self.req_id);
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
    options: Option<QueryOptions>,
  ) -> Result<u64> {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(query_options) = options {
      if let Some(is_debug0) = query_options.is_debug {
        is_debug = is_debug0;
      }
      if let Some(is_tran0) = query_options.get_is_tran() {
        is_tran = is_tran0;
      }
    }
    
    if is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query(sql);
      if is_debug {
        let debug_sql = query.sql();
        info!("{} {}", self.req_id, debug_sql);
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
      let debug_sql = query.sql();
      info!("{} {}", self.req_id, debug_sql);
    }
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.message);
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let res = query.execute(pool).await
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
    options: Option<QueryOptions>,
  ) -> Result<u64> {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(query_options) = options {
      if let Some(is_debug0) = query_options.is_debug {
        is_debug = is_debug0;
      }
      if let Some(is_tran0) = query_options.get_is_tran() {
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
        let mut debug_sql = query.sql().to_string();
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
    for arg in args {
      query = query.bind(arg);
    }
    let debug_sql = query.sql();
    info!("{} {}", self.req_id, debug_sql);
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.message);
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let res = query.execute(pool).await
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
    options: Option<QueryOptions>,
  ) -> Result<Vec<R>>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + std::marker::Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(query_options) = options {
      if let Some(is_debug0) = query_options.is_debug {
        is_debug = is_debug0;
      }
      if let Some(is_tran0) = query_options.get_is_tran() {
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
        let mut debug_sql = query.sql().to_string();
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
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.message);
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let res = query.fetch_all(pool).await
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
    options: Option<QueryOptions>,
  ) -> Result<Vec<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + std::marker::Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(query_options) = options {
      if let Some(is_debug0) = query_options.is_debug {
        is_debug = is_debug0;
      }
      if let Some(is_tran0) = query_options.get_is_tran() {
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
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.message);
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let res = query.fetch_all(pool).await
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
    options: Option<QueryOptions>,
  ) -> Result<R>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + std::marker::Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(query_options) = options {
      if let Some(is_debug0) = query_options.is_debug {
        is_debug = is_debug0;
      }
      if let Some(is_tran0) = query_options.get_is_tran() {
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
        let mut debug_sql = query.sql().to_string();
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
      let mut debug_sql = query.sql().to_string();
      for debug_arg in debug_args {
        debug_sql = debug_sql.replace("?", &debug_arg);
      }
      info!("{} {}", self.req_id, debug_sql);
    } else {
      for arg in args {
        query = query.bind(arg);
      }
    }
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.message);
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let res = query.fetch_one(pool).await
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
    options: Option<QueryOptions>,
  ) -> Result<R>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + std::marker::Send + Unpin,
  {
    let mut is_debug = true;
    let mut is_tran = self.is_tran;
    if let Some(query_options) = options {
      if let Some(is_debug0) = query_options.is_debug {
        is_debug = is_debug0;
      }
      if let Some(is_tran0) = query_options.get_is_tran() {
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
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.message);
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
    let res = query.fetch_one(pool).await
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
    order_by_query = " order by".to_owned() + &order_by_query;
  }
  order_by_query
}
