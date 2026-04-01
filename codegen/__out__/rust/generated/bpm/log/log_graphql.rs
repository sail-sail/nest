
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

use super::log_model::*;
use super::log_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct LogGenQuery;

#[Object(rename_args = "snake_case")]
impl LogGenQuery {
  
  /// 根据搜索条件和分页查找流程日志列表
  #[graphql(name = "findAllLog")]
  async fn find_all_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<LogSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<LogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_all_log(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找流程日志总数
  #[graphql(name = "findCountLog")]
  async fn find_count_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<LogSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_count_log(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程日志
  #[graphql(name = "findOneLog")]
  async fn find_one_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<LogSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<LogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_one_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程日志, 如果不存在则抛错
  #[graphql(name = "findOneOkLog")]
  async fn find_one_ok_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<LogSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<LogModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_one_ok_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程日志
  #[graphql(name = "findByIdLog")]
  async fn find_by_id_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: LogId,
  ) -> Result<Option<LogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_by_id_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程日志, 如果不存在则抛错
  #[graphql(name = "findByIdOkLog")]
  async fn find_by_id_ok_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: LogId,
  ) -> Result<LogModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_by_id_ok_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程日志
  #[graphql(name = "findByIdsLog")]
  async fn find_by_ids_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<LogId>,
  ) -> Result<Vec<LogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_by_ids_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程日志
  #[graphql(name = "findByIdsOkLog")]
  async fn find_by_ids_ok_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<LogId>,
  ) -> Result<Vec<LogModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        log_resolver::find_by_ids_ok_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取流程日志字段注释
  #[graphql(name = "getFieldCommentsLog")]
  async fn get_field_comments_log(
    &self,
    ctx: &Context<'_>,
  ) -> Result<LogFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        log_resolver::get_field_comments_log(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct LogGenMutation;

#[Object(rename_args = "snake_case")]
impl LogGenMutation {
  
  /// 创建流程日志
  #[graphql(name = "createsLog")]
  async fn creates_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<LogInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<LogId>> {
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .with_creating(Some(true))
      .build()
      .scope({
        log_resolver::creates_log(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 流程日志根据id修改租户id
  #[graphql(name = "updateTenantByIdLog")]
  async fn update_tenant_by_id_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: LogId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        log_resolver::update_tenant_by_id_log(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改流程日志
  #[graphql(name = "updateByIdLog")]
  async fn update_by_id_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: LogId,
    #[graphql(name = "input")]
    input: LogInput,
  ) -> Result<LogId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        log_resolver::update_by_id_log(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除流程日志
  #[graphql(name = "deleteByIdsLog")]
  async fn delete_by_ids_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<LogId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        log_resolver::delete_by_ids_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原流程日志
  #[graphql(name = "revertByIdsLog")]
  async fn revert_by_ids_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<LogId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        log_resolver::revert_by_ids_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除流程日志
  #[graphql(name = "forceDeleteByIdsLog")]
  async fn force_delete_by_ids_log(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<LogId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        log_resolver::force_delete_by_ids_log(
          ids,
          None,
        )
      }).await
  }
  
}
