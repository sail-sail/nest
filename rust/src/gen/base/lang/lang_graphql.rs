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

use super::lang_model::*;
use super::lang_resolver;

#[derive(Default)]
pub struct LangGenQuery;

#[Object(rename_args = "snake_case")]
impl LangGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_lang(
    &self,
    ctx: &Context<'_>,
    search: Option<LangSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<LangModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        lang_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_lang(
    &self,
    ctx: &Context<'_>,
    search: Option<LangSearch>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        lang_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_lang(
    &self,
    ctx: &Context<'_>,
    search: Option<LangSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<LangModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        lang_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找第一条数据
  async fn find_by_id_lang(
    &self,
    ctx: &Context<'_>,
    id: LangId,
  ) -> Result<Option<LangModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        lang_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_lang(
    &self,
    ctx: &Context<'_>,
    id: LangId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        lang_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_lang(
    &self,
    ctx: &Context<'_>,
  ) -> Result<LangFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        lang_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 order_by 字段的最大值
  async fn find_last_order_by_lang(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        lang_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct LangGenMutation;

#[Object(rename_args = "snake_case")]
impl LangGenMutation {
  
  /// 创建数据
  async fn create_lang(
    &self,
    ctx: &Context<'_>,
    model: LangInput,
    unique_type: Option<UniqueType>,
  ) -> Result<LangId> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        lang_resolver::create(
          model,
          options.into(),
        )
      }).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_lang(
    &self,
    ctx: &Context<'_>,
    id: LangId,
    model: LangInput,
  ) -> Result<LangId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        lang_resolver::update_by_id(
          id,
          model,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        lang_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或禁用数据
  async fn enable_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        lang_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        lang_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        lang_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
