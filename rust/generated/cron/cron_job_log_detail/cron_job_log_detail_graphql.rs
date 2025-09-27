
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

use super::cron_job_log_detail_model::*;
use super::cron_job_log_detail_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct CronJobLogDetailGenQuery;

#[Object(rename_args = "snake_case")]
impl CronJobLogDetailGenQuery {
  
  /// 根据搜索条件和分页查找定时任务日志明细列表
  #[graphql(name = "findAllCronJobLogDetail")]
  async fn find_all_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogDetailSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<CronJobLogDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_all_cron_job_log_detail(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找定时任务日志明细总数
  #[graphql(name = "findCountCronJobLogDetail")]
  async fn find_count_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogDetailSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_count_cron_job_log_detail(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个定时任务日志明细
  #[graphql(name = "findOneCronJobLogDetail")]
  async fn find_one_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogDetailSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<CronJobLogDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_one_cron_job_log_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个定时任务日志明细, 如果不存在则抛错
  #[graphql(name = "findOneOkCronJobLogDetail")]
  async fn find_one_ok_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobLogDetailSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<CronJobLogDetailModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_one_ok_cron_job_log_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志明细
  #[graphql(name = "findByIdCronJobLogDetail")]
  async fn find_by_id_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    id: CronJobLogDetailId,
  ) -> Result<Option<CronJobLogDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_by_id_cron_job_log_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志明细, 如果不存在则抛错
  #[graphql(name = "findByIdOkCronJobLogDetail")]
  async fn find_by_id_ok_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    id: CronJobLogDetailId,
  ) -> Result<CronJobLogDetailModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_by_id_ok_cron_job_log_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志明细
  #[graphql(name = "findByIdsCronJobLogDetail")]
  async fn find_by_ids_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogDetailId>,
  ) -> Result<Vec<CronJobLogDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_by_ids_cron_job_log_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务日志明细
  #[graphql(name = "findByIdsOkCronJobLogDetail")]
  async fn find_by_ids_ok_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogDetailId>,
  ) -> Result<Vec<CronJobLogDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_log_detail_resolver::find_by_ids_ok_cron_job_log_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取定时任务日志明细字段注释
  #[graphql(name = "getFieldCommentsCronJobLogDetail")]
  async fn get_field_comments_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
  ) -> Result<CronJobLogDetailFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        cron_job_log_detail_resolver::get_field_comments_cron_job_log_detail(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct CronJobLogDetailGenMutation;

#[Object(rename_args = "snake_case")]
impl CronJobLogDetailGenMutation {
  
  /// 占位方法, 用于实现 CronJobLogDetailInput
  #[allow(unused_variables)]
  #[graphql(name = "noAddNoEditCronJobLogDetail")]
  async fn no_add_no_edit_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    input: CronJobLogDetailInput,
  ) -> Result<CronJobLogDetailId> {
    Err(eyre!(""))
  }
  
  /// 定时任务日志明细根据id修改租户id
  #[graphql(name = "updateTenantByIdCronJobLogDetail")]
  async fn update_tenant_by_id_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    id: CronJobLogDetailId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_detail_resolver::update_tenant_by_id_cron_job_log_detail(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除定时任务日志明细
  #[graphql(name = "deleteByIdsCronJobLogDetail")]
  async fn delete_by_ids_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_detail_resolver::delete_by_ids_cron_job_log_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原定时任务日志明细
  #[graphql(name = "revertByIdsCronJobLogDetail")]
  async fn revert_by_ids_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_detail_resolver::revert_by_ids_cron_job_log_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除定时任务日志明细
  #[graphql(name = "forceDeleteByIdsCronJobLogDetail")]
  async fn force_delete_by_ids_cron_job_log_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobLogDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_log_detail_resolver::force_delete_by_ids_cron_job_log_detail(
          ids,
          None,
        )
      }).await
  }
  
}
