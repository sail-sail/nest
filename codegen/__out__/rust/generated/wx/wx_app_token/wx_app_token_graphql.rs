
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

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::wx_app_token_model::*;
use super::wx_app_token_resolver;

#[derive(Default)]
pub struct WxAppTokenGenQuery;

#[Object(rename_args = "snake_case")]
impl WxAppTokenGenQuery {
  
  /// 根据搜索条件和分页查找小程序接口凭据列表
  #[graphql(name = "findAllWxAppToken")]
  async fn find_all_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxAppTokenSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxAppTokenModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_all_wx_app_token(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找小程序接口凭据总数
  #[graphql(name = "findCountWxAppToken")]
  async fn find_count_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxAppTokenSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_count_wx_app_token(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个小程序接口凭据
  #[graphql(name = "findOneWxAppToken")]
  async fn find_one_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxAppTokenSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxAppTokenModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_one_wx_app_token(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个小程序接口凭据, 如果不存在则抛错
  #[graphql(name = "findOneOkWxAppToken")]
  async fn find_one_ok_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxAppTokenSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxAppTokenModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_one_ok_wx_app_token(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序接口凭据
  #[graphql(name = "findByIdWxAppToken")]
  async fn find_by_id_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxAppTokenId,
  ) -> Result<Option<WxAppTokenModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_by_id_wx_app_token(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序接口凭据, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxAppToken")]
  async fn find_by_id_ok_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxAppTokenId,
  ) -> Result<WxAppTokenModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_by_id_ok_wx_app_token(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序接口凭据
  #[graphql(name = "findByIdsWxAppToken")]
  async fn find_by_ids_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxAppTokenId>,
  ) -> Result<Vec<WxAppTokenModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_by_ids_wx_app_token(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序接口凭据
  #[graphql(name = "findByIdsOkWxAppToken")]
  async fn find_by_ids_ok_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxAppTokenId>,
  ) -> Result<Vec<WxAppTokenModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_token_resolver::find_by_ids_ok_wx_app_token(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取小程序接口凭据字段注释
  #[graphql(name = "getFieldCommentsWxAppToken")]
  async fn get_field_comments_wx_app_token(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxAppTokenFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        wx_app_token_resolver::get_field_comments_wx_app_token(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxAppTokenGenMutation;

#[Object(rename_args = "snake_case")]
impl WxAppTokenGenMutation {
  
  /// 创建小程序接口凭据
  #[graphql(name = "createsWxAppToken")]
  async fn creates_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<WxAppTokenInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxAppTokenId>> {
    
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
        wx_app_token_resolver::creates_wx_app_token(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 根据 id 修改小程序接口凭据
  #[graphql(name = "updateByIdWxAppToken")]
  async fn update_by_id_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxAppTokenId,
    #[graphql(name = "input")]
    input: WxAppTokenInput,
  ) -> Result<WxAppTokenId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_token_resolver::update_by_id_wx_app_token(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除小程序接口凭据
  #[graphql(name = "deleteByIdsWxAppToken")]
  async fn delete_by_ids_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxAppTokenId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_token_resolver::delete_by_ids_wx_app_token(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原小程序接口凭据
  #[graphql(name = "revertByIdsWxAppToken")]
  async fn revert_by_ids_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxAppTokenId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_token_resolver::revert_by_ids_wx_app_token(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除小程序接口凭据
  #[graphql(name = "forceDeleteByIdsWxAppToken")]
  async fn force_delete_by_ids_wx_app_token(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxAppTokenId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_token_resolver::force_delete_by_ids_wx_app_token(
          ids,
          None,
        )
      }).await
  }
  
}
