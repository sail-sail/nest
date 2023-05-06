use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::options_model::*;
use super::options_service;


#[derive(Default)]
pub struct OptionsGenQuery;

#[Object]
impl OptionsGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_options<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<OptionsSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OptionsModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = options_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查找总数
  async fn find_count_options<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<OptionsSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = options_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_options<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<OptionsSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OptionsModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = options_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_options<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<OptionsModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = options_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}

#[derive(Default)]
pub struct OptionsGenMutation;

#[Object]
impl OptionsGenMutation {
  
  /// 创建数据
  pub async fn create_options<'a>(
    &self,
    ctx: &Context<'a>,
    model: OptionsInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = options_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_options<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: OptionsInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = options_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_options<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = options_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_options<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = options_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_options<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = options_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
