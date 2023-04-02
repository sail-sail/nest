use std::fmt::{Debug, Display};

use anyhow::{Ok, Result};
use chrono::{Local, DateTime};

use async_graphql::Context;
use sqlx::{Pool, MySql, Transaction, Executor, Execute};
use tracing::{info, error};

pub struct ReqContext<'a> {
  
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
  pub is_tran: Option<bool>,
  
}

impl<'a> ReqContext<'a> {
  
  pub fn new(
    gql_ctx: Context<'a>,
  ) -> ReqContext {
    let now: DateTime<Local> = Local::now();
    let req_id = now.timestamp_millis().to_string();
    ReqContext {
      gql_ctx,
      is_tran: false,
      req_id,
      cache_key1s: Vec::new(),
      tran: None,
    }
  }
  
  /// 开启事务
  pub async fn begin_tran(&mut self) -> Result<()> {
    if self.tran.is_some() {
      return Ok(());
    }
    let pool = self.gql_ctx.data::<Pool<MySql>>()
      .map_err(|e| anyhow::anyhow!(e.message))?;
    let tran = pool.begin().await?;
    self.tran = Some(tran);
    Ok(())
  }
  
  /// 提交事务
  pub async fn commit_tran(mut self) -> Result<()> {
    if let Some(tran) = self.tran {
      self.tran = None;
      info!("{} commit", self.req_id);
      tran.commit().await?;
    }
    Ok(())
  }
  
  /// 回滚事务
  pub async fn rollback_tran(mut self) -> Result<()> {
    if let Some(tran) = self.tran {
      self.tran = None;
      tran.rollback().await?;
    }
    Ok(())
  }
  
  /// 执行查询
  pub async fn execute<T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql>>(
    &mut self,
    sql: &'a str,
  ) -> Result<u64> {
    if self.is_tran {
      if self.tran.is_none() {
        self.begin_tran().await?;
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
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Display + Debug,
  >(
    &mut self,
    sql: &'a str,
    args: Vec<T>,
  ) -> Result<u64> {
    if self.is_tran {
      if self.tran.is_none() {
        self.begin_tran().await?;
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
    if let Some(query_options) = options {
      if let Some(is_debug0) = query_options.is_debug {
        is_debug = is_debug0;
      }
    }
    if self.is_tran {
      if self.tran.is_none() {
        self.begin_tran().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      for arg in args {
        query = query.bind(arg);
      }
      info!("{} {}", self.req_id, sql);
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
  ) -> Result<Vec<R>>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + std::marker::Send + Unpin,
  {
    if self.is_tran {
      if self.tran.is_none() {
        self.begin_tran().await?;
      }
      let query = sqlx::query_as::<_, R>(sql);
      info!("{} {}", self.req_id, sql);
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
  ) -> Result<R>
  where
    T: 'a + Send + sqlx::encode::Encode<'a, sqlx::MySql> + sqlx::Type<sqlx::MySql> + Debug + Display,
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + std::marker::Send + Unpin,
  {
    if self.is_tran {
      if self.tran.is_none() {
        self.begin_tran().await?;
      }
      let mut query = sqlx::query_as::<_, R>(sql);
      for arg in args {
        query = query.bind(arg);
      }
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
    let mut query = sqlx::query_as::<_, R>(sql);
    let mut debug_args = vec![];
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
  ) -> Result<R>
  where
    R: for<'r> sqlx::FromRow<'r, <MySql as sqlx::Database>::Row> + std::marker::Send + Unpin,
  {
    if self.is_tran {
      if self.tran.is_none() {
        self.begin_tran().await?;
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
    info!("{} {}", self.req_id, sql);
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
