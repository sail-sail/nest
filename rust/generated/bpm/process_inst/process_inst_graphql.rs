
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

use super::process_inst_model::*;
use super::process_inst_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct ProcessInstGenQuery;

#[Object(rename_args = "snake_case")]
impl ProcessInstGenQuery {
  
  /// 根据搜索条件和分页查找流程实例列表
  #[graphql(name = "findAllProcessInst")]
  async fn find_all_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessInstSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<ProcessInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_all_process_inst(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找流程实例总数
  #[graphql(name = "findCountProcessInst")]
  async fn find_count_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessInstSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_count_process_inst(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程实例
  #[graphql(name = "findOneProcessInst")]
  async fn find_one_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessInstSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<ProcessInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_one_process_inst(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程实例, 如果不存在则抛错
  #[graphql(name = "findOneOkProcessInst")]
  async fn find_one_ok_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessInstSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<ProcessInstModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_one_ok_process_inst(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程实例
  #[graphql(name = "findByIdProcessInst")]
  async fn find_by_id_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessInstId,
  ) -> Result<Option<ProcessInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_by_id_process_inst(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程实例, 如果不存在则抛错
  #[graphql(name = "findByIdOkProcessInst")]
  async fn find_by_id_ok_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessInstId,
  ) -> Result<ProcessInstModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_by_id_ok_process_inst(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程实例
  #[graphql(name = "findByIdsProcessInst")]
  async fn find_by_ids_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessInstId>,
  ) -> Result<Vec<ProcessInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_by_ids_process_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程实例
  #[graphql(name = "findByIdsOkProcessInst")]
  async fn find_by_ids_ok_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessInstId>,
  ) -> Result<Vec<ProcessInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_inst_resolver::find_by_ids_ok_process_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取流程实例字段注释
  #[graphql(name = "getFieldCommentsProcessInst")]
  async fn get_field_comments_process_inst(
    &self,
    ctx: &Context<'_>,
  ) -> Result<ProcessInstFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        process_inst_resolver::get_field_comments_process_inst(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct ProcessInstGenMutation;

#[Object(rename_args = "snake_case")]
impl ProcessInstGenMutation {
  
  /// 创建流程实例
  #[graphql(name = "createsProcessInst")]
  async fn creates_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<ProcessInstInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<ProcessInstId>> {
    
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
        process_inst_resolver::creates_process_inst(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 流程实例根据id修改租户id
  #[graphql(name = "updateTenantByIdProcessInst")]
  async fn update_tenant_by_id_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessInstId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_inst_resolver::update_tenant_by_id_process_inst(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改流程实例
  #[graphql(name = "updateByIdProcessInst")]
  async fn update_by_id_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessInstId,
    #[graphql(name = "input")]
    input: ProcessInstInput,
  ) -> Result<ProcessInstId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_inst_resolver::update_by_id_process_inst(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除流程实例
  #[graphql(name = "deleteByIdsProcessInst")]
  async fn delete_by_ids_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessInstId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_inst_resolver::delete_by_ids_process_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原流程实例
  #[graphql(name = "revertByIdsProcessInst")]
  async fn revert_by_ids_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessInstId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_inst_resolver::revert_by_ids_process_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除流程实例
  #[graphql(name = "forceDeleteByIdsProcessInst")]
  async fn force_delete_by_ids_process_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessInstId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_inst_resolver::force_delete_by_ids_process_inst(
          ids,
          None,
        )
      }).await
  }
  
}
