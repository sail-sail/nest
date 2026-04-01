
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};
use async_graphql::{Context, Object};

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  Options,
  UniqueType,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::task_model::*;
use super::task_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct TaskGenQuery;

#[Object(rename_args = "snake_case")]
impl TaskGenQuery {
  
  /// 根据搜索条件和分页查找审批任务列表
  #[graphql(name = "findAllTask")]
  async fn find_all_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TaskSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<TaskModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_all_task(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找审批任务总数
  #[graphql(name = "findCountTask")]
  async fn find_count_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TaskSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_count_task(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个审批任务
  #[graphql(name = "findOneTask")]
  async fn find_one_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TaskSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<TaskModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_one_task(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个审批任务, 如果不存在则抛错
  #[graphql(name = "findOneOkTask")]
  async fn find_one_ok_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<TaskSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<TaskModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_one_ok_task(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批任务
  #[graphql(name = "findByIdTask")]
  async fn find_by_id_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TaskId,
  ) -> Result<Option<TaskModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_by_id_task(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批任务, 如果不存在则抛错
  #[graphql(name = "findByIdOkTask")]
  async fn find_by_id_ok_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TaskId,
  ) -> Result<TaskModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_by_id_ok_task(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批任务
  #[graphql(name = "findByIdsTask")]
  async fn find_by_ids_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TaskId>,
  ) -> Result<Vec<TaskModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_by_ids_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批任务
  #[graphql(name = "findByIdsOkTask")]
  async fn find_by_ids_ok_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TaskId>,
  ) -> Result<Vec<TaskModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        task_resolver::find_by_ids_ok_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取审批任务字段注释
  #[graphql(name = "getFieldCommentsTask")]
  async fn get_field_comments_task(
    &self,
    ctx: &Context<'_>,
  ) -> Result<TaskFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        task_resolver::get_field_comments_task(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct TaskGenMutation;

#[Object(rename_args = "snake_case")]
impl TaskGenMutation {
  
  /// 创建审批任务
  #[graphql(name = "createsTask")]
  async fn creates_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<TaskInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<TaskId>> {
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .with_creating(Some(true))
      .build()
      .scope({
        task_resolver::creates_task(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 审批任务根据id修改租户id
  #[graphql(name = "updateTenantByIdTask")]
  async fn update_tenant_by_id_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TaskId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        task_resolver::update_tenant_by_id_task(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改审批任务
  #[graphql(name = "updateByIdTask")]
  async fn update_by_id_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: TaskId,
    #[graphql(name = "input")]
    input: TaskInput,
  ) -> Result<TaskId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        task_resolver::update_by_id_task(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除审批任务
  #[graphql(name = "deleteByIdsTask")]
  async fn delete_by_ids_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TaskId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        task_resolver::delete_by_ids_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原审批任务
  #[graphql(name = "revertByIdsTask")]
  async fn revert_by_ids_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TaskId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        task_resolver::revert_by_ids_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除审批任务
  #[graphql(name = "forceDeleteByIdsTask")]
  async fn force_delete_by_ids_task(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<TaskId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        task_resolver::force_delete_by_ids_task(
          ids,
          None,
        )
      }).await
  }
  
}
