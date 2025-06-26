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

use super::optbiz_model::*;
use super::optbiz_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct OptbizGenQuery;

#[Object(rename_args = "snake_case")]
impl OptbizGenQuery {
  
  /// 根据搜索条件和分页查找业务选项列表
  async fn find_all_optbiz(
    &self,
    ctx: &Context<'_>,
    search: Option<OptbizSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OptbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_all_optbiz(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找业务选项总数
  async fn find_count_optbiz(
    &self,
    ctx: &Context<'_>,
    search: Option<OptbizSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_count_optbiz(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个业务选项
  async fn find_one_optbiz(
    &self,
    ctx: &Context<'_>,
    search: Option<OptbizSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OptbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_one_optbiz(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个业务选项, 如果不存在则抛错
  async fn find_one_ok_optbiz(
    &self,
    ctx: &Context<'_>,
    search: Option<OptbizSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<OptbizModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_one_ok_optbiz(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务选项
  async fn find_by_id_optbiz(
    &self,
    ctx: &Context<'_>,
    id: OptbizId,
  ) -> Result<Option<OptbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_by_id_optbiz(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务选项, 如果不存在则抛错
  async fn find_by_id_ok_optbiz(
    &self,
    ctx: &Context<'_>,
    id: OptbizId,
  ) -> Result<OptbizModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_by_id_ok_optbiz(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务选项
  async fn find_by_ids_optbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptbizId>,
  ) -> Result<Vec<OptbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_by_ids_optbiz(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务选项
  async fn find_by_ids_ok_optbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptbizId>,
  ) -> Result<Vec<OptbizModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_by_ids_ok_optbiz(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务选项是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_optbiz(
    &self,
    ctx: &Context<'_>,
    id: OptbizId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::get_is_enabled_by_id_optbiz(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务选项是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_optbiz(
    &self,
    ctx: &Context<'_>,
    id: OptbizId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::get_is_locked_by_id_optbiz(
          id,
          None,
        )
      }).await
  }
  
  /// 获取业务选项字段注释
  async fn get_field_comments_optbiz(
    &self,
    ctx: &Context<'_>,
  ) -> Result<OptbizFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        optbiz_resolver::get_field_comments_optbiz(
          None,
        )
      }).await
  }
  
  /// 查找 业务选项 order_by 字段的最大值
  async fn find_last_order_by_optbiz(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::find_last_order_by_optbiz(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct OptbizGenMutation;

#[Object(rename_args = "snake_case")]
impl OptbizGenMutation {
  
  /// 创建业务选项
  async fn creates_optbiz(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<OptbizInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<OptbizId>> {
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
        optbiz_resolver::creates_optbiz(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 业务选项根据id修改租户id
  async fn update_tenant_by_id_optbiz(
    &self,
    ctx: &Context<'_>,
    id: OptbizId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        optbiz_resolver::update_tenant_by_id_optbiz(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改业务选项
  async fn update_by_id_optbiz(
    &self,
    ctx: &Context<'_>,
    id: OptbizId,
    input: OptbizInput,
  ) -> Result<OptbizId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        optbiz_resolver::update_by_id_optbiz(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除业务选项
  async fn delete_by_ids_optbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptbizId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        optbiz_resolver::delete_by_ids_optbiz(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用业务选项
  async fn enable_by_ids_optbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptbizId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        optbiz_resolver::enable_by_ids_optbiz(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_optbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptbizId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        optbiz_resolver::lock_by_ids_optbiz(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原业务选项
  async fn revert_by_ids_optbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptbizId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        optbiz_resolver::revert_by_ids_optbiz(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除业务选项
  async fn force_delete_by_ids_optbiz(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptbizId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        optbiz_resolver::force_delete_by_ids_optbiz(
          ids,
          None,
        )
      }).await
  }
  
}
