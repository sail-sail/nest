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

use super::i18n_model::*;
use super::i18n_resolver;

#[derive(Default)]
pub struct I18nGenQuery;

#[Object(rename_args = "snake_case")]
impl I18nGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_i18n(
    &self,
    ctx: &Context<'_>,
    search: Option<I18nSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<I18nModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        i18n_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_i18n(
    &self,
    ctx: &Context<'_>,
    search: Option<I18nSearch>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        i18n_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_i18n(
    &self,
    ctx: &Context<'_>,
    search: Option<I18nSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<I18nModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        i18n_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_i18n(
    &self,
    ctx: &Context<'_>,
    id: ID,
  ) -> Result<Option<I18nModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        i18n_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_i18n(
    &self,
    ctx: &Context<'_>,
  ) -> Result<I18nFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        i18n_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct I18nGenMutation;

#[Object(rename_args = "snake_case")]
impl I18nGenMutation {
  
  /// 创建数据
  async fn create_i18n(
    &self,
    ctx: &Context<'_>,
    model: I18nInput,
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
        i18n_resolver::create(
          model,
          options.into(),
        )
      }).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_i18n(
    &self,
    ctx: &Context<'_>,
    id: ID,
    model: I18nInput,
  ) -> Result<ID> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        i18n_resolver::update_by_id(
          id,
          model,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_i18n(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        i18n_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_i18n(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        i18n_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_i18n(
    &self,
    ctx: &Context<'_>,
    ids: Vec<ID>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        i18n_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
