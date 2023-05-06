use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::background_task_model::*;
use super::background_task_service;


#[derive(Default)]
pub struct BackgroundTaskGenQuery;

#[Object]
impl BackgroundTaskGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<BackgroundTaskSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<BackgroundTaskModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = background_task_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查找总数
  async fn find_count_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<BackgroundTaskSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = background_task_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<BackgroundTaskSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<BackgroundTaskModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = background_task_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<BackgroundTaskModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = background_task_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}

#[derive(Default)]
pub struct BackgroundTaskGenMutation;

#[Object]
impl BackgroundTaskGenMutation {
  
  /// 创建数据
  pub async fn create_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    input: BackgroundTaskInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = background_task_service::create(
      &mut ctx,
      input,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改租户id
  pub async fn update_tenant_by_id_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_service::update_tenant_by_id(
      &mut ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    input: BackgroundTaskInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_service::update_by_id(
      &mut ctx,
      id,
      input,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
