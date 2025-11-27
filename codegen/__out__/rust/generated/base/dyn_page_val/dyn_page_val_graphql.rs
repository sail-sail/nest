
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

use super::dyn_page_val_model::*;
use super::dyn_page_val_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DynPageValGenQuery;

#[Object(rename_args = "snake_case")]
impl DynPageValGenQuery {
  
  /// 根据搜索条件和分页查找动态页面值列表
  #[graphql(name = "findAllDynPageVal")]
  async fn find_all_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageValSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DynPageValModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_all_dyn_page_val(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找动态页面值总数
  #[graphql(name = "findCountDynPageVal")]
  async fn find_count_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageValSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_count_dyn_page_val(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面值
  #[graphql(name = "findOneDynPageVal")]
  async fn find_one_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageValSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DynPageValModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_one_dyn_page_val(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面值, 如果不存在则抛错
  #[graphql(name = "findOneOkDynPageVal")]
  async fn find_one_ok_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageValSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DynPageValModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_one_ok_dyn_page_val(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面值
  #[graphql(name = "findByIdDynPageVal")]
  async fn find_by_id_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    id: DynPageValId,
  ) -> Result<Option<DynPageValModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_by_id_dyn_page_val(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面值, 如果不存在则抛错
  #[graphql(name = "findByIdOkDynPageVal")]
  async fn find_by_id_ok_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    id: DynPageValId,
  ) -> Result<DynPageValModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_by_id_ok_dyn_page_val(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面值
  #[graphql(name = "findByIdsDynPageVal")]
  async fn find_by_ids_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageValId>,
  ) -> Result<Vec<DynPageValModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_by_ids_dyn_page_val(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面值
  #[graphql(name = "findByIdsOkDynPageVal")]
  async fn find_by_ids_ok_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageValId>,
  ) -> Result<Vec<DynPageValModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_val_resolver::find_by_ids_ok_dyn_page_val(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取动态页面值字段注释
  #[graphql(name = "getFieldCommentsDynPageVal")]
  async fn get_field_comments_dyn_page_val(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DynPageValFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dyn_page_val_resolver::get_field_comments_dyn_page_val(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DynPageValGenMutation;

#[Object(rename_args = "snake_case")]
impl DynPageValGenMutation {
  
  /// 创建动态页面值
  #[graphql(name = "createsDynPageVal")]
  async fn creates_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DynPageValInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DynPageValId>> {
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
        dyn_page_val_resolver::creates_dyn_page_val(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 动态页面值根据id修改租户id
  #[graphql(name = "updateTenantByIdDynPageVal")]
  async fn update_tenant_by_id_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    id: DynPageValId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_val_resolver::update_tenant_by_id_dyn_page_val(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改动态页面值
  #[graphql(name = "updateByIdDynPageVal")]
  async fn update_by_id_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    id: DynPageValId,
    input: DynPageValInput,
  ) -> Result<DynPageValId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_val_resolver::update_by_id_dyn_page_val(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除动态页面值
  #[graphql(name = "deleteByIdsDynPageVal")]
  async fn delete_by_ids_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageValId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_val_resolver::delete_by_ids_dyn_page_val(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原动态页面值
  #[graphql(name = "revertByIdsDynPageVal")]
  async fn revert_by_ids_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageValId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_val_resolver::revert_by_ids_dyn_page_val(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除动态页面值
  #[graphql(name = "forceDeleteByIdsDynPageVal")]
  async fn force_delete_by_ids_dyn_page_val(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageValId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_val_resolver::force_delete_by_ids_dyn_page_val(
          ids,
          None,
        )
      }).await
  }
  
}
