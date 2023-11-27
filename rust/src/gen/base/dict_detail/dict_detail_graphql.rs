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

use super::dict_detail_model::*;
use super::dict_detail_resolver;

#[derive(Default)]
pub struct DictDetailGenQuery;

#[Object(rename_args = "snake_case")]
impl DictDetailGenQuery {
  
  /// 根据搜索条件和分页查找数据
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
        dict_detail_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_dict_detail(
    &self,
    ctx: &Context<'_>,
    search: Option<DictDetailSearch>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一条数据
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
        dict_detail_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找第一条数据
  async fn find_by_id_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
  ) -> Result<Option<DictDetailModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_dict_detail(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DictDetailFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dict_detail_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 order_by 字段的最大值
  async fn find_last_order_by_dict_detail(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_detail_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DictDetailGenMutation;

#[Object(rename_args = "snake_case")]
impl DictDetailGenMutation {
  
  /// 创建数据
  async fn create_dict_detail(
    &self,
    ctx: &Context<'_>,
    model: DictDetailInput,
    unique_type: Option<UniqueType>,
  ) -> Result<DictDetailId> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dict_detail_resolver::create(
          model,
          options.into(),
        )
      }).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_dict_detail(
    &self,
    ctx: &Context<'_>,
    id: DictDetailId,
    model: DictDetailInput,
  ) -> Result<DictDetailId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dict_detail_resolver::update_by_id(
          id,
          model,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dict_detail_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或禁用数据
  async fn enable_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dict_detail_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dict_detail_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dict_detail_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_dict_detail(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictDetailId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        dict_detail_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
