
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

use super::dict_detail_model::*;
use super::dict_detail_resolver;

#[derive(Default)]
pub struct DictDetailGenQuery;

#[Object(rename_args = "snake_case")]
impl DictDetailGenQuery {
  
  /// 根据搜索条件和分页查找系统字典明细列表
  #[graphql(name = "findAllDictDetail")]
  async fn find_all_dict_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictDetailSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_all_dict_detail(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找系统字典明细总数
  #[graphql(name = "findCountDictDetail")]
  async fn find_count_dict_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictDetailSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_count_dict_detail(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个系统字典明细
  #[graphql(name = "findOneDictDetail")]
  async fn find_one_dict_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictDetailSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_one_dict_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个系统字典明细, 如果不存在则抛错
  #[graphql(name = "findOneOkDictDetail")]
  async fn find_one_ok_dict_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictDetailSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DictDetailModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_one_ok_dict_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典明细
  #[graphql(name = "findByIdDictDetail")]
  async fn find_by_id_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
  ) -> Result<Option<DictDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_by_id_dict_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典明细, 如果不存在则抛错
  #[graphql(name = "findByIdOkDictDetail")]
  async fn find_by_id_ok_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
  ) -> Result<DictDetailModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_by_id_ok_dict_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典明细
  #[graphql(name = "findByIdsDictDetail")]
  async fn find_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<Vec<DictDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_by_ids_dict_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典明细
  #[graphql(name = "findByIdsOkDictDetail")]
  async fn find_by_ids_ok_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<Vec<DictDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_by_ids_ok_dict_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典明细是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdDictDetail")]
  async fn get_is_enabled_by_id_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::get_is_enabled_by_id_dict_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 获取系统字典明细字段注释
  #[graphql(name = "getFieldCommentsDictDetail")]
  async fn get_field_comments_dict_detail(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DictDetailFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dict_detail_resolver::get_field_comments_dict_detail(
          None,
        )
      }).await
  }
  
  /// 查找 系统字典明细 order_by 字段的最大值
  #[graphql(name = "findLastOrderByDictDetail")]
  async fn find_last_order_by_dict_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictDetailSearch>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_last_order_by_dict_detail(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DictDetailGenMutation;

#[Object(rename_args = "snake_case")]
impl DictDetailGenMutation {
  
  /// 创建系统字典明细
  #[graphql(name = "createsDictDetail")]
  async fn creates_dict_detail(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DictDetailInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DictDetailId>> {
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
        dict_detail_resolver::creates_dict_detail(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改系统字典明细
  #[graphql(name = "updateByIdDictDetail")]
  async fn update_by_id_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
    input: DictDetailInput,
  ) -> Result<DictDetailId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_detail_resolver::update_by_id_dict_detail(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除系统字典明细
  #[graphql(name = "deleteByIdsDictDetail")]
  async fn delete_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_detail_resolver::delete_by_ids_dict_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用系统字典明细
  #[graphql(name = "enableByIdsDictDetail")]
  async fn enable_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_detail_resolver::enable_by_ids_dict_detail(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原系统字典明细
  #[graphql(name = "revertByIdsDictDetail")]
  async fn revert_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_detail_resolver::revert_by_ids_dict_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除系统字典明细
  #[graphql(name = "forceDeleteByIdsDictDetail")]
  async fn force_delete_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_detail_resolver::force_delete_by_ids_dict_detail(
          ids,
          None,
        )
      }).await
  }
  
}
