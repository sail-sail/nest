use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::dictbiz_model::*;
use super::dictbiz_service;


#[derive(Default)]
pub struct DictbizGenQuery;

#[Object(rename_args = "snake_case")]
impl DictbizGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictbizSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictbizModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查找总数
  async fn find_count_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictbizSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictbizSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictbizModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = dictbiz_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<DictbizModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = dictbiz_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}

#[derive(Default)]
pub struct DictbizGenMutation;

#[Object(rename_args = "snake_case")]
impl DictbizGenMutation {
  
  /// 创建数据
  pub async fn create_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    model: DictbizInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = dictbiz_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改租户id
  pub async fn update_tenant_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_service::update_tenant_by_id(
      &mut ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: DictbizInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
