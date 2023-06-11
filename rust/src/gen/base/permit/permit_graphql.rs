use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::permit_model::*;
use super::permit_resolver;


#[derive(Default)]
pub struct PermitGenQuery;

#[Object(rename_args = "snake_case")]
impl PermitGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_permit<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<PermitSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<PermitModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = permit_resolver::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_permit<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<PermitSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = permit_resolver::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_permit<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<PermitSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<PermitModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = permit_resolver::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_permit<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<PermitModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = permit_resolver::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  pub async fn get_field_comments_permit<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<PermitFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = permit_resolver::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct PermitGenMutation;

#[Object(rename_args = "snake_case")]
impl PermitGenMutation {
  
  /// 创建数据
  pub async fn create_permit<'a>(
    &self,
    ctx: &Context<'a>,
    model: PermitInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = permit_resolver::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改租户id
  pub async fn update_tenant_by_id_permit<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = permit_resolver::update_tenant_by_id(
      &mut ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_permit<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: PermitInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = permit_resolver::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_permit<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = permit_resolver::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_permit<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = permit_resolver::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_permit<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = permit_resolver::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
