
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

use super::dyn_page_data_model::*;
use super::dyn_page_data_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DynPageDataGenQuery;

#[Object(rename_args = "snake_case")]
impl DynPageDataGenQuery {
  
  /// 根据搜索条件和分页查找动态页面数据列表
  #[graphql(name = "findAllDynPageData")]
  async fn find_all_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageDataSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DynPageDataModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_all_dyn_page_data(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找动态页面数据总数
  #[graphql(name = "findCountDynPageData")]
  async fn find_count_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageDataSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_count_dyn_page_data(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面数据
  #[graphql(name = "findOneDynPageData")]
  async fn find_one_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageDataSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DynPageDataModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_one_dyn_page_data(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个动态页面数据, 如果不存在则抛错
  #[graphql(name = "findOneOkDynPageData")]
  async fn find_one_ok_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    search: Option<DynPageDataSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DynPageDataModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_one_ok_dyn_page_data(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面数据
  #[graphql(name = "findByIdDynPageData")]
  async fn find_by_id_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    id: DynPageDataId,
  ) -> Result<Option<DynPageDataModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_by_id_dyn_page_data(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面数据, 如果不存在则抛错
  #[graphql(name = "findByIdOkDynPageData")]
  async fn find_by_id_ok_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    id: DynPageDataId,
  ) -> Result<DynPageDataModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_by_id_ok_dyn_page_data(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面数据
  #[graphql(name = "findByIdsDynPageData")]
  async fn find_by_ids_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageDataId>,
  ) -> Result<Vec<DynPageDataModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_by_ids_dyn_page_data(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找动态页面数据
  #[graphql(name = "findByIdsOkDynPageData")]
  async fn find_by_ids_ok_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageDataId>,
  ) -> Result<Vec<DynPageDataModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dyn_page_data_resolver::find_by_ids_ok_dyn_page_data(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取动态页面数据字段注释
  #[graphql(name = "getFieldCommentsDynPageData")]
  async fn get_field_comments_dyn_page_data(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DynPageDataFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dyn_page_data_resolver::get_field_comments_dyn_page_data(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DynPageDataGenMutation;

#[Object(rename_args = "snake_case")]
impl DynPageDataGenMutation {
  
  /// 创建动态页面数据
  #[graphql(name = "createsDynPageData")]
  async fn creates_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DynPageDataInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DynPageDataId>> {
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
        dyn_page_data_resolver::creates_dyn_page_data(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 动态页面数据根据id修改租户id
  #[graphql(name = "updateTenantByIdDynPageData")]
  async fn update_tenant_by_id_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    id: DynPageDataId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_data_resolver::update_tenant_by_id_dyn_page_data(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改动态页面数据
  #[graphql(name = "updateByIdDynPageData")]
  async fn update_by_id_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    id: DynPageDataId,
    input: DynPageDataInput,
  ) -> Result<DynPageDataId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_data_resolver::update_by_id_dyn_page_data(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除动态页面数据
  #[graphql(name = "deleteByIdsDynPageData")]
  async fn delete_by_ids_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageDataId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_data_resolver::delete_by_ids_dyn_page_data(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原动态页面数据
  #[graphql(name = "revertByIdsDynPageData")]
  async fn revert_by_ids_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageDataId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_data_resolver::revert_by_ids_dyn_page_data(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除动态页面数据
  #[graphql(name = "forceDeleteByIdsDynPageData")]
  async fn force_delete_by_ids_dyn_page_data(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DynPageDataId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dyn_page_data_resolver::force_delete_by_ids_dyn_page_data(
          ids,
          None,
        )
      }).await
  }
  
}
