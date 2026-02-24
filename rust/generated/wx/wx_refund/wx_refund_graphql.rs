
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

use super::wx_refund_model::*;
use super::wx_refund_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxRefundGenQuery;

#[Object(rename_args = "snake_case")]
impl WxRefundGenQuery {
  
  /// 根据搜索条件和分页查找微信退款申请列表
  #[graphql(name = "findAllWxRefund")]
  async fn find_all_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxRefundModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_all_wx_refund(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找微信退款申请总数
  #[graphql(name = "findCountWxRefund")]
  async fn find_count_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_count_wx_refund(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个微信退款申请
  #[graphql(name = "findOneWxRefund")]
  async fn find_one_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxRefundModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_one_wx_refund(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个微信退款申请, 如果不存在则抛错
  #[graphql(name = "findOneOkWxRefund")]
  async fn find_one_ok_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxRefundModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_one_ok_wx_refund(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款申请
  #[graphql(name = "findByIdWxRefund")]
  async fn find_by_id_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxRefundId,
  ) -> Result<Option<WxRefundModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_by_id_wx_refund(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款申请, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxRefund")]
  async fn find_by_id_ok_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxRefundId,
  ) -> Result<WxRefundModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_by_id_ok_wx_refund(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款申请
  #[graphql(name = "findByIdsWxRefund")]
  async fn find_by_ids_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxRefundId>,
  ) -> Result<Vec<WxRefundModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_by_ids_wx_refund(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款申请
  #[graphql(name = "findByIdsOkWxRefund")]
  async fn find_by_ids_ok_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxRefundId>,
  ) -> Result<Vec<WxRefundModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::find_by_ids_ok_wx_refund(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取微信退款申请字段注释
  #[graphql(name = "getFieldCommentsWxRefund")]
  async fn get_field_comments_wx_refund(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxRefundFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        wx_refund_resolver::get_field_comments_wx_refund(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxRefundGenMutation;

#[Object(rename_args = "snake_case")]
impl WxRefundGenMutation {
  
  /// 占位方法, 用于实现 WxRefundInput
  #[allow(unused_variables)]
  #[graphql(name = "noAddNoEditWxRefund")]
  async fn no_add_no_edit_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: WxRefundInput,
  ) -> Result<WxRefundId> {
    
    Err(eyre!(""))
  }
  
  /// 微信退款申请根据id修改租户id
  #[graphql(name = "updateTenantByIdWxRefund")]
  async fn update_tenant_by_id_wx_refund(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxRefundId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_refund_resolver::update_tenant_by_id_wx_refund(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
}
