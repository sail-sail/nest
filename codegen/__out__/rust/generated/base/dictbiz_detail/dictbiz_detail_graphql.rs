
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

use super::dictbiz_detail_model::*;
use super::dictbiz_detail_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DictbizDetailGenQuery;

#[Object(rename_args = "snake_case")]
impl DictbizDetailGenQuery {
  
  /// 根据搜索条件和分页查找业务字典明细列表
  #[graphql(name = "findAllDictbizDetail")]
  async fn find_all_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictbizDetailSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictbizDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_all_dictbiz_detail(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找业务字典明细总数
  #[graphql(name = "findCountDictbizDetail")]
  async fn find_count_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictbizDetailSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_count_dictbiz_detail(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个业务字典明细
  #[graphql(name = "findOneDictbizDetail")]
  async fn find_one_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictbizDetailSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictbizDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_one_dictbiz_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个业务字典明细, 如果不存在则抛错
  #[graphql(name = "findOneOkDictbizDetail")]
  async fn find_one_ok_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictbizDetailSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DictbizDetailModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_one_ok_dictbiz_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典明细
  #[graphql(name = "findByIdDictbizDetail")]
  async fn find_by_id_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    id: DictbizDetailId,
  ) -> Result<Option<DictbizDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_by_id_dictbiz_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典明细, 如果不存在则抛错
  #[graphql(name = "findByIdOkDictbizDetail")]
  async fn find_by_id_ok_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    id: DictbizDetailId,
  ) -> Result<DictbizDetailModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_by_id_ok_dictbiz_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典明细
  #[graphql(name = "findByIdsDictbizDetail")]
  async fn find_by_ids_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizDetailId>,
  ) -> Result<Vec<DictbizDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_by_ids_dictbiz_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典明细
  #[graphql(name = "findByIdsOkDictbizDetail")]
  async fn find_by_ids_ok_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizDetailId>,
  ) -> Result<Vec<DictbizDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_by_ids_ok_dictbiz_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找业务字典明细是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdDictbizDetail")]
  async fn get_is_enabled_by_id_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    id: DictbizDetailId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::get_is_enabled_by_id_dictbiz_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 获取业务字典明细字段注释
  #[graphql(name = "getFieldCommentsDictbizDetail")]
  async fn get_field_comments_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DictbizDetailFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dictbiz_detail_resolver::get_field_comments_dictbiz_detail(
          None,
        )
      }).await
  }
  
  /// 查找 业务字典明细 order_by 字段的最大值
  #[graphql(name = "findLastOrderByDictbizDetail")]
  async fn find_last_order_by_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dictbiz_detail_resolver::find_last_order_by_dictbiz_detail(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DictbizDetailGenMutation;

#[Object(rename_args = "snake_case")]
impl DictbizDetailGenMutation {
  
  /// 创建业务字典明细
  #[graphql(name = "createsDictbizDetail")]
  async fn creates_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DictbizDetailInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DictbizDetailId>> {
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
        dictbiz_detail_resolver::creates_dictbiz_detail(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 业务字典明细根据id修改租户id
  #[graphql(name = "updateTenantByIdDictbizDetail")]
  async fn update_tenant_by_id_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    id: DictbizDetailId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dictbiz_detail_resolver::update_tenant_by_id_dictbiz_detail(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改业务字典明细
  #[graphql(name = "updateByIdDictbizDetail")]
  async fn update_by_id_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    id: DictbizDetailId,
    input: DictbizDetailInput,
  ) -> Result<DictbizDetailId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dictbiz_detail_resolver::update_by_id_dictbiz_detail(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除业务字典明细
  #[graphql(name = "deleteByIdsDictbizDetail")]
  async fn delete_by_ids_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dictbiz_detail_resolver::delete_by_ids_dictbiz_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用业务字典明细
  #[graphql(name = "enableByIdsDictbizDetail")]
  async fn enable_by_ids_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizDetailId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dictbiz_detail_resolver::enable_by_ids_dictbiz_detail(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原业务字典明细
  #[graphql(name = "revertByIdsDictbizDetail")]
  async fn revert_by_ids_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dictbiz_detail_resolver::revert_by_ids_dictbiz_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除业务字典明细
  #[graphql(name = "forceDeleteByIdsDictbizDetail")]
  async fn force_delete_by_ids_dictbiz_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictbizDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dictbiz_detail_resolver::force_delete_by_ids_dictbiz_detail(
          ids,
          None,
        )
      }).await
  }
  
}
