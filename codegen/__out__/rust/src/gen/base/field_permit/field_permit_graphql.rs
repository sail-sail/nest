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

use super::field_permit_model::*;
use super::field_permit_resolver;

#[derive(Default)]
pub struct FieldPermitGenQuery;

#[Object(rename_args = "snake_case")]
impl FieldPermitGenQuery {
  
  /// 根据搜索条件和分页查找字段权限列表
  async fn find_all_field_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<FieldPermitSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<FieldPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        field_permit_resolver::find_all_field_permit(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找字段权限总数
  async fn find_count_field_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<FieldPermitSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        field_permit_resolver::find_count_field_permit(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个字段权限
  async fn find_one_field_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<FieldPermitSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<FieldPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        field_permit_resolver::find_one_field_permit(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找字段权限
  async fn find_by_id_field_permit(
    &self,
    ctx: &Context<'_>,
    id: FieldPermitId,
  ) -> Result<Option<FieldPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        field_permit_resolver::find_by_id_field_permit(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找字段权限
  async fn find_by_ids_field_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<FieldPermitId>,
  ) -> Result<Vec<FieldPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        field_permit_resolver::find_by_ids_field_permit(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取字段权限字段注释
  async fn get_field_comments_field_permit(
    &self,
    ctx: &Context<'_>,
  ) -> Result<FieldPermitFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        field_permit_resolver::get_field_comments_field_permit(
          None,
        )
      }).await
  }
  
  /// 查找 字段权限 order_by 字段的最大值
  async fn find_last_order_by_field_permit(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        field_permit_resolver::find_last_order_by_field_permit(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct FieldPermitGenMutation;

#[Object(rename_args = "snake_case")]
impl FieldPermitGenMutation {
  
  /// 根据 id 修改字段权限
  async fn update_by_id_field_permit(
    &self,
    ctx: &Context<'_>,
    id: FieldPermitId,
    input: FieldPermitInput,
  ) -> Result<FieldPermitId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        field_permit_resolver::update_by_id_field_permit(
          id,
          input,
          None,
        )
      }).await
  }
  
}
