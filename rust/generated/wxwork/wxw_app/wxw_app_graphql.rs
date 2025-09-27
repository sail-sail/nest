
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

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::wxw_app_model::*;
use super::wxw_app_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxwAppGenQuery;

#[Object(rename_args = "snake_case")]
impl WxwAppGenQuery {
  
  /// 根据搜索条件和分页查找企微应用列表
  #[graphql(name = "findAllWxwApp")]
  async fn find_all_wxw_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwAppSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxwAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_all_wxw_app(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找企微应用总数
  #[graphql(name = "findCountWxwApp")]
  async fn find_count_wxw_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwAppSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_count_wxw_app(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个企微应用
  #[graphql(name = "findOneWxwApp")]
  async fn find_one_wxw_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwAppSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxwAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_one_wxw_app(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个企微应用, 如果不存在则抛错
  #[graphql(name = "findOneOkWxwApp")]
  async fn find_one_ok_wxw_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwAppSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxwAppModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_one_ok_wxw_app(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用
  #[graphql(name = "findByIdWxwApp")]
  async fn find_by_id_wxw_app(
    &self,
    ctx: &Context<'_>,
    id: WxwAppId,
  ) -> Result<Option<WxwAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_by_id_wxw_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxwApp")]
  async fn find_by_id_ok_wxw_app(
    &self,
    ctx: &Context<'_>,
    id: WxwAppId,
  ) -> Result<WxwAppModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_by_id_ok_wxw_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用
  #[graphql(name = "findByIdsWxwApp")]
  async fn find_by_ids_wxw_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppId>,
  ) -> Result<Vec<WxwAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_by_ids_wxw_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用
  #[graphql(name = "findByIdsOkWxwApp")]
  async fn find_by_ids_ok_wxw_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppId>,
  ) -> Result<Vec<WxwAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_by_ids_ok_wxw_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdWxwApp")]
  async fn get_is_enabled_by_id_wxw_app(
    &self,
    ctx: &Context<'_>,
    id: WxwAppId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::get_is_enabled_by_id_wxw_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微应用是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  #[graphql(name = "getIsLockedByIdWxwApp")]
  async fn get_is_locked_by_id_wxw_app(
    &self,
    ctx: &Context<'_>,
    id: WxwAppId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::get_is_locked_by_id_wxw_app(
          id,
          None,
        )
      }).await
  }
  
  /// 获取企微应用字段注释
  #[graphql(name = "getFieldCommentsWxwApp")]
  async fn get_field_comments_wxw_app(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxwAppFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_app_resolver::get_field_comments_wxw_app(
          None,
        )
      }).await
  }
  
  /// 查找 企微应用 order_by 字段的最大值
  #[graphql(name = "findLastOrderByWxwApp")]
  async fn find_last_order_by_wxw_app(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_app_resolver::find_last_order_by_wxw_app(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxwAppGenMutation;

#[Object(rename_args = "snake_case")]
impl WxwAppGenMutation {
  
  /// 创建企微应用
  #[graphql(name = "createsWxwApp")]
  async fn creates_wxw_app(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxwAppInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxwAppId>> {
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
        wxw_app_resolver::creates_wxw_app(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 企微应用根据id修改租户id
  #[graphql(name = "updateTenantByIdWxwApp")]
  async fn update_tenant_by_id_wxw_app(
    &self,
    ctx: &Context<'_>,
    id: WxwAppId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_resolver::update_tenant_by_id_wxw_app(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改企微应用
  #[graphql(name = "updateByIdWxwApp")]
  async fn update_by_id_wxw_app(
    &self,
    ctx: &Context<'_>,
    id: WxwAppId,
    input: WxwAppInput,
  ) -> Result<WxwAppId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_resolver::update_by_id_wxw_app(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除企微应用
  #[graphql(name = "deleteByIdsWxwApp")]
  async fn delete_by_ids_wxw_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_resolver::delete_by_ids_wxw_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用企微应用
  #[graphql(name = "enableByIdsWxwApp")]
  async fn enable_by_ids_wxw_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_resolver::enable_by_ids_wxw_app(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  #[graphql(name = "lockByIdsWxwApp")]
  async fn lock_by_ids_wxw_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_resolver::lock_by_ids_wxw_app(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原企微应用
  #[graphql(name = "revertByIdsWxwApp")]
  async fn revert_by_ids_wxw_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_resolver::revert_by_ids_wxw_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除企微应用
  #[graphql(name = "forceDeleteByIdsWxwApp")]
  async fn force_delete_by_ids_wxw_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_app_resolver::force_delete_by_ids_wxw_app(
          ids,
          None,
        )
      }).await
  }
  
}
