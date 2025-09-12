
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

use super::wxo_app_model::*;
use super::wxo_app_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxoAppGenQuery;

#[Object(rename_args = "snake_case")]
impl WxoAppGenQuery {
  
  /// 根据搜索条件和分页查找公众号设置列表
  #[graphql(name = "findAllWxoApp")]
  async fn find_all_wxo_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoAppSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxoAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_all_wxo_app(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找公众号设置总数
  #[graphql(name = "findCountWxoApp")]
  async fn find_count_wxo_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoAppSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_count_wxo_app(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个公众号设置
  #[graphql(name = "findOneWxoApp")]
  async fn find_one_wxo_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoAppSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxoAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_one_wxo_app(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个公众号设置, 如果不存在则抛错
  #[graphql(name = "findOneOkWxoApp")]
  async fn find_one_ok_wxo_app(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoAppSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxoAppModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_one_ok_wxo_app(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号设置
  #[graphql(name = "findByIdWxoApp")]
  async fn find_by_id_wxo_app(
    &self,
    ctx: &Context<'_>,
    id: WxoAppId,
  ) -> Result<Option<WxoAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_by_id_wxo_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号设置, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxoApp")]
  async fn find_by_id_ok_wxo_app(
    &self,
    ctx: &Context<'_>,
    id: WxoAppId,
  ) -> Result<WxoAppModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_by_id_ok_wxo_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号设置
  #[graphql(name = "findByIdsWxoApp")]
  async fn find_by_ids_wxo_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppId>,
  ) -> Result<Vec<WxoAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_by_ids_wxo_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号设置
  #[graphql(name = "findByIdsOkWxoApp")]
  async fn find_by_ids_ok_wxo_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppId>,
  ) -> Result<Vec<WxoAppModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_by_ids_ok_wxo_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号设置是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdWxoApp")]
  async fn get_is_enabled_by_id_wxo_app(
    &self,
    ctx: &Context<'_>,
    id: WxoAppId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::get_is_enabled_by_id_wxo_app(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号设置是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  #[graphql(name = "getIsLockedByIdWxoApp")]
  async fn get_is_locked_by_id_wxo_app(
    &self,
    ctx: &Context<'_>,
    id: WxoAppId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::get_is_locked_by_id_wxo_app(
          id,
          None,
        )
      }).await
  }
  
  /// 获取公众号设置字段注释
  #[graphql(name = "getFieldCommentsWxoApp")]
  async fn get_field_comments_wxo_app(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxoAppFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxo_app_resolver::get_field_comments_wxo_app(
          None,
        )
      }).await
  }
  
  /// 查找 公众号设置 order_by 字段的最大值
  #[graphql(name = "findLastOrderByWxoApp")]
  async fn find_last_order_by_wxo_app(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_app_resolver::find_last_order_by_wxo_app(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxoAppGenMutation;

#[Object(rename_args = "snake_case")]
impl WxoAppGenMutation {
  
  /// 创建公众号设置
  #[graphql(name = "createsWxoApp")]
  async fn creates_wxo_app(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxoAppInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxoAppId>> {
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
        wxo_app_resolver::creates_wxo_app(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 公众号设置根据id修改租户id
  #[graphql(name = "updateTenantByIdWxoApp")]
  async fn update_tenant_by_id_wxo_app(
    &self,
    ctx: &Context<'_>,
    id: WxoAppId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_resolver::update_tenant_by_id_wxo_app(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改公众号设置
  #[graphql(name = "updateByIdWxoApp")]
  async fn update_by_id_wxo_app(
    &self,
    ctx: &Context<'_>,
    id: WxoAppId,
    input: WxoAppInput,
  ) -> Result<WxoAppId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_resolver::update_by_id_wxo_app(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除公众号设置
  #[graphql(name = "deleteByIdsWxoApp")]
  async fn delete_by_ids_wxo_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_resolver::delete_by_ids_wxo_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用公众号设置
  #[graphql(name = "enableByIdsWxoApp")]
  async fn enable_by_ids_wxo_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_resolver::enable_by_ids_wxo_app(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  #[graphql(name = "lockByIdsWxoApp")]
  async fn lock_by_ids_wxo_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_resolver::lock_by_ids_wxo_app(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原公众号设置
  #[graphql(name = "revertByIdsWxoApp")]
  async fn revert_by_ids_wxo_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_resolver::revert_by_ids_wxo_app(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除公众号设置
  #[graphql(name = "forceDeleteByIdsWxoApp")]
  async fn force_delete_by_ids_wxo_app(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoAppId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_app_resolver::force_delete_by_ids_wxo_app(
          ids,
          None,
        )
      }).await
  }
  
}
