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

use super::permit_model::*;
use super::permit_resolver;

#[derive(Default)]
pub struct PermitGenQuery;

#[Object(rename_args = "snake_case")]
impl PermitGenQuery {
  
  /// 根据搜索条件和分页查找按钮权限列表
  async fn find_all_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<PermitSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<PermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找按钮权限总数
  async fn find_count_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<PermitSearch>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个按钮权限
  async fn find_one_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<PermitSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<PermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找按钮权限
  async fn find_by_id_permit(
    &self,
    ctx: &Context<'_>,
    id: PermitId,
  ) -> Result<Option<PermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取按钮权限字段注释
  async fn get_field_comments_permit(
    &self,
    ctx: &Context<'_>,
  ) -> Result<PermitFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        permit_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct PermitGenMutation;

#[Object(rename_args = "snake_case")]
impl PermitGenMutation {
  
  /// 创建按钮权限
  async fn create_permit(
    &self,
    ctx: &Context<'_>,
    input: PermitInput,
    unique_type: Option<UniqueType>,
  ) -> Result<PermitId> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        permit_resolver::create(
          input,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改按钮权限
  async fn update_by_id_permit(
    &self,
    ctx: &Context<'_>,
    id: PermitId,
    input: PermitInput,
  ) -> Result<PermitId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        permit_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除按钮权限
  async fn delete_by_ids_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<PermitId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        permit_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原按钮权限
  async fn revert_by_ids_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<PermitId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        permit_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除按钮权限
  async fn force_delete_by_ids_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<PermitId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        permit_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
