#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};
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

use super::tenant_model::*;
use super::tenant_resolver;

#[derive(Default)]
pub struct TenantGenQuery;

#[Object(rename_args = "snake_case")]
impl TenantGenQuery {
  
  /// 根据搜索条件和分页查找租户列表
  async fn find_all_tenant(
    &self,
    ctx: &Context<'_>,
    search: Option<TenantSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<TenantModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找租户总数
  async fn find_count_tenant(
    &self,
    ctx: &Context<'_>,
    search: Option<TenantSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个租户
  async fn find_one_tenant(
    &self,
    ctx: &Context<'_>,
    search: Option<TenantSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<TenantModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找租户
  async fn find_by_id_tenant(
    &self,
    ctx: &Context<'_>,
    id: TenantId,
  ) -> Result<Option<TenantModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找租户
  async fn find_by_ids_tenant(
    &self,
    ctx: &Context<'_>,
    ids: Vec<TenantId>,
  ) -> Result<Vec<TenantModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找租户是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_tenant(
    &self,
    ctx: &Context<'_>,
    id: TenantId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找租户是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_tenant(
    &self,
    ctx: &Context<'_>,
    id: TenantId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取租户字段注释
  async fn get_field_comments_tenant(
    &self,
    ctx: &Context<'_>,
  ) -> Result<TenantFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        tenant_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 租户 order_by 字段的最大值
  async fn find_last_order_by_tenant(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        tenant_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct TenantGenMutation;

#[Object(rename_args = "snake_case")]
impl TenantGenMutation {
  
  /// 创建租户
  async fn creates_tenant(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<TenantInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<TenantId>> {
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
        tenant_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改租户
  async fn update_by_id_tenant(
    &self,
    ctx: &Context<'_>,
    id: TenantId,
    input: TenantInput,
  ) -> Result<TenantId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tenant_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除租户
  async fn delete_by_ids_tenant(
    &self,
    ctx: &Context<'_>,
    ids: Vec<TenantId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tenant_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用租户
  async fn enable_by_ids_tenant(
    &self,
    ctx: &Context<'_>,
    ids: Vec<TenantId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tenant_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_tenant(
    &self,
    ctx: &Context<'_>,
    ids: Vec<TenantId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tenant_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原租户
  async fn revert_by_ids_tenant(
    &self,
    ctx: &Context<'_>,
    ids: Vec<TenantId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tenant_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除租户
  async fn force_delete_by_ids_tenant(
    &self,
    ctx: &Context<'_>,
    ids: Vec<TenantId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tenant_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
