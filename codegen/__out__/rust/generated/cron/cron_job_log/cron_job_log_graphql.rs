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

use super::cron_job_log_model::*;
use super::cron_job_log_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct CronJobLogGenQuery;

#[Object(rename_args = "snake_case")]
impl CronJobLogGenQuery {
  
  /// 根据搜索条件和分页查找定时任务日志列表
  async fn find_all_cron_job_log(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<CronJobLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_all_cron_job_log(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找定时任务日志总数
  async fn find_count_cron_job_log(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_count_cron_job_log(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个定时任务日志
  async fn find_one_cron_job_log(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<CronJobLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_one_cron_job_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个定时任务日志, 如果不存在则抛错
  async fn find_one_ok_cron_job_log(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<CronJobLogModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_one_ok_cron_job_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志
  async fn find_by_id_cron_job_log(
    &self,
    ctx: &Context<'_>,
    id: CronJobLogId,
  ) -> Result<Option<CronJobLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_by_id_cron_job_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志, 如果不存在则抛错
  async fn find_by_id_ok_cron_job_log(
    &self,
    ctx: &Context<'_>,
    id: CronJobLogId,
  ) -> Result<CronJobLogModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_by_id_ok_cron_job_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志
  async fn find_by_ids_cron_job_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogId>,
  ) -> Result<Vec<CronJobLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_by_ids_cron_job_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志
  async fn find_by_ids_ok_cron_job_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogId>,
  ) -> Result<Vec<CronJobLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_resolver::find_by_ids_ok_cron_job_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取定时任务日志字段注释
  async fn get_field_comments_cron_job_log(
    &self,
    ctx: &Context<'_>,
  ) -> Result<CronJobLogFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        cron_job_log_resolver::get_field_comments_cron_job_log(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct CronJobLogGenMutation;

#[Object(rename_args = "snake_case")]
impl CronJobLogGenMutation {
  
  /// 占位方法, 用于实现 CronJobLogInput
  #[allow(unused_variables)]
  async fn no_add_no_edit_cron_job_log(
    &self,
    ctx: &Context<'_>,
    input: CronJobLogInput,
  ) -> Result<CronJobLogId> {
    Err(eyre!(""))
  }
  
  /// 定时任务日志根据id修改租户id
  async fn update_tenant_by_id_cron_job_log(
    &self,
    ctx: &Context<'_>,
    id: CronJobLogId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_resolver::update_tenant_by_id_cron_job_log(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除定时任务日志
  async fn delete_by_ids_cron_job_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_resolver::delete_by_ids_cron_job_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原定时任务日志
  async fn revert_by_ids_cron_job_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_resolver::revert_by_ids_cron_job_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除定时任务日志
  async fn force_delete_by_ids_cron_job_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_resolver::force_delete_by_ids_cron_job_log(
          ids,
          None,
        )
      }).await
  }
  
}
