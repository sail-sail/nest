
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

use super::process_revision_model::*;
use super::process_revision_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct ProcessRevisionGenQuery;

#[Object(rename_args = "snake_case")]
impl ProcessRevisionGenQuery {
  
  /// 根据搜索条件和分页查找流程版本列表
  #[graphql(name = "findAllProcessRevision")]
  async fn find_all_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessRevisionSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<ProcessRevisionModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_all_process_revision(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找流程版本总数
  #[graphql(name = "findCountProcessRevision")]
  async fn find_count_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessRevisionSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_count_process_revision(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程版本
  #[graphql(name = "findOneProcessRevision")]
  async fn find_one_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessRevisionSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<ProcessRevisionModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_one_process_revision(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程版本, 如果不存在则抛错
  #[graphql(name = "findOneOkProcessRevision")]
  async fn find_one_ok_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessRevisionSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<ProcessRevisionModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_one_ok_process_revision(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程版本
  #[graphql(name = "findByIdProcessRevision")]
  async fn find_by_id_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessRevisionId,
  ) -> Result<Option<ProcessRevisionModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_by_id_process_revision(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程版本, 如果不存在则抛错
  #[graphql(name = "findByIdOkProcessRevision")]
  async fn find_by_id_ok_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessRevisionId,
  ) -> Result<ProcessRevisionModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_by_id_ok_process_revision(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程版本
  #[graphql(name = "findByIdsProcessRevision")]
  async fn find_by_ids_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessRevisionId>,
  ) -> Result<Vec<ProcessRevisionModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_by_ids_process_revision(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程版本
  #[graphql(name = "findByIdsOkProcessRevision")]
  async fn find_by_ids_ok_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessRevisionId>,
  ) -> Result<Vec<ProcessRevisionModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_revision_resolver::find_by_ids_ok_process_revision(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取流程版本字段注释
  #[graphql(name = "getFieldCommentsProcessRevision")]
  async fn get_field_comments_process_revision(
    &self,
    ctx: &Context<'_>,
  ) -> Result<ProcessRevisionFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        process_revision_resolver::get_field_comments_process_revision(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct ProcessRevisionGenMutation;

#[Object(rename_args = "snake_case")]
impl ProcessRevisionGenMutation {
  
  /// 创建流程版本
  #[graphql(name = "createsProcessRevision")]
  async fn creates_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<ProcessRevisionInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<ProcessRevisionId>> {
    
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
        process_revision_resolver::creates_process_revision(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 流程版本根据id修改租户id
  #[graphql(name = "updateTenantByIdProcessRevision")]
  async fn update_tenant_by_id_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessRevisionId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_revision_resolver::update_tenant_by_id_process_revision(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改流程版本
  #[graphql(name = "updateByIdProcessRevision")]
  async fn update_by_id_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessRevisionId,
    #[graphql(name = "input")]
    input: ProcessRevisionInput,
  ) -> Result<ProcessRevisionId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_revision_resolver::update_by_id_process_revision(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除流程版本
  #[graphql(name = "deleteByIdsProcessRevision")]
  async fn delete_by_ids_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessRevisionId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_revision_resolver::delete_by_ids_process_revision(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原流程版本
  #[graphql(name = "revertByIdsProcessRevision")]
  async fn revert_by_ids_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessRevisionId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_revision_resolver::revert_by_ids_process_revision(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除流程版本
  #[graphql(name = "forceDeleteByIdsProcessRevision")]
  async fn force_delete_by_ids_process_revision(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessRevisionId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_revision_resolver::force_delete_by_ids_process_revision(
          ids,
          None,
        )
      }).await
  }
  
}
