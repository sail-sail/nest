
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};
use async_graphql::{Context, Object};

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  Options,
  UniqueType,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::server_log_model::*;
use super::server_log_resolver;

#[derive(Default)]
pub struct ServerLogGenQuery;

#[Object(rename_args = "snake_case")]
impl ServerLogGenQuery {
  
  /// 根据搜索条件和分页查找系统日志列表
  #[graphql(name = "findAllServerLog")]
  async fn find_all_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ServerLogSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<ServerLogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_all_server_log(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找系统日志总数
  #[graphql(name = "findCountServerLog")]
  async fn find_count_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ServerLogSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_count_server_log(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个系统日志
  #[graphql(name = "findOneServerLog")]
  async fn find_one_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ServerLogSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<ServerLogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_one_server_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个系统日志, 如果不存在则抛错
  #[graphql(name = "findOneOkServerLog")]
  async fn find_one_ok_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ServerLogSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<ServerLogModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_one_ok_server_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统日志
  #[graphql(name = "findByIdServerLog")]
  async fn find_by_id_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ServerLogId,
  ) -> Result<Option<ServerLogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_by_id_server_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统日志, 如果不存在则抛错
  #[graphql(name = "findByIdOkServerLog")]
  async fn find_by_id_ok_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ServerLogId,
  ) -> Result<ServerLogModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_by_id_ok_server_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统日志
  #[graphql(name = "findByIdsServerLog")]
  async fn find_by_ids_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ServerLogId>,
  ) -> Result<Vec<ServerLogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_by_ids_server_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统日志
  #[graphql(name = "findByIdsOkServerLog")]
  async fn find_by_ids_ok_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ServerLogId>,
  ) -> Result<Vec<ServerLogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::find_by_ids_ok_server_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取系统日志字段注释
  #[graphql(name = "getFieldCommentsServerLog")]
  async fn get_field_comments_server_log(
    &self,
    ctx: &Context<'_>,
  ) -> Result<ServerLogFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        server_log_resolver::get_field_comments_server_log(
          None,
        )
      }).await
  }
  
  /// 下载指定日期的原始日志文件内容
  #[graphql(name = "downloadServerLog")]
  async fn download_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "log_date")]
    log_date: String,
  ) -> Result<String> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        server_log_resolver::download_server_log(
          log_date,
        )
      }).await
  }
  
  /// 获取可用的日志日期列表
  #[graphql(name = "getServerLogDates")]
  async fn get_server_log_dates(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Vec<String>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope(async {
        let dates = server_log_resolver::get_server_log_dates().await?;
        Ok(dates.iter().map(|d| d.format("%Y-%m-%d").to_string()).collect())
      }).await
  }
  
}

#[derive(Default)]
pub struct ServerLogGenMutation;

#[Object(rename_args = "snake_case")]
impl ServerLogGenMutation {
  
  /// 占位方法, 用于实现 ServerLogInput
  #[allow(unused_variables)]
  #[graphql(name = "noAddNoEditServerLog")]
  async fn no_add_no_edit_server_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: ServerLogInput,
  ) -> Result<ServerLogId> {
    
    Err(eyre!(""))
  }
  
}
