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

use super::login_log_model::*;
use super::login_log_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct LoginLogGenQuery;

#[Object(rename_args = "snake_case")]
impl LoginLogGenQuery {
  
  /// 根据搜索条件和分页查找登录日志列表
  async fn find_all_login_log(
    &self,
    ctx: &Context<'_>,
    search: Option<LoginLogSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<LoginLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_all_login_log(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找登录日志总数
  async fn find_count_login_log(
    &self,
    ctx: &Context<'_>,
    search: Option<LoginLogSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_count_login_log(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个登录日志
  async fn find_one_login_log(
    &self,
    ctx: &Context<'_>,
    search: Option<LoginLogSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<LoginLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_one_login_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个登录日志, 如果不存在则抛错
  async fn find_one_ok_login_log(
    &self,
    ctx: &Context<'_>,
    search: Option<LoginLogSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<LoginLogModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_one_ok_login_log(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找登录日志
  async fn find_by_id_login_log(
    &self,
    ctx: &Context<'_>,
    id: LoginLogId,
  ) -> Result<Option<LoginLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_by_id_login_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找登录日志, 如果不存在则抛错
  async fn find_by_id_ok_login_log(
    &self,
    ctx: &Context<'_>,
    id: LoginLogId,
  ) -> Result<LoginLogModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_by_id_ok_login_log(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找登录日志
  async fn find_by_ids_login_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LoginLogId>,
  ) -> Result<Vec<LoginLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_by_ids_login_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找登录日志
  async fn find_by_ids_ok_login_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LoginLogId>,
  ) -> Result<Vec<LoginLogModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        login_log_resolver::find_by_ids_ok_login_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取登录日志字段注释
  async fn get_field_comments_login_log(
    &self,
    ctx: &Context<'_>,
  ) -> Result<LoginLogFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        login_log_resolver::get_field_comments_login_log(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct LoginLogGenMutation;

#[Object(rename_args = "snake_case")]
impl LoginLogGenMutation {
  
  /// 占位方法, 用于实现 LoginLogInput
  #[allow(unused_variables)]
  async fn no_add_no_edit_login_log(
    &self,
    ctx: &Context<'_>,
    input: LoginLogInput,
  ) -> Result<LoginLogId> {
    Err(eyre!(""))
  }
  
  /// 登录日志根据id修改租户id
  async fn update_tenant_by_id_login_log(
    &self,
    ctx: &Context<'_>,
    id: LoginLogId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        login_log_resolver::update_tenant_by_id_login_log(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除登录日志
  async fn delete_by_ids_login_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LoginLogId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        login_log_resolver::delete_by_ids_login_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原登录日志
  async fn revert_by_ids_login_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LoginLogId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        login_log_resolver::revert_by_ids_login_log(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除登录日志
  async fn force_delete_by_ids_login_log(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LoginLogId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        login_log_resolver::force_delete_by_ids_login_log(
          ids,
          None,
        )
      }).await
  }
  
}
