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

use super::lang_model::*;
use super::lang_resolver;

#[derive(Default)]
pub struct LangGenQuery;

#[Object(rename_args = "snake_case")]
impl LangGenQuery {
  
  /// 根据搜索条件和分页查找语言列表
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
  
  /// 根据条件查找语言总数
  async fn find_count_lang(
    &self,
    ctx: &Context<'_>,
    search: Option<LangSearch>,
  ) -> Result<u64> {
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
  
  /// 根据条件查找第一个语言
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
  
  /// 根据 id 查找语言
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
  
  /// 根据 id 查找语言
  async fn find_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
  ) -> Result<Vec<LangModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        lang_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找语言是否已启用
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
  
  /// 获取语言字段注释
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
  
  /// 查找 语言 order_by 字段的最大值
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
  
  /// 创建语言
  async fn creates_lang(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<LangInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<LangId>> {
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
        lang_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改语言
  async fn update_by_id_lang(
    &self,
    ctx: &Context<'_>,
    id: LangId,
    input: LangInput,
  ) -> Result<LangId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        lang_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除语言
  async fn delete_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        lang_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用语言
  async fn enable_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        lang_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原语言
  async fn revert_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        lang_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除语言
  async fn force_delete_by_ids_lang(
    &self,
    ctx: &Context<'_>,
    ids: Vec<LangId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        lang_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
