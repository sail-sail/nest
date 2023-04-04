use std::fmt::{Debug, Display};

use anyhow::{Ok, Result};
use chrono::{Local, DateTime};

use async_graphql::Context;
use sqlx::{Pool, MySql, Transaction, Executor, Execute};
use tracing::{info, error};

pub struct Ctx<'a> {
  
  pub gql_ctx: Context<'a>,
  
  pub is_tran: bool,
  pub req_id: String,
  
  pub cache_key1s: Vec<String>,
  
  pub tran: Option<Transaction<'a, MySql>>,
  
}

#[derive(Debug)]
pub struct QueryArgs<'a, T>
where
  T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug,
{
  
  value: &'a Vec<T>,
  
}

pub struct QueryOptions {
  
  /** 是否打印sql语句 */
  pub is_debug: Option<bool>,
  
  /** 是否开启事务 */
  is_tran: Option<bool>,
  
}

impl QueryOptions {
  
  pub fn new(
    is_tran: Option<bool>,
  ) -> QueryOptions {
    QueryOptions {
      is_debug: Some(true),
      is_tran,
    }
  }
  
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
  ) -> Result<u64> {
    if self.is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let query = sqlx::query(sql);
      let debug_sql = query.sql();
      info!("{} {}", self.req_id, debug_sql);
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
  pub async fn execute_with<
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Display,
  >(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
  ) -> Result<u64> {
    if self.is_tran {
      if self.tran.is_none() {
        self.begin().await?;
      }
      let mut debug_args = vec![];
      let mut query = sqlx::query(sql);
      for arg in args {
        debug_args.push(format!("{:?}", arg.to_string()));
        query = query.bind(arg);
      }
      {
        let mut debug_sql = query.sql().to_string();
        for debug_arg in debug_args {
          debug_sql = debug_sql.replace("?", &debug_arg);
        }
        info!("{} {}", self.req_id, debug_sql);
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
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Display + Debug,
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
          debug_args.push(format!("'{}'", arg.to_string()));
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
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg.to_string()));
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
    let res = query.fetch_all(pool).await
      .map_err(|e| {
        let err_msg = format!("{} {}", self.req_id, e.to_string());
        error!("{}", err_msg);
        anyhow::anyhow!(err_msg)
      })?;
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
          debug_args.push(format!("'{}'", arg.to_string()));
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
      return Ok(res);
    }
    let mut query = sqlx::query_as::<_, R>(sql);
    if is_debug {
      let mut debug_args = vec![];
      for arg in args {
        debug_args.push(format!("'{}'", arg.to_string()));
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
    Ok(res)
  }
     
}
