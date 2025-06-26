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

use super::data_permit_model::*;
use super::data_permit_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DataPermitGenQuery;

#[Object(rename_args = "snake_case")]
impl DataPermitGenQuery {
  
  /// 根据搜索条件和分页查找数据权限列表
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
        data_permit_resolver::find_all_data_permit(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找数据权限总数
  async fn find_count_data_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<DataPermitSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_count_data_permit(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个数据权限
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
        data_permit_resolver::find_one_data_permit(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个数据权限, 如果不存在则抛错
  async fn find_one_ok_data_permit(
    &self,
    ctx: &Context<'_>,
    search: Option<DataPermitSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DataPermitModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_one_ok_data_permit(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找数据权限
  async fn find_by_id_data_permit(
    &self,
    ctx: &Context<'_>,
    id: DataPermitId,
  ) -> Result<Option<DataPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_by_id_data_permit(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找数据权限, 如果不存在则抛错
  async fn find_by_id_ok_data_permit(
    &self,
    ctx: &Context<'_>,
    id: DataPermitId,
  ) -> Result<DataPermitModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_by_id_ok_data_permit(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找数据权限
  async fn find_by_ids_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DataPermitId>,
  ) -> Result<Vec<DataPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_by_ids_data_permit(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找数据权限
  async fn find_by_ids_ok_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DataPermitId>,
  ) -> Result<Vec<DataPermitModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        data_permit_resolver::find_by_ids_ok_data_permit(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取数据权限字段注释
  async fn get_field_comments_data_permit(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DataPermitFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        data_permit_resolver::get_field_comments_data_permit(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DataPermitGenMutation;

#[Object(rename_args = "snake_case")]
impl DataPermitGenMutation {
  
  /// 创建数据权限
  async fn creates_data_permit(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DataPermitInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DataPermitId>> {
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
        data_permit_resolver::creates_data_permit(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 数据权限根据id修改租户id
  async fn update_tenant_by_id_data_permit(
    &self,
    ctx: &Context<'_>,
    id: DataPermitId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        data_permit_resolver::update_tenant_by_id_data_permit(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改数据权限
  async fn update_by_id_data_permit(
    &self,
    ctx: &Context<'_>,
    id: DataPermitId,
    input: DataPermitInput,
  ) -> Result<DataPermitId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        data_permit_resolver::update_by_id_data_permit(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除数据权限
  async fn delete_by_ids_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DataPermitId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        data_permit_resolver::delete_by_ids_data_permit(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原数据权限
  async fn revert_by_ids_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DataPermitId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        data_permit_resolver::revert_by_ids_data_permit(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除数据权限
  async fn force_delete_by_ids_data_permit(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DataPermitId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        data_permit_resolver::force_delete_by_ids_data_permit(
          ids,
          None,
        )
      }).await
  }
  
}
