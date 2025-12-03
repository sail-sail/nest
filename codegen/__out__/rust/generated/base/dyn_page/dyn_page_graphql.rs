
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

use super::dyn_page_model::*;
use super::dyn_page_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DynPageGenQuery;

#[Object(rename_args = "snake_case")]
impl DynPageGenQuery {
  
  /// 根据搜索条件和分页查找动态页面列表
  #[graphql(name = "findAllDynPage")]
  async fn find_all_dyn_page(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DynPageModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_all_dyn_page(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找动态页面总数
  #[graphql(name = "findCountDynPage")]
  async fn find_count_dyn_page(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_count_dyn_page(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面
  #[graphql(name = "findOneDynPage")]
  async fn find_one_dyn_page(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DynPageModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_one_dyn_page(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面, 如果不存在则抛错
  #[graphql(name = "findOneOkDynPage")]
  async fn find_one_ok_dyn_page(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DynPageModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_one_ok_dyn_page(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面
  #[graphql(name = "findByIdDynPage")]
  async fn find_by_id_dyn_page(
    &self,
    ctx: &Context<'_>,
    id: DynPageId,
  ) -> Result<Option<DynPageModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_by_id_dyn_page(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面, 如果不存在则抛错
  #[graphql(name = "findByIdOkDynPage")]
  async fn find_by_id_ok_dyn_page(
    &self,
    ctx: &Context<'_>,
    id: DynPageId,
  ) -> Result<DynPageModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_by_id_ok_dyn_page(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面
  #[graphql(name = "findByIdsDynPage")]
  async fn find_by_ids_dyn_page(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageId>,
  ) -> Result<Vec<DynPageModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_by_ids_dyn_page(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面
  #[graphql(name = "findByIdsOkDynPage")]
  async fn find_by_ids_ok_dyn_page(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageId>,
  ) -> Result<Vec<DynPageModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_by_ids_ok_dyn_page(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdDynPage")]
  async fn get_is_enabled_by_id_dyn_page(
    &self,
    ctx: &Context<'_>,
    id: DynPageId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::get_is_enabled_by_id_dyn_page(
          id,
          None,
        )
      }).await
  }
  
  /// 获取动态页面字段注释
  #[graphql(name = "getFieldCommentsDynPage")]
  async fn get_field_comments_dyn_page(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DynPageFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dyn_page_resolver::get_field_comments_dyn_page(
          None,
        )
      }).await
  }
  
  /// 查找 动态页面 order_by 字段的最大值
  #[graphql(name = "findLastOrderByDynPage")]
  async fn find_last_order_by_dyn_page(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageSearch>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_resolver::find_last_order_by_dyn_page(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DynPageGenMutation;

#[Object(rename_args = "snake_case")]
impl DynPageGenMutation {
  
  /// 创建动态页面
  #[graphql(name = "createsDynPage")]
  async fn creates_dyn_page(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DynPageInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DynPageId>> {
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
        dyn_page_resolver::creates_dyn_page(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 动态页面根据id修改租户id
  #[graphql(name = "updateTenantByIdDynPage")]
  async fn update_tenant_by_id_dyn_page(
    &self,
    ctx: &Context<'_>,
    id: DynPageId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_resolver::update_tenant_by_id_dyn_page(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改动态页面
  #[graphql(name = "updateByIdDynPage")]
  async fn update_by_id_dyn_page(
    &self,
    ctx: &Context<'_>,
    id: DynPageId,
    input: DynPageInput,
  ) -> Result<DynPageId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_resolver::update_by_id_dyn_page(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除动态页面
  #[graphql(name = "deleteByIdsDynPage")]
  async fn delete_by_ids_dyn_page(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_resolver::delete_by_ids_dyn_page(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用动态页面
  #[graphql(name = "enableByIdsDynPage")]
  async fn enable_by_ids_dyn_page(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_resolver::enable_by_ids_dyn_page(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原动态页面
  #[graphql(name = "revertByIdsDynPage")]
  async fn revert_by_ids_dyn_page(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_resolver::revert_by_ids_dyn_page(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除动态页面
  #[graphql(name = "forceDeleteByIdsDynPage")]
  async fn force_delete_by_ids_dyn_page(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_resolver::force_delete_by_ids_dyn_page(
          ids,
          None,
        )
      }).await
  }
  
}
