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

use super::data_permit_model::*;
use super::data_permit_resolver;

#[derive(Default)]
pub struct DataPermitGenQuery;

#[Object(rename_args = "snake_case")]
impl DataPermitGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_data_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<DataPermitSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DataPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_data_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<DataPermitSearch>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_data_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<DataPermitSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DataPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_data_permit(
    &self,
    ctx: &Context<'_>,
    id: String,
  ) -> Result<Option<DataPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_data_permit(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DataPermitFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        data_permit_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DataPermitGenMutation;

#[Object(rename_args = "snake_case")]
impl DataPermitGenMutation {
  
  /// 创建数据
  async fn create_data_permit(
    &self,
    ctx: &Context<'_>,
    model: DataPermitInput,
    unique_type: Option<UniqueType>,
  ) -> Result<String> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        data_permit_resolver::create(
          model,
          options.into(),
        )
      }).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_data_permit(
    &self,
    ctx: &Context<'_>,
    id: String,
    model: DataPermitInput,
  ) -> Result<String> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        data_permit_resolver::update_by_id(
          id,
          model,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<String>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        data_permit_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<String>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        data_permit_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<String>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        data_permit_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
