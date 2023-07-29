use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::background_task_model::*;
use super::background_task_resolver;


#[derive(Default)]
pub struct BackgroundTaskGenQuery;

#[Object(rename_args = "snake_case")]
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
    
    let res = background_task_resolver::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<BackgroundTaskSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = background_task_resolver::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<BackgroundTaskSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<BackgroundTaskModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = background_task_resolver::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<BackgroundTaskModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = background_task_resolver::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_background_task<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<BackgroundTaskFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = background_task_resolver::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct BackgroundTaskGenMutation;

#[Object(rename_args = "snake_case")]
impl BackgroundTaskGenMutation {
  
  /// 根据id修改租户id
  async fn update_tenant_by_id_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_resolver::update_tenant_by_id(
      &mut ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_resolver::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_resolver::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_background_task<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = background_task_resolver::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
