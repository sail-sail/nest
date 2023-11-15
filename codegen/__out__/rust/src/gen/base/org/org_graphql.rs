use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::id::ID;

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

use super::org_model::*;
use super::org_resolver;

#[derive(Default)]
pub struct OrgGenQuery;

#[Object(rename_args = "snake_case")]
impl OrgGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_org(
    &self,
    ctx: &Context<'_>,
    search: Option<OrgSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_org(
    &self,
    ctx: &Context<'_>,
    search: Option<OrgSearch>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_org(
    &self,
    ctx: &Context<'_>,
    search: Option<OrgSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: ID,
  ) -> Result<Option<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 ID 查找是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: ID,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 ID 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: ID,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_org(
    &self,
    ctx: &Context<'_>,
  ) -> Result<OrgFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        org_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 order_by 字段的最大值
  async fn find_last_order_by_org(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct OrgGenMutation;

#[Object(rename_args = "snake_case")]
impl OrgGenMutation {
  
  /// 创建数据
  async fn create_org(
    &self,
    ctx: &Context<'_>,
    model: OrgInput,
    unique_type: Option<UniqueType>,
  ) -> Result<ID> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::create(
          model,
          options.into(),
        )
      }).await
  }
  
  /// 根据id修改租户id
  async fn update_tenant_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: ID,
    tenant_id: ID,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::update_tenant_by_id(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: ID,
    model: OrgInput,
  ) -> Result<ID> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::update_by_id(
          id,
          model,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或禁用数据
  async fn enable_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        org_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
