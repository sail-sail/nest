
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

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::comp_cnf_model::*;
use super::comp_cnf_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct CompCnfGenQuery;

#[Object(rename_args = "snake_case")]
impl CompCnfGenQuery {
  
  /// 根据搜索条件和分页查找组件配置列表
  #[graphql(name = "findAllCompCnf")]
  async fn find_all_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<CompCnfSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<CompCnfModel>> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_all_comp_cnf(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找组件配置总数
  #[graphql(name = "findCountCompCnf")]
  async fn find_count_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<CompCnfSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_count_comp_cnf(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个组件配置
  #[graphql(name = "findOneCompCnf")]
  async fn find_one_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<CompCnfSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<CompCnfModel>> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_one_comp_cnf(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个组件配置, 如果不存在则抛错
  #[graphql(name = "findOneOkCompCnf")]
  async fn find_one_ok_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<CompCnfSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<CompCnfModel> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_one_ok_comp_cnf(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组件配置
  #[graphql(name = "findByIdCompCnf")]
  async fn find_by_id_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: CompCnfId,
  ) -> Result<Option<CompCnfModel>> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_by_id_comp_cnf(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组件配置, 如果不存在则抛错
  #[graphql(name = "findByIdOkCompCnf")]
  async fn find_by_id_ok_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: CompCnfId,
  ) -> Result<CompCnfModel> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_by_id_ok_comp_cnf(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组件配置
  #[graphql(name = "findByIdsCompCnf")]
  async fn find_by_ids_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<CompCnfId>,
  ) -> Result<Vec<CompCnfModel>> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_by_ids_comp_cnf(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件判断组件配置是否存在
  #[graphql(name = "existsCompCnf")]
  async fn exists_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<CompCnfSearch>,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::exists_comp_cnf(
          search,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组件配置
  #[graphql(name = "findByIdsOkCompCnf")]
  async fn find_by_ids_ok_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<CompCnfId>,
  ) -> Result<Vec<CompCnfModel>> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_by_ids_ok_comp_cnf(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取组件配置字段注释
  #[graphql(name = "getFieldCommentsCompCnf")]
  async fn get_field_comments_comp_cnf(
    &self,
    ctx: &Context<'_>,
  ) -> Result<CompCnfFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        comp_cnf_resolver::get_field_comments_comp_cnf(
          None,
        )
      }).await
  }
  
  /// 查找 组件配置 order_by 字段的最大值
  #[graphql(name = "findLastOrderByCompCnf")]
  async fn find_last_order_by_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<CompCnfSearch>,
  ) -> Result<u32> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .build()
      .scope({
        comp_cnf_resolver::find_last_order_by_comp_cnf(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct CompCnfGenMutation;

#[Object(rename_args = "snake_case")]
impl CompCnfGenMutation {
  
  /// 创建组件配置
  #[graphql(name = "createsCompCnf")]
  async fn creates_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<CompCnfInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<CompCnfId>> {
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .with_tran()
      .with_creating(Some(true))
      .build()
      .scope({
        comp_cnf_resolver::creates_comp_cnf(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 组件配置根据id修改租户id
  #[graphql(name = "updateTenantByIdCompCnf")]
  async fn update_tenant_by_id_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: CompCnfId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .with_tran()
      .build()
      .scope({
        comp_cnf_resolver::update_tenant_by_id_comp_cnf(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改组件配置
  #[graphql(name = "updateByIdCompCnf")]
  async fn update_by_id_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: CompCnfId,
    #[graphql(name = "input")]
    input: CompCnfInput,
  ) -> Result<CompCnfId> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .with_tran()
      .build()
      .scope({
        comp_cnf_resolver::update_by_id_comp_cnf(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除组件配置
  #[graphql(name = "deleteByIdsCompCnf")]
  async fn delete_by_ids_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<CompCnfId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .with_tran()
      .build()
      .scope({
        comp_cnf_resolver::delete_by_ids_comp_cnf(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原组件配置
  #[graphql(name = "revertByIdsCompCnf")]
  async fn revert_by_ids_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<CompCnfId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .with_tran()
      .build()
      .scope({
        comp_cnf_resolver::revert_by_ids_comp_cnf(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除组件配置
  #[graphql(name = "forceDeleteByIdsCompCnf")]
  async fn force_delete_by_ids_comp_cnf(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<CompCnfId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth_optional()?
      .with_tran()
      .build()
      .scope({
        comp_cnf_resolver::force_delete_by_ids_comp_cnf(
          ids,
          None,
        )
      }).await
  }
  
}
