
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

use super::transfer_model::*;
use super::transfer_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct TransferGenQuery;

#[Object(rename_args = "snake_case")]
impl TransferGenQuery {
  
  /// 根据搜索条件和分页查找转交记录列表
  #[graphql(name = "findAllTransfer")]
  async fn find_all_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TransferSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<TransferModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_all_transfer(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找转交记录总数
  #[graphql(name = "findCountTransfer")]
  async fn find_count_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TransferSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_count_transfer(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个转交记录
  #[graphql(name = "findOneTransfer")]
  async fn find_one_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TransferSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<TransferModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_one_transfer(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个转交记录, 如果不存在则抛错
  #[graphql(name = "findOneOkTransfer")]
  async fn find_one_ok_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TransferSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<TransferModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_one_ok_transfer(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找转交记录
  #[graphql(name = "findByIdTransfer")]
  async fn find_by_id_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TransferId,
  ) -> Result<Option<TransferModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_by_id_transfer(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找转交记录, 如果不存在则抛错
  #[graphql(name = "findByIdOkTransfer")]
  async fn find_by_id_ok_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TransferId,
  ) -> Result<TransferModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_by_id_ok_transfer(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找转交记录
  #[graphql(name = "findByIdsTransfer")]
  async fn find_by_ids_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TransferId>,
  ) -> Result<Vec<TransferModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_by_ids_transfer(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找转交记录
  #[graphql(name = "findByIdsOkTransfer")]
  async fn find_by_ids_ok_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TransferId>,
  ) -> Result<Vec<TransferModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        transfer_resolver::find_by_ids_ok_transfer(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取转交记录字段注释
  #[graphql(name = "getFieldCommentsTransfer")]
  async fn get_field_comments_transfer(
    &self,
    ctx: &Context<'_>,
  ) -> Result<TransferFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        transfer_resolver::get_field_comments_transfer(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct TransferGenMutation;

#[Object(rename_args = "snake_case")]
impl TransferGenMutation {
  
  /// 创建转交记录
  #[graphql(name = "createsTransfer")]
  async fn creates_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<TransferInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<TransferId>> {
    
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
        transfer_resolver::creates_transfer(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 转交记录根据id修改租户id
  #[graphql(name = "updateTenantByIdTransfer")]
  async fn update_tenant_by_id_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TransferId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        transfer_resolver::update_tenant_by_id_transfer(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改转交记录
  #[graphql(name = "updateByIdTransfer")]
  async fn update_by_id_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TransferId,
    #[graphql(name = "input")]
    input: TransferInput,
  ) -> Result<TransferId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        transfer_resolver::update_by_id_transfer(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除转交记录
  #[graphql(name = "deleteByIdsTransfer")]
  async fn delete_by_ids_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TransferId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        transfer_resolver::delete_by_ids_transfer(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原转交记录
  #[graphql(name = "revertByIdsTransfer")]
  async fn revert_by_ids_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TransferId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        transfer_resolver::revert_by_ids_transfer(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除转交记录
  #[graphql(name = "forceDeleteByIdsTransfer")]
  async fn force_delete_by_ids_transfer(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TransferId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        transfer_resolver::force_delete_by_ids_transfer(
          ids,
          None,
        )
      }).await
  }
  
}
