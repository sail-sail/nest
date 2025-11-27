
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

use super::dyn_page_field_model::*;
use super::dyn_page_field_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DynPageFieldGenQuery;

#[Object(rename_args = "snake_case")]
impl DynPageFieldGenQuery {
  
  /// 根据搜索条件和分页查找动态页面字段列表
  #[graphql(name = "findAllDynPageField")]
  async fn find_all_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageFieldSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DynPageFieldModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_all_dyn_page_field(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找动态页面字段总数
  #[graphql(name = "findCountDynPageField")]
  async fn find_count_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageFieldSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_count_dyn_page_field(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面字段
  #[graphql(name = "findOneDynPageField")]
  async fn find_one_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageFieldSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DynPageFieldModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_one_dyn_page_field(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面字段, 如果不存在则抛错
  #[graphql(name = "findOneOkDynPageField")]
  async fn find_one_ok_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageFieldSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DynPageFieldModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_one_ok_dyn_page_field(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面字段
  #[graphql(name = "findByIdDynPageField")]
  async fn find_by_id_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    id: DynPageFieldId,
  ) -> Result<Option<DynPageFieldModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_by_id_dyn_page_field(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面字段, 如果不存在则抛错
  #[graphql(name = "findByIdOkDynPageField")]
  async fn find_by_id_ok_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    id: DynPageFieldId,
  ) -> Result<DynPageFieldModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_by_id_ok_dyn_page_field(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面字段
  #[graphql(name = "findByIdsDynPageField")]
  async fn find_by_ids_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageFieldId>,
  ) -> Result<Vec<DynPageFieldModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_by_ids_dyn_page_field(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面字段
  #[graphql(name = "findByIdsOkDynPageField")]
  async fn find_by_ids_ok_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageFieldId>,
  ) -> Result<Vec<DynPageFieldModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_by_ids_ok_dyn_page_field(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面字段是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdDynPageField")]
  async fn get_is_enabled_by_id_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    id: DynPageFieldId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::get_is_enabled_by_id_dyn_page_field(
          id,
          None,
        )
      }).await
  }
  
  /// 获取动态页面字段字段注释
  #[graphql(name = "getFieldCommentsDynPageField")]
  async fn get_field_comments_dyn_page_field(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DynPageFieldFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dyn_page_field_resolver::get_field_comments_dyn_page_field(
          None,
        )
      }).await
  }
  
  /// 查找 动态页面字段 order_by 字段的最大值
  #[graphql(name = "findLastOrderByDynPageField")]
  async fn find_last_order_by_dyn_page_field(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_field_resolver::find_last_order_by_dyn_page_field(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DynPageFieldGenMutation;

#[Object(rename_args = "snake_case")]
impl DynPageFieldGenMutation {
  
  /// 创建动态页面字段
  #[graphql(name = "createsDynPageField")]
  async fn creates_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DynPageFieldInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DynPageFieldId>> {
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
        dyn_page_field_resolver::creates_dyn_page_field(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 动态页面字段根据id修改租户id
  #[graphql(name = "updateTenantByIdDynPageField")]
  async fn update_tenant_by_id_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    id: DynPageFieldId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_field_resolver::update_tenant_by_id_dyn_page_field(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改动态页面字段
  #[graphql(name = "updateByIdDynPageField")]
  async fn update_by_id_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    id: DynPageFieldId,
    input: DynPageFieldInput,
  ) -> Result<DynPageFieldId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_field_resolver::update_by_id_dyn_page_field(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除动态页面字段
  #[graphql(name = "deleteByIdsDynPageField")]
  async fn delete_by_ids_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageFieldId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_field_resolver::delete_by_ids_dyn_page_field(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用动态页面字段
  #[graphql(name = "enableByIdsDynPageField")]
  async fn enable_by_ids_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageFieldId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_field_resolver::enable_by_ids_dyn_page_field(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原动态页面字段
  #[graphql(name = "revertByIdsDynPageField")]
  async fn revert_by_ids_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageFieldId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_field_resolver::revert_by_ids_dyn_page_field(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除动态页面字段
  #[graphql(name = "forceDeleteByIdsDynPageField")]
  async fn force_delete_by_ids_dyn_page_field(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageFieldId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_field_resolver::force_delete_by_ids_dyn_page_field(
          ids,
          None,
        )
      }).await
  }
  
}
