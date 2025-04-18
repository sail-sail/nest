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

use super::wxo_app_token_model::*;
use super::wxo_app_token_resolver;

#[derive(Default)]
pub struct WxoAppTokenGenQuery;

#[Object(rename_args = "snake_case")]
impl WxoAppTokenGenQuery {
  
  /// 根据搜索条件和分页查找小程序接口凭据列表
  async fn find_all_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoAppTokenSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxoAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_token_resolver::find_all_wxo_app_token(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找小程序接口凭据总数
  async fn find_count_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoAppTokenSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_token_resolver::find_count_wxo_app_token(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个小程序接口凭据
  async fn find_one_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoAppTokenSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxoAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_token_resolver::find_one_wxo_app_token(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序接口凭据
  async fn find_by_id_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    id: WxoAppTokenId,
  ) -> Result<Option<WxoAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_token_resolver::find_by_id_wxo_app_token(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序接口凭据
  async fn find_by_ids_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppTokenId>,
  ) -> Result<Vec<WxoAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_token_resolver::find_by_ids_wxo_app_token(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取小程序接口凭据字段注释
  async fn get_field_comments_wxo_app_token(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxoAppTokenFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxo_app_token_resolver::get_field_comments_wxo_app_token(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxoAppTokenGenMutation;

#[Object(rename_args = "snake_case")]
impl WxoAppTokenGenMutation {
  
  /// 创建小程序接口凭据
  async fn creates_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxoAppTokenInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxoAppTokenId>> {
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
        wxo_app_token_resolver::creates_wxo_app_token(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改小程序接口凭据
  async fn update_by_id_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    id: WxoAppTokenId,
    input: WxoAppTokenInput,
  ) -> Result<WxoAppTokenId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_token_resolver::update_by_id_wxo_app_token(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除小程序接口凭据
  async fn delete_by_ids_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppTokenId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_token_resolver::delete_by_ids_wxo_app_token(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原小程序接口凭据
  async fn revert_by_ids_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppTokenId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_token_resolver::revert_by_ids_wxo_app_token(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除小程序接口凭据
  async fn force_delete_by_ids_wxo_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppTokenId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_token_resolver::force_delete_by_ids_wxo_app_token(
          ids,
          None,
        )
      }).await
  }
  
}
