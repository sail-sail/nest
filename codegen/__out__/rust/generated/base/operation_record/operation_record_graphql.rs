#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};
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

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct OperationRecordGenQuery;

#[Object(rename_args = "snake_case")]
impl OperationRecordGenQuery {
  
  /// 根据搜索条件和分页查找操作记录列表
  async fn find_all_operation_record(
    &self,
    ctx: &Context<'_>,
    search: Option<OperationRecordSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OperationRecordModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_all_operation_record(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找操作记录总数
  async fn find_count_operation_record(
    &self,
    ctx: &Context<'_>,
    search: Option<OperationRecordSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_count_operation_record(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个操作记录
  async fn find_one_operation_record(
    &self,
    ctx: &Context<'_>,
    search: Option<OperationRecordSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OperationRecordModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_one_operation_record(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个操作记录, 如果不存在则抛错
  async fn find_one_ok_operation_record(
    &self,
    ctx: &Context<'_>,
    search: Option<OperationRecordSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<OperationRecordModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_one_ok_operation_record(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找操作记录
  async fn find_by_id_operation_record(
    &self,
    ctx: &Context<'_>,
    id: OperationRecordId,
  ) -> Result<Option<OperationRecordModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_by_id_operation_record(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找操作记录, 如果不存在则抛错
  async fn find_by_id_ok_operation_record(
    &self,
    ctx: &Context<'_>,
    id: OperationRecordId,
  ) -> Result<OperationRecordModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_by_id_ok_operation_record(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找操作记录
  async fn find_by_ids_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OperationRecordId>,
  ) -> Result<Vec<OperationRecordModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_by_ids_operation_record(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找操作记录
  async fn find_by_ids_ok_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OperationRecordId>,
  ) -> Result<Vec<OperationRecordModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        operation_record_resolver::find_by_ids_ok_operation_record(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取操作记录字段注释
  async fn get_field_comments_operation_record(
    &self,
    ctx: &Context<'_>,
  ) -> Result<OperationRecordFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        operation_record_resolver::get_field_comments_operation_record(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct OperationRecordGenMutation;

#[Object(rename_args = "snake_case")]
impl OperationRecordGenMutation {
  
  /// 占位方法, 用于实现 OperationRecordInput
  #[allow(unused_variables)]
  async fn no_add_no_edit_operation_record(
    &self,
    ctx: &Context<'_>,
    input: OperationRecordInput,
  ) -> Result<OperationRecordId> {
    Err(eyre!(""))
  }
  
  /// 操作记录根据id修改租户id
  async fn update_tenant_by_id_operation_record(
    &self,
    ctx: &Context<'_>,
    id: OperationRecordId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        operation_record_resolver::update_tenant_by_id_operation_record(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除操作记录
  async fn delete_by_ids_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OperationRecordId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        operation_record_resolver::delete_by_ids_operation_record(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原操作记录
  async fn revert_by_ids_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OperationRecordId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        operation_record_resolver::revert_by_ids_operation_record(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除操作记录
  async fn force_delete_by_ids_operation_record(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OperationRecordId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        operation_record_resolver::force_delete_by_ids_operation_record(
          ids,
          None,
        )
      }).await
  }
  
}
