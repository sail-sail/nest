
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

use super::wx_refund_notice_model::*;
use super::wx_refund_notice_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxRefundNoticeGenQuery;

#[Object(rename_args = "snake_case")]
impl WxRefundNoticeGenQuery {
  
  /// 根据搜索条件和分页查找微信退款通知列表
  #[graphql(name = "findAllWxRefundNotice")]
  async fn find_all_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundNoticeSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxRefundNoticeModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_all_wx_refund_notice(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找微信退款通知总数
  #[graphql(name = "findCountWxRefundNotice")]
  async fn find_count_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundNoticeSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_count_wx_refund_notice(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个微信退款通知
  #[graphql(name = "findOneWxRefundNotice")]
  async fn find_one_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundNoticeSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxRefundNoticeModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_one_wx_refund_notice(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个微信退款通知, 如果不存在则抛错
  #[graphql(name = "findOneOkWxRefundNotice")]
  async fn find_one_ok_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxRefundNoticeSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxRefundNoticeModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_one_ok_wx_refund_notice(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款通知
  #[graphql(name = "findByIdWxRefundNotice")]
  async fn find_by_id_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxRefundNoticeId,
  ) -> Result<Option<WxRefundNoticeModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_by_id_wx_refund_notice(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款通知, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxRefundNotice")]
  async fn find_by_id_ok_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxRefundNoticeId,
  ) -> Result<WxRefundNoticeModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_by_id_ok_wx_refund_notice(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款通知
  #[graphql(name = "findByIdsWxRefundNotice")]
  async fn find_by_ids_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxRefundNoticeId>,
  ) -> Result<Vec<WxRefundNoticeModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_by_ids_wx_refund_notice(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信退款通知
  #[graphql(name = "findByIdsOkWxRefundNotice")]
  async fn find_by_ids_ok_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxRefundNoticeId>,
  ) -> Result<Vec<WxRefundNoticeModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_notice_resolver::find_by_ids_ok_wx_refund_notice(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取微信退款通知字段注释
  #[graphql(name = "getFieldCommentsWxRefundNotice")]
  async fn get_field_comments_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxRefundNoticeFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        wx_refund_notice_resolver::get_field_comments_wx_refund_notice(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxRefundNoticeGenMutation;

#[Object(rename_args = "snake_case")]
impl WxRefundNoticeGenMutation {
  
  /// 占位方法, 用于实现 WxRefundNoticeInput
  #[allow(unused_variables)]
  #[graphql(name = "noAddNoEditWxRefundNotice")]
  async fn no_add_no_edit_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: WxRefundNoticeInput,
  ) -> Result<WxRefundNoticeId> {
    
    Err(eyre!(""))
  }
  
  /// 微信退款通知根据id修改租户id
  #[graphql(name = "updateTenantByIdWxRefundNotice")]
  async fn update_tenant_by_id_wx_refund_notice(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxRefundNoticeId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_refund_notice_resolver::update_tenant_by_id_wx_refund_notice(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
}
