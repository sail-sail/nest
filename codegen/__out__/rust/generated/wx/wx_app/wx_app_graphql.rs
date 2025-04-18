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

use super::wx_app_model::*;
use super::wx_app_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxAppGenQuery;

#[Object(rename_args = "snake_case")]
impl WxAppGenQuery {
  
  /// 根据搜索条件和分页查找小程序设置列表
  async fn find_all_wx_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxAppSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::find_all_wx_app(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找小程序设置总数
  async fn find_count_wx_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxAppSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::find_count_wx_app(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个小程序设置
  async fn find_one_wx_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxAppSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::find_one_wx_app(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序设置
  async fn find_by_id_wx_app(
    &self,
    ctx: &Context<'_>,
    id: WxAppId,
  ) -> Result<Option<WxAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::find_by_id_wx_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序设置
  async fn find_by_ids_wx_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxAppId>,
  ) -> Result<Vec<WxAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::find_by_ids_wx_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序设置是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_wx_app(
    &self,
    ctx: &Context<'_>,
    id: WxAppId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::get_is_enabled_by_id_wx_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序设置是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_wx_app(
    &self,
    ctx: &Context<'_>,
    id: WxAppId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::get_is_locked_by_id_wx_app(
          id,
          None,
        )
      }).await
  }
  
  /// 获取小程序设置字段注释
  async fn get_field_comments_wx_app(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxAppFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wx_app_resolver::get_field_comments_wx_app(
          None,
        )
      }).await
  }
  
  /// 查找 小程序设置 order_by 字段的最大值
  async fn find_last_order_by_wx_app(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_app_resolver::find_last_order_by_wx_app(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxAppGenMutation;

#[Object(rename_args = "snake_case")]
impl WxAppGenMutation {
  
  /// 创建小程序设置
  async fn creates_wx_app(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxAppInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxAppId>> {
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
        wx_app_resolver::creates_wx_app(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 小程序设置根据id修改租户id
  async fn update_tenant_by_id_wx_app(
    &self,
    ctx: &Context<'_>,
    id: WxAppId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_resolver::update_tenant_by_id_wx_app(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改小程序设置
  async fn update_by_id_wx_app(
    &self,
    ctx: &Context<'_>,
    id: WxAppId,
    input: WxAppInput,
  ) -> Result<WxAppId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_resolver::update_by_id_wx_app(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除小程序设置
  async fn delete_by_ids_wx_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_resolver::delete_by_ids_wx_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用小程序设置
  async fn enable_by_ids_wx_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxAppId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_resolver::enable_by_ids_wx_app(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_wx_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxAppId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_resolver::lock_by_ids_wx_app(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原小程序设置
  async fn revert_by_ids_wx_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_resolver::revert_by_ids_wx_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除小程序设置
  async fn force_delete_by_ids_wx_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_app_resolver::force_delete_by_ids_wx_app(
          ids,
          None,
        )
      }).await
  }
  
}
