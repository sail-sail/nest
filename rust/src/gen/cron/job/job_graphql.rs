#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};
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

use super::job_model::*;
use super::job_resolver;

use crate::r#gen::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct JobGenQuery;

#[Object(rename_args = "snake_case")]
impl JobGenQuery {
  
  /// 根据搜索条件和分页查找任务列表
  async fn find_all_job(
    &self,
    ctx: &Context<'_>,
    search: Option<JobSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<JobModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        job_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找任务总数
  async fn find_count_job(
    &self,
    ctx: &Context<'_>,
    search: Option<JobSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        job_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个任务
  async fn find_one_job(
    &self,
    ctx: &Context<'_>,
    search: Option<JobSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<JobModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        job_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找任务
  async fn find_by_id_job(
    &self,
    ctx: &Context<'_>,
    id: JobId,
  ) -> Result<Option<JobModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        job_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找任务是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_job(
    &self,
    ctx: &Context<'_>,
    id: JobId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        job_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找任务是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_job(
    &self,
    ctx: &Context<'_>,
    id: JobId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        job_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取任务字段注释
  async fn get_field_comments_job(
    &self,
    ctx: &Context<'_>,
  ) -> Result<JobFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        job_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 任务 order_by 字段的最大值
  async fn find_last_order_by_job(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        job_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct JobGenMutation;

#[Object(rename_args = "snake_case")]
impl JobGenMutation {
  
  /// 创建任务
  async fn creates_job(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<JobInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<JobId>> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .with_creating(Some(true))
      .build()
      .scope({
        job_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 任务根据id修改租户id
  async fn update_tenant_by_id_job(
    &self,
    ctx: &Context<'_>,
    id: JobId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        job_resolver::update_tenant_by_id(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改任务
  async fn update_by_id_job(
    &self,
    ctx: &Context<'_>,
    id: JobId,
    input: JobInput,
  ) -> Result<JobId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        job_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除任务
  async fn delete_by_ids_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<JobId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        job_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用任务
  async fn enable_by_ids_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<JobId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        job_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<JobId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        job_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原任务
  async fn revert_by_ids_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<JobId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        job_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除任务
  async fn force_delete_by_ids_job(
    &self,
    ctx: &Context<'_>,
    ids: Vec<JobId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        job_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
