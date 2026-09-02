
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

use super::tsdb_app_model::*;
use super::tsdb_app_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct TsdbAppGenQuery;

#[Object(rename_args = "snake_case")]
impl TsdbAppGenQuery {
  
  /// 根据搜索条件和分页查找时序数据库列表
  #[graphql(name = "findAllTsdbApp")]
  async fn find_all_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TsdbAppSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<TsdbAppModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_all_tsdb_app(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找时序数据库总数
  #[graphql(name = "findCountTsdbApp")]
  async fn find_count_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TsdbAppSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_count_tsdb_app(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个时序数据库
  #[graphql(name = "findOneTsdbApp")]
  async fn find_one_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TsdbAppSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<TsdbAppModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_one_tsdb_app(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个时序数据库, 如果不存在则抛错
  #[graphql(name = "findOneOkTsdbApp")]
  async fn find_one_ok_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TsdbAppSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<TsdbAppModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_one_ok_tsdb_app(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找时序数据库
  #[graphql(name = "findByIdTsdbApp")]
  async fn find_by_id_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TsdbAppId,
  ) -> Result<Option<TsdbAppModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_by_id_tsdb_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找时序数据库, 如果不存在则抛错
  #[graphql(name = "findByIdOkTsdbApp")]
  async fn find_by_id_ok_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TsdbAppId,
  ) -> Result<TsdbAppModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_by_id_ok_tsdb_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找时序数据库
  #[graphql(name = "findByIdsTsdbApp")]
  async fn find_by_ids_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TsdbAppId>,
  ) -> Result<Vec<TsdbAppModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_by_ids_tsdb_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件判断时序数据库是否存在
  #[graphql(name = "existsTsdbApp")]
  async fn exists_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TsdbAppSearch>,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::exists_tsdb_app(
          search,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找时序数据库
  #[graphql(name = "findByIdsOkTsdbApp")]
  async fn find_by_ids_ok_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TsdbAppId>,
  ) -> Result<Vec<TsdbAppModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_by_ids_ok_tsdb_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找时序数据库是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdTsdbApp")]
  async fn get_is_enabled_by_id_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TsdbAppId,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::get_is_enabled_by_id_tsdb_app(
          id,
          None,
        )
      }).await
  }
  
  /// 获取时序数据库字段注释
  #[graphql(name = "getFieldCommentsTsdbApp")]
  async fn get_field_comments_tsdb_app(
    &self,
    ctx: &Context<'_>,
  ) -> Result<TsdbAppFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        tsdb_app_resolver::get_field_comments_tsdb_app(
          None,
        )
      }).await
  }
  
  /// 查找 时序数据库 order_by 字段的最大值
  #[graphql(name = "findLastOrderByTsdbApp")]
  async fn find_last_order_by_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TsdbAppSearch>,
  ) -> Result<u32> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tsdb_app_resolver::find_last_order_by_tsdb_app(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct TsdbAppGenMutation;

#[Object(rename_args = "snake_case")]
impl TsdbAppGenMutation {
  
  /// 创建时序数据库
  #[graphql(name = "createsTsdbApp")]
  async fn creates_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<TsdbAppInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<TsdbAppId>> {
    
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
        tsdb_app_resolver::creates_tsdb_app(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 时序数据库根据id修改租户id
  #[graphql(name = "updateTenantByIdTsdbApp")]
  async fn update_tenant_by_id_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TsdbAppId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tsdb_app_resolver::update_tenant_by_id_tsdb_app(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改时序数据库
  #[graphql(name = "updateByIdTsdbApp")]
  async fn update_by_id_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TsdbAppId,
    #[graphql(name = "input")]
    input: TsdbAppInput,
  ) -> Result<TsdbAppId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tsdb_app_resolver::update_by_id_tsdb_app(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除时序数据库
  #[graphql(name = "deleteByIdsTsdbApp")]
  async fn delete_by_ids_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TsdbAppId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tsdb_app_resolver::delete_by_ids_tsdb_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用时序数据库
  #[graphql(name = "enableByIdsTsdbApp")]
  async fn enable_by_ids_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TsdbAppId>,
    #[graphql(name = "is_enabled")]
    is_enabled: u8,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tsdb_app_resolver::enable_by_ids_tsdb_app(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原时序数据库
  #[graphql(name = "revertByIdsTsdbApp")]
  async fn revert_by_ids_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TsdbAppId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tsdb_app_resolver::revert_by_ids_tsdb_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除时序数据库
  #[graphql(name = "forceDeleteByIdsTsdbApp")]
  async fn force_delete_by_ids_tsdb_app(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TsdbAppId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tsdb_app_resolver::force_delete_by_ids_tsdb_app(
          ids,
          None,
        )
      }).await
  }
  
}
