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

use super::wx_pay_model::*;
use super::wx_pay_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxPayGenQuery;

#[Object(rename_args = "snake_case")]
impl WxPayGenQuery {
  
  /// 根据搜索条件和分页查找微信支付设置列表
  async fn find_all_wx_pay(
    &self,
    ctx: &Context<'_>,
    search: Option<WxPaySearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxPayModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::find_all_wx_pay(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找微信支付设置总数
  async fn find_count_wx_pay(
    &self,
    ctx: &Context<'_>,
    search: Option<WxPaySearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::find_count_wx_pay(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个微信支付设置
  async fn find_one_wx_pay(
    &self,
    ctx: &Context<'_>,
    search: Option<WxPaySearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxPayModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::find_one_wx_pay(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信支付设置
  async fn find_by_id_wx_pay(
    &self,
    ctx: &Context<'_>,
    id: WxPayId,
  ) -> Result<Option<WxPayModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::find_by_id_wx_pay(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信支付设置
  async fn find_by_ids_wx_pay(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxPayId>,
  ) -> Result<Vec<WxPayModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::find_by_ids_wx_pay(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信支付设置是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_wx_pay(
    &self,
    ctx: &Context<'_>,
    id: WxPayId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::get_is_enabled_by_id_wx_pay(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信支付设置是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_wx_pay(
    &self,
    ctx: &Context<'_>,
    id: WxPayId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::get_is_locked_by_id_wx_pay(
          id,
          None,
        )
      }).await
  }
  
  /// 获取微信支付设置字段注释
  async fn get_field_comments_wx_pay(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxPayFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wx_pay_resolver::get_field_comments_wx_pay(
          None,
        )
      }).await
  }
  
  /// 查找 微信支付设置 order_by 字段的最大值
  async fn find_last_order_by_wx_pay(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_pay_resolver::find_last_order_by_wx_pay(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxPayGenMutation;

#[Object(rename_args = "snake_case")]
impl WxPayGenMutation {
  
  /// 创建微信支付设置
  async fn creates_wx_pay(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxPayInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxPayId>> {
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
        wx_pay_resolver::creates_wx_pay(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 微信支付设置根据id修改租户id
  async fn update_tenant_by_id_wx_pay(
    &self,
    ctx: &Context<'_>,
    id: WxPayId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_resolver::update_tenant_by_id_wx_pay(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改微信支付设置
  async fn update_by_id_wx_pay(
    &self,
    ctx: &Context<'_>,
    id: WxPayId,
    input: WxPayInput,
  ) -> Result<WxPayId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_resolver::update_by_id_wx_pay(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除微信支付设置
  async fn delete_by_ids_wx_pay(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxPayId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_resolver::delete_by_ids_wx_pay(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用微信支付设置
  async fn enable_by_ids_wx_pay(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxPayId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_resolver::enable_by_ids_wx_pay(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_wx_pay(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxPayId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_resolver::lock_by_ids_wx_pay(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原微信支付设置
  async fn revert_by_ids_wx_pay(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxPayId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_resolver::revert_by_ids_wx_pay(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除微信支付设置
  async fn force_delete_by_ids_wx_pay(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxPayId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_pay_resolver::force_delete_by_ids_wx_pay(
          ids,
          None,
        )
      }).await
  }
  
}
