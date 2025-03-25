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

use super::wx_pay_notice_model::*;
use super::wx_pay_notice_resolver;

use crate::r#gen::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxPayNoticeGenQuery;

#[Object(rename_args = "snake_case")]
impl WxPayNoticeGenQuery {
  
  /// 根据搜索条件和分页查找微信支付通知列表
  async fn find_all_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
    search: Option<WxPayNoticeSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxPayNoticeModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_notice_resolver::find_all_wx_pay_notice(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找微信支付通知总数
  async fn find_count_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
    search: Option<WxPayNoticeSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_notice_resolver::find_count_wx_pay_notice(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个微信支付通知
  async fn find_one_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
    search: Option<WxPayNoticeSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxPayNoticeModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_notice_resolver::find_one_wx_pay_notice(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信支付通知
  async fn find_by_id_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
    id: WxPayNoticeId,
  ) -> Result<Option<WxPayNoticeModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_notice_resolver::find_by_id_wx_pay_notice(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信支付通知
  async fn find_by_ids_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxPayNoticeId>,
  ) -> Result<Vec<WxPayNoticeModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_notice_resolver::find_by_ids_wx_pay_notice(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取微信支付通知字段注释
  async fn get_field_comments_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxPayNoticeFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wx_pay_notice_resolver::get_field_comments_wx_pay_notice(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxPayNoticeGenMutation;

#[Object(rename_args = "snake_case")]
impl WxPayNoticeGenMutation {
  
  /// 占位方法, 用于实现 WxPayNoticeInput
  #[allow(unused_variables)]
  async fn no_add_no_edit_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
    input: WxPayNoticeInput,
  ) -> Result<WxPayNoticeId> {
    Err(eyre!(""))
  }
  
  /// 微信支付通知根据id修改租户id
  async fn update_tenant_by_id_wx_pay_notice(
    &self,
    ctx: &Context<'_>,
    id: WxPayNoticeId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_notice_resolver::update_tenant_by_id_wx_pay_notice(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
}
