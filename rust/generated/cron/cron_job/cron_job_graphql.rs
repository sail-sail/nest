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

use super::cron_job_model::*;
use super::cron_job_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct CronJobGenQuery;

#[Object(rename_args = "snake_case")]
impl CronJobGenQuery {
  
  /// 根据搜索条件和分页查找定时任务列表
  async fn find_all_cron_job(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<CronJobModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::find_all_cron_job(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找定时任务总数
  async fn find_count_cron_job(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::find_count_cron_job(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个定时任务
  async fn find_one_cron_job(
    &self,
    ctx: &Context<'_>,
    search: Option<CronJobSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<CronJobModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::find_one_cron_job(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务
  async fn find_by_id_cron_job(
    &self,
    ctx: &Context<'_>,
    id: CronJobId,
  ) -> Result<Option<CronJobModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::find_by_id_cron_job(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务
  async fn find_by_ids_cron_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobId>,
  ) -> Result<Vec<CronJobModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::find_by_ids_cron_job(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_cron_job(
    &self,
    ctx: &Context<'_>,
    id: CronJobId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::get_is_enabled_by_id_cron_job(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找定时任务是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_cron_job(
    &self,
    ctx: &Context<'_>,
    id: CronJobId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::get_is_locked_by_id_cron_job(
          id,
          None,
        )
      }).await
  }
  
  /// 获取定时任务字段注释
  async fn get_field_comments_cron_job(
    &self,
    ctx: &Context<'_>,
  ) -> Result<CronJobFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        cron_job_resolver::get_field_comments_cron_job(
          None,
        )
      }).await
  }
  
  /// 查找 定时任务 order_by 字段的最大值
  async fn find_last_order_by_cron_job(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cron_job_resolver::find_last_order_by_cron_job(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct CronJobGenMutation;

#[Object(rename_args = "snake_case")]
impl CronJobGenMutation {
  
  /// 创建定时任务
  async fn creates_cron_job(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<CronJobInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<CronJobId>> {
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
        cron_job_resolver::creates_cron_job(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 定时任务根据id修改租户id
  async fn update_tenant_by_id_cron_job(
    &self,
    ctx: &Context<'_>,
    id: CronJobId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_resolver::update_tenant_by_id_cron_job(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改定时任务
  async fn update_by_id_cron_job(
    &self,
    ctx: &Context<'_>,
    id: CronJobId,
    input: CronJobInput,
  ) -> Result<CronJobId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_resolver::update_by_id_cron_job(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除定时任务
  async fn delete_by_ids_cron_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_resolver::delete_by_ids_cron_job(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用定时任务
  async fn enable_by_ids_cron_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_resolver::enable_by_ids_cron_job(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_cron_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_resolver::lock_by_ids_cron_job(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原定时任务
  async fn revert_by_ids_cron_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_resolver::revert_by_ids_cron_job(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除定时任务
  async fn force_delete_by_ids_cron_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<CronJobId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        cron_job_resolver::force_delete_by_ids_cron_job(
          ids,
          None,
        )
      }).await
  }
  
}
