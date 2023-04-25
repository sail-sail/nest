use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::operation_record_model::*;
use super::operation_record_service;


#[derive(Default)]
pub struct OperationRecordQuery;

#[Object]
impl OperationRecordQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_operation_record<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<OperationRecordSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OperationRecordModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = operation_record_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查找总数
  async fn find_count_operation_record<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<OperationRecordSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = operation_record_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_operation_record<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<OperationRecordSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OperationRecordModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = operation_record_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_operation_record<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<OperationRecordModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = operation_record_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}

#[derive(Default)]
pub struct OperationRecordMutation;

#[Object]
impl OperationRecordMutation {
  
  /// 创建数据
  pub async fn create_operation_record<'a>(
    &self,
    ctx: &Context<'a>,
    input: OperationRecordInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = operation_record_service::create(
      &mut ctx,
      input,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
}
