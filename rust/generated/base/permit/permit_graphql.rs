
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
        permit_resolver::find_all_permit(
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
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_count_permit(
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
        permit_resolver::find_one_permit(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个按钮权限, 如果不存在则抛错
  async fn find_one_ok_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<PermitSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<PermitModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_one_ok_permit(
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
        permit_resolver::find_by_id_permit(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找按钮权限, 如果不存在则抛错
  async fn find_by_id_ok_permit(
    &self,
    ctx: &Context<'_>,
    id: PermitId,
  ) -> Result<PermitModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_by_id_ok_permit(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找按钮权限
  async fn find_by_ids_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<PermitId>,
  ) -> Result<Vec<PermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_by_ids_permit(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找按钮权限
  async fn find_by_ids_ok_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<PermitId>,
  ) -> Result<Vec<PermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_by_ids_ok_permit(
          ids,
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
        permit_resolver::get_field_comments_permit(
          None,
        )
      }).await
  }
  
  /// 查找 按钮权限 order_by 字段的最大值
  async fn find_last_order_by_permit(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::find_last_order_by_permit(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct PermitGenMutation;

#[Object(rename_args = "snake_case")]
impl PermitGenMutation {
  
  /// 根据 id 修改按钮权限
  async fn update_by_id_permit(
    &self,
    ctx: &Context<'_>,
    id: PermitId,
    input: PermitInput,
  ) -> Result<PermitId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        permit_resolver::update_by_id_permit(
          id,
          input,
          None,
        )
      }).await
  }
  
}
