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

use super::wxw_app_token_model::*;
use super::wxw_app_token_resolver;

use crate::r#gen::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxwAppTokenGenQuery;

#[Object(rename_args = "snake_case")]
impl WxwAppTokenGenQuery {
  
  /// 根据搜索条件和分页查找企微应用接口凭据列表
  async fn find_all_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwAppTokenSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxwAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_token_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找企微应用接口凭据总数
  async fn find_count_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwAppTokenSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_token_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个企微应用接口凭据
  async fn find_one_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwAppTokenSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxwAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_token_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用接口凭据
  async fn find_by_id_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    id: WxwAppTokenId,
  ) -> Result<Option<WxwAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_token_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用接口凭据
  async fn find_by_ids_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppTokenId>,
  ) -> Result<Vec<WxwAppTokenModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_token_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取企微应用接口凭据字段注释
  async fn get_field_comments_wxw_app_token(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxwAppTokenFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_app_token_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxwAppTokenGenMutation;

#[Object(rename_args = "snake_case")]
impl WxwAppTokenGenMutation {
  
  /// 创建企微应用接口凭据
  async fn creates_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxwAppTokenInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxwAppTokenId>> {
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
        wxw_app_token_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 企微应用接口凭据根据id修改租户id
  async fn update_tenant_by_id_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    id: WxwAppTokenId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_token_resolver::update_tenant_by_id(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改企微应用接口凭据
  async fn update_by_id_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    id: WxwAppTokenId,
    input: WxwAppTokenInput,
  ) -> Result<WxwAppTokenId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_token_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除企微应用接口凭据
  async fn delete_by_ids_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppTokenId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_token_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原企微应用接口凭据
  async fn revert_by_ids_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppTokenId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_token_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除企微应用接口凭据
  async fn force_delete_by_ids_wxw_app_token(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppTokenId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_token_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
