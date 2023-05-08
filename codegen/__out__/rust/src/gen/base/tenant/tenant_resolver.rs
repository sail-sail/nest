use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::tenant_model::*;
use super::tenant_service;


#[derive(Default)]
pub struct TenantGenQuery;

#[Object(rename_args = "snake_case")]
impl TenantGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<TenantSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<TenantModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = tenant_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<TenantSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = tenant_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<TenantSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<TenantModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = tenant_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<TenantModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = tenant_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  pub async fn get_field_comments_tenant<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<TenantFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = tenant_service::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct TenantGenMutation;

#[Object(rename_args = "snake_case")]
impl TenantGenMutation {
  
  /// 创建数据
  pub async fn create_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    model: TenantInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = tenant_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: TenantInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = tenant_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = tenant_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = tenant_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_tenant<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = tenant_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
