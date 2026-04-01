
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

use super::process_def_model::*;
use super::process_def_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct ProcessDefGenQuery;

#[Object(rename_args = "snake_case")]
impl ProcessDefGenQuery {
  
  /// 根据搜索条件和分页查找流程定义列表
  #[graphql(name = "findAllProcessDef")]
  async fn find_all_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessDefSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<ProcessDefModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_all_process_def(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找流程定义总数
  #[graphql(name = "findCountProcessDef")]
  async fn find_count_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessDefSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_count_process_def(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程定义
  #[graphql(name = "findOneProcessDef")]
  async fn find_one_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessDefSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<ProcessDefModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_one_process_def(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个流程定义, 如果不存在则抛错
  #[graphql(name = "findOneOkProcessDef")]
  async fn find_one_ok_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessDefSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<ProcessDefModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_one_ok_process_def(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程定义
  #[graphql(name = "findByIdProcessDef")]
  async fn find_by_id_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessDefId,
  ) -> Result<Option<ProcessDefModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_by_id_process_def(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程定义, 如果不存在则抛错
  #[graphql(name = "findByIdOkProcessDef")]
  async fn find_by_id_ok_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessDefId,
  ) -> Result<ProcessDefModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_by_id_ok_process_def(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程定义
  #[graphql(name = "findByIdsProcessDef")]
  async fn find_by_ids_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessDefId>,
  ) -> Result<Vec<ProcessDefModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_by_ids_process_def(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程定义
  #[graphql(name = "findByIdsOkProcessDef")]
  async fn find_by_ids_ok_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessDefId>,
  ) -> Result<Vec<ProcessDefModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_by_ids_ok_process_def(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找流程定义是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdProcessDef")]
  async fn get_is_enabled_by_id_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessDefId,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::get_is_enabled_by_id_process_def(
          id,
          None,
        )
      }).await
  }
  
  /// 获取流程定义字段注释
  #[graphql(name = "getFieldCommentsProcessDef")]
  async fn get_field_comments_process_def(
    &self,
    ctx: &Context<'_>,
  ) -> Result<ProcessDefFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        process_def_resolver::get_field_comments_process_def(
          None,
        )
      }).await
  }
  
  /// 查找 流程定义 order_by 字段的最大值
  #[graphql(name = "findLastOrderByProcessDef")]
  async fn find_last_order_by_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<ProcessDefSearch>,
  ) -> Result<u32> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        process_def_resolver::find_last_order_by_process_def(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct ProcessDefGenMutation;

#[Object(rename_args = "snake_case")]
impl ProcessDefGenMutation {
  
  /// 创建流程定义
  #[graphql(name = "createsProcessDef")]
  async fn creates_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<ProcessDefInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<ProcessDefId>> {
    
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
        process_def_resolver::creates_process_def(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 流程定义根据id修改租户id
  #[graphql(name = "updateTenantByIdProcessDef")]
  async fn update_tenant_by_id_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessDefId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_def_resolver::update_tenant_by_id_process_def(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改流程定义
  #[graphql(name = "updateByIdProcessDef")]
  async fn update_by_id_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: ProcessDefId,
    #[graphql(name = "input")]
    input: ProcessDefInput,
  ) -> Result<ProcessDefId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_def_resolver::update_by_id_process_def(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除流程定义
  #[graphql(name = "deleteByIdsProcessDef")]
  async fn delete_by_ids_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessDefId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_def_resolver::delete_by_ids_process_def(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用流程定义
  #[graphql(name = "enableByIdsProcessDef")]
  async fn enable_by_ids_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessDefId>,
    #[graphql(name = "is_enabled")]
    is_enabled: u8,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_def_resolver::enable_by_ids_process_def(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原流程定义
  #[graphql(name = "revertByIdsProcessDef")]
  async fn revert_by_ids_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessDefId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_def_resolver::revert_by_ids_process_def(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除流程定义
  #[graphql(name = "forceDeleteByIdsProcessDef")]
  async fn force_delete_by_ids_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<ProcessDefId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_def_resolver::force_delete_by_ids_process_def(
          ids,
          None,
        )
      }).await
  }
  
}
