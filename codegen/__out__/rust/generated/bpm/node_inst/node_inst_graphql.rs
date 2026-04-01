
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

use super::node_inst_model::*;
use super::node_inst_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct NodeInstGenQuery;

#[Object(rename_args = "snake_case")]
impl NodeInstGenQuery {
  
  /// 根据搜索条件和分页查找节点实例列表
  #[graphql(name = "findAllNodeInst")]
  async fn find_all_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<NodeInstSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<NodeInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_all_node_inst(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找节点实例总数
  #[graphql(name = "findCountNodeInst")]
  async fn find_count_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<NodeInstSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_count_node_inst(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个节点实例
  #[graphql(name = "findOneNodeInst")]
  async fn find_one_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<NodeInstSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<NodeInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_one_node_inst(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个节点实例, 如果不存在则抛错
  #[graphql(name = "findOneOkNodeInst")]
  async fn find_one_ok_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<NodeInstSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<NodeInstModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_one_ok_node_inst(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找节点实例
  #[graphql(name = "findByIdNodeInst")]
  async fn find_by_id_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: NodeInstId,
  ) -> Result<Option<NodeInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_by_id_node_inst(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找节点实例, 如果不存在则抛错
  #[graphql(name = "findByIdOkNodeInst")]
  async fn find_by_id_ok_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: NodeInstId,
  ) -> Result<NodeInstModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_by_id_ok_node_inst(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找节点实例
  #[graphql(name = "findByIdsNodeInst")]
  async fn find_by_ids_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<NodeInstId>,
  ) -> Result<Vec<NodeInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_by_ids_node_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找节点实例
  #[graphql(name = "findByIdsOkNodeInst")]
  async fn find_by_ids_ok_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<NodeInstId>,
  ) -> Result<Vec<NodeInstModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        node_inst_resolver::find_by_ids_ok_node_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取节点实例字段注释
  #[graphql(name = "getFieldCommentsNodeInst")]
  async fn get_field_comments_node_inst(
    &self,
    ctx: &Context<'_>,
  ) -> Result<NodeInstFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        node_inst_resolver::get_field_comments_node_inst(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct NodeInstGenMutation;

#[Object(rename_args = "snake_case")]
impl NodeInstGenMutation {
  
  /// 创建节点实例
  #[graphql(name = "createsNodeInst")]
  async fn creates_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<NodeInstInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<NodeInstId>> {
    
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
        node_inst_resolver::creates_node_inst(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 节点实例根据id修改租户id
  #[graphql(name = "updateTenantByIdNodeInst")]
  async fn update_tenant_by_id_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: NodeInstId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        node_inst_resolver::update_tenant_by_id_node_inst(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改节点实例
  #[graphql(name = "updateByIdNodeInst")]
  async fn update_by_id_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: NodeInstId,
    #[graphql(name = "input")]
    input: NodeInstInput,
  ) -> Result<NodeInstId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        node_inst_resolver::update_by_id_node_inst(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除节点实例
  #[graphql(name = "deleteByIdsNodeInst")]
  async fn delete_by_ids_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<NodeInstId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        node_inst_resolver::delete_by_ids_node_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原节点实例
  #[graphql(name = "revertByIdsNodeInst")]
  async fn revert_by_ids_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<NodeInstId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        node_inst_resolver::revert_by_ids_node_inst(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除节点实例
  #[graphql(name = "forceDeleteByIdsNodeInst")]
  async fn force_delete_by_ids_node_inst(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<NodeInstId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        node_inst_resolver::force_delete_by_ids_node_inst(
          ids,
          None,
        )
      }).await
  }
  
}
