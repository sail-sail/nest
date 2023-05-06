use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::i18n_model::*;
use super::i18n_service;


#[derive(Default)]
pub struct I18nGenQuery;

#[Object]
impl I18nGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<I18nSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<I18nModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = i18n_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查找总数
  async fn find_count_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<I18nSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = i18n_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<I18nSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<I18nModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = i18n_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<I18nModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = i18n_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}

#[derive(Default)]
pub struct I18nGenMutation;

#[Object]
impl I18nGenMutation {
  
  /// 创建数据
  pub async fn create_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    input: I18nInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = i18n_service::create(
      &mut ctx,
      input,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    input: I18nInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = i18n_service::update_by_id(
      &mut ctx,
      id,
      input,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = i18n_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = i18n_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_i18n<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = i18n_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
