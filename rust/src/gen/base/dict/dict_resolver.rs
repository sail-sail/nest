use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::dict_model::*;
use super::dict_service;


#[derive(Default)]
pub struct DictGenQuery;

#[Object(rename_args = "snake_case")]
impl DictGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_dict<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查找总数
  async fn find_count_dict<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_dict<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = dict_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_dict<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<DictModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = dict_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}

#[derive(Default)]
pub struct DictGenMutation;

#[Object(rename_args = "snake_case")]
impl DictGenMutation {
  
  /// 创建数据
  pub async fn create_dict<'a>(
    &self,
    ctx: &Context<'a>,
    model: DictInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = dict_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_dict<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: DictInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_dict<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_dict<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_dict<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
