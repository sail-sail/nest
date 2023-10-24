use anyhow::Result;
use async_graphql::{Context, Object};

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  Options,
  UniqueType,
};

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::operation_record_model::*;
use super::operation_record_resolver;


#[derive(Default)]
pub struct OperationRecordGenQuery;

#[Object(rename_args = "snake_case")]
impl OperationRecordGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_operation_record(
    &self,
    ctx: &Context<'_>,
    search: Option<OperationRecordSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OperationRecordModel>> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = operation_record_resolver::find_all(
      &ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_operation_record(
    &self,
    ctx: &Context<'_>,
    search: Option<OperationRecordSearch>,
  ) -> Result<i64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = operation_record_resolver::find_count(
      &ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_operation_record(
    &self,
    ctx: &Context<'_>,
    search: Option<OperationRecordSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OperationRecordModel>> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = operation_record_resolver::find_one(
      &ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_operation_record(
    &self,
    ctx: &Context<'_>,
    id: String,
  ) -> Result<Option<OperationRecordModel>> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = operation_record_resolver::find_by_id(
      &ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_operation_record(
    &self,
    ctx: &Context<'_>,
  ) -> Result<OperationRecordFieldComment> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = operation_record_resolver::get_field_comments(
      &ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct OperationRecordGenMutation;

#[Object(rename_args = "snake_case")]
impl OperationRecordGenMutation {
  
  /// 根据id修改租户id
  async fn update_tenant_by_id_operation_record(
    &self,
    ctx: &Context<'_>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build();
    
    let res = operation_record_resolver::update_tenant_by_id(
      &ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build();
    
    let res = operation_record_resolver::delete_by_ids(
      &ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build();
    
    let res = operation_record_resolver::revert_by_ids(
      &ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build();
    
    let res = operation_record_resolver::force_delete_by_ids(
      &ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
