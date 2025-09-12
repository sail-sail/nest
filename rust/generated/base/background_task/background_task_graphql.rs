
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

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::background_task_model::*;
use super::background_task_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct BackgroundTaskGenQuery;

#[Object(rename_args = "snake_case")]
impl BackgroundTaskGenQuery {
  
  /// 根据搜索条件和分页查找后台任务列表
  #[graphql(name = "findAllBackgroundTask")]
  async fn find_all_background_task(
    &self,
    ctx: &Context<'_>,
    search: Option<BackgroundTaskSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<BackgroundTaskModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_all_background_task(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找后台任务总数
  #[graphql(name = "findCountBackgroundTask")]
  async fn find_count_background_task(
    &self,
    ctx: &Context<'_>,
    search: Option<BackgroundTaskSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_count_background_task(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个后台任务
  #[graphql(name = "findOneBackgroundTask")]
  async fn find_one_background_task(
    &self,
    ctx: &Context<'_>,
    search: Option<BackgroundTaskSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<BackgroundTaskModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_one_background_task(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个后台任务, 如果不存在则抛错
  #[graphql(name = "findOneOkBackgroundTask")]
  async fn find_one_ok_background_task(
    &self,
    ctx: &Context<'_>,
    search: Option<BackgroundTaskSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<BackgroundTaskModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_one_ok_background_task(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找后台任务
  #[graphql(name = "findByIdBackgroundTask")]
  async fn find_by_id_background_task(
    &self,
    ctx: &Context<'_>,
    id: BackgroundTaskId,
  ) -> Result<Option<BackgroundTaskModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_by_id_background_task(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找后台任务, 如果不存在则抛错
  #[graphql(name = "findByIdOkBackgroundTask")]
  async fn find_by_id_ok_background_task(
    &self,
    ctx: &Context<'_>,
    id: BackgroundTaskId,
  ) -> Result<BackgroundTaskModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_by_id_ok_background_task(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找后台任务
  #[graphql(name = "findByIdsBackgroundTask")]
  async fn find_by_ids_background_task(
    &self,
    ctx: &Context<'_>,
    ids: Vec<BackgroundTaskId>,
  ) -> Result<Vec<BackgroundTaskModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_by_ids_background_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找后台任务
  #[graphql(name = "findByIdsOkBackgroundTask")]
  async fn find_by_ids_ok_background_task(
    &self,
    ctx: &Context<'_>,
    ids: Vec<BackgroundTaskId>,
  ) -> Result<Vec<BackgroundTaskModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        background_task_resolver::find_by_ids_ok_background_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取后台任务字段注释
  #[graphql(name = "getFieldCommentsBackgroundTask")]
  async fn get_field_comments_background_task(
    &self,
    ctx: &Context<'_>,
  ) -> Result<BackgroundTaskFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        background_task_resolver::get_field_comments_background_task(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct BackgroundTaskGenMutation;

#[Object(rename_args = "snake_case")]
impl BackgroundTaskGenMutation {
  
  /// 占位方法, 用于实现 BackgroundTaskInput
  #[allow(unused_variables)]
  #[graphql(name = "noAddNoEditBackgroundTask")]
  async fn no_add_no_edit_background_task(
    &self,
    ctx: &Context<'_>,
    input: BackgroundTaskInput,
  ) -> Result<BackgroundTaskId> {
    Err(eyre!(""))
  }
  
  /// 后台任务根据id修改租户id
  #[graphql(name = "updateTenantByIdBackgroundTask")]
  async fn update_tenant_by_id_background_task(
    &self,
    ctx: &Context<'_>,
    id: BackgroundTaskId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        background_task_resolver::update_tenant_by_id_background_task(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除后台任务
  #[graphql(name = "deleteByIdsBackgroundTask")]
  async fn delete_by_ids_background_task(
    &self,
    ctx: &Context<'_>,
    ids: Vec<BackgroundTaskId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        background_task_resolver::delete_by_ids_background_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原后台任务
  #[graphql(name = "revertByIdsBackgroundTask")]
  async fn revert_by_ids_background_task(
    &self,
    ctx: &Context<'_>,
    ids: Vec<BackgroundTaskId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        background_task_resolver::revert_by_ids_background_task(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除后台任务
  #[graphql(name = "forceDeleteByIdsBackgroundTask")]
  async fn force_delete_by_ids_background_task(
    &self,
    ctx: &Context<'_>,
    ids: Vec<BackgroundTaskId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        background_task_resolver::force_delete_by_ids_background_task(
          ids,
          None,
        )
      }).await
  }
  
}
