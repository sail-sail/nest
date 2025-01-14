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

use super::i18n_model::*;
use super::i18n_resolver;

#[derive(Default)]
pub struct I18nGenQuery;

#[Object(rename_args = "snake_case")]
impl I18nGenQuery {
  
  /// 根据搜索条件和分页查找国际化列表
  #[graphql(name = "findAllI18n")]
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
  
  /// 根据条件查找国际化总数
  #[graphql(name = "findCountI18n")]
  async fn find_count_i18n(
    &self,
    ctx: &Context<'_>,
    search: Option<I18nSearch>,
  ) -> Result<u64> {
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
  
  /// 根据条件查找第一个国际化
  #[graphql(name = "findOneI18n")]
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
  
  /// 根据 id 查找国际化
  #[graphql(name = "findByIdI18n")]
  async fn find_by_id_i18n(
    &self,
    ctx: &Context<'_>,
    id: I18nId,
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
  
  /// 获取国际化字段注释
  #[graphql(name = "getFieldCommentsI18n")]
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
  
  /// 创建国际化
  #[graphql(name = "createsI18n")]
  async fn creates_i18n(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<I18nInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<I18nId>> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .with_creating(Some(true))
      .build()
      .scope({
        i18n_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改国际化
  #[graphql(name = "updateByIdI18n")]
  async fn update_by_id_i18n(
    &self,
    ctx: &Context<'_>,
    id: I18nId,
    input: I18nInput,
  ) -> Result<I18nId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        i18n_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除国际化
  #[graphql(name = "deleteByIdsI18n")]
  async fn delete_by_ids_i18n(
    &self,
    ctx: &Context<'_>,
    ids: Vec<I18nId>,
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
  
  /// 根据 ids 还原国际化
  #[graphql(name = "revertByIdsI18n")]
  async fn revert_by_ids_i18n(
    &self,
    ctx: &Context<'_>,
    ids: Vec<I18nId>,
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
  
  /// 根据 ids 彻底删除国际化
  #[graphql(name = "forceDeleteByIdsI18n")]
  async fn force_delete_by_ids_i18n(
    &self,
    ctx: &Context<'_>,
    ids: Vec<I18nId>,
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
