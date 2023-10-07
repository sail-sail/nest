use anyhow::Result;
use async_graphql::{Context, Object};

#[allow(unused_imports)]
use crate::common::context::{
  CtxImpl,
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
  async fn find_all_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<I18nSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<I18nModel>> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = i18n_resolver::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<I18nSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = i18n_resolver::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<I18nSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<I18nModel>> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = i18n_resolver::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<I18nModel>> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = i18n_resolver::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_i18n<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<I18nFieldComment> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = i18n_resolver::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct I18nGenMutation;

#[Object(rename_args = "snake_case")]
impl I18nGenMutation {
  
  /// 创建数据
  async fn create_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    model: I18nInput,
    unique_type: Option<UniqueType>,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    let id = i18n_resolver::create(
      &mut ctx,
      model,
      options.into(),
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: I18nInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = i18n_resolver::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = i18n_resolver::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = i18n_resolver::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = i18n_resolver::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
