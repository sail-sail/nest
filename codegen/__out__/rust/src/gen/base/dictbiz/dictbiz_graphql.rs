use anyhow::Result;
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

use super::dictbiz_model::*;
use super::dictbiz_resolver;

use crate::gen::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DictbizGenQuery;

#[Object(rename_args = "snake_case")]
impl DictbizGenQuery {
  
  /// 根据搜索条件和分页查找业务字典列表
  async fn find_all_dictbiz(
    &self,
    ctx: &Context<'_>,
    search: Option<DictbizSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找业务字典总数
  async fn find_count_dictbiz(
    &self,
    ctx: &Context<'_>,
    search: Option<DictbizSearch>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个业务字典
  async fn find_one_dictbiz(
    &self,
    ctx: &Context<'_>,
    search: Option<DictbizSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典
  async fn find_by_id_dictbiz(
    &self,
    ctx: &Context<'_>,
    id: DictbizId,
  ) -> Result<Option<DictbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_dictbiz(
    &self,
    ctx: &Context<'_>,
    id: DictbizId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_dictbiz(
    &self,
    ctx: &Context<'_>,
    id: DictbizId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取业务字典字段注释
  async fn get_field_comments_dictbiz(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DictbizFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dictbiz_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 业务字典 order_by 字段的最大值
  async fn find_last_order_by_dictbiz(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DictbizGenMutation;

#[Object(rename_args = "snake_case")]
impl DictbizGenMutation {
  
  /// 创建业务字典
  async fn create_dictbiz(
    &self,
    ctx: &Context<'_>,
    input: DictbizInput,
    unique_type: Option<UniqueType>,
  ) -> Result<DictbizId> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::create(
          input,
          options.into(),
        )
      }).await
  }
  
  /// 批量创建业务字典
  async fn creates_dictbiz(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DictbizInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DictbizId>> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 业务字典根据id修改租户id
  async fn update_tenant_by_id_dictbiz(
    &self,
    ctx: &Context<'_>,
    id: DictbizId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::update_tenant_by_id(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改业务字典
  async fn update_by_id_dictbiz(
    &self,
    ctx: &Context<'_>,
    id: DictbizId,
    input: DictbizInput,
  ) -> Result<DictbizId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除业务字典
  async fn delete_by_ids_dictbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用业务字典
  async fn enable_by_ids_dictbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_dictbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原业务字典
  async fn revert_by_ids_dictbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除业务字典
  async fn force_delete_by_ids_dictbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dictbiz_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}