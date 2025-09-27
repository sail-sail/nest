
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

use super::wxw_usr_model::*;
use super::wxw_usr_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxwUsrGenQuery;

#[Object(rename_args = "snake_case")]
impl WxwUsrGenQuery {
  
  /// 根据搜索条件和分页查找企微用户列表
  #[graphql(name = "findAllWxwUsr")]
  async fn find_all_wxw_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwUsrSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxwUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_all_wxw_usr(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找企微用户总数
  #[graphql(name = "findCountWxwUsr")]
  async fn find_count_wxw_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwUsrSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_count_wxw_usr(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个企微用户
  #[graphql(name = "findOneWxwUsr")]
  async fn find_one_wxw_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwUsrSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxwUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_one_wxw_usr(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个企微用户, 如果不存在则抛错
  #[graphql(name = "findOneOkWxwUsr")]
  async fn find_one_ok_wxw_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwUsrSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxwUsrModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_one_ok_wxw_usr(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微用户
  #[graphql(name = "findByIdWxwUsr")]
  async fn find_by_id_wxw_usr(
    &self,
    ctx: &Context<'_>,
    id: WxwUsrId,
  ) -> Result<Option<WxwUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_by_id_wxw_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微用户, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxwUsr")]
  async fn find_by_id_ok_wxw_usr(
    &self,
    ctx: &Context<'_>,
    id: WxwUsrId,
  ) -> Result<WxwUsrModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_by_id_ok_wxw_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微用户
  #[graphql(name = "findByIdsWxwUsr")]
  async fn find_by_ids_wxw_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwUsrId>,
  ) -> Result<Vec<WxwUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_by_ids_wxw_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微用户
  #[graphql(name = "findByIdsOkWxwUsr")]
  async fn find_by_ids_ok_wxw_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwUsrId>,
  ) -> Result<Vec<WxwUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_usr_resolver::find_by_ids_ok_wxw_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取企微用户字段注释
  #[graphql(name = "getFieldCommentsWxwUsr")]
  async fn get_field_comments_wxw_usr(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxwUsrFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_usr_resolver::get_field_comments_wxw_usr(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxwUsrGenMutation;

#[Object(rename_args = "snake_case")]
impl WxwUsrGenMutation {
  
  /// 创建企微用户
  #[graphql(name = "createsWxwUsr")]
  async fn creates_wxw_usr(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxwUsrInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxwUsrId>> {
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
        wxw_usr_resolver::creates_wxw_usr(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 企微用户根据id修改租户id
  #[graphql(name = "updateTenantByIdWxwUsr")]
  async fn update_tenant_by_id_wxw_usr(
    &self,
    ctx: &Context<'_>,
    id: WxwUsrId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_usr_resolver::update_tenant_by_id_wxw_usr(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改企微用户
  #[graphql(name = "updateByIdWxwUsr")]
  async fn update_by_id_wxw_usr(
    &self,
    ctx: &Context<'_>,
    id: WxwUsrId,
    input: WxwUsrInput,
  ) -> Result<WxwUsrId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_usr_resolver::update_by_id_wxw_usr(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除企微用户
  #[graphql(name = "deleteByIdsWxwUsr")]
  async fn delete_by_ids_wxw_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_usr_resolver::delete_by_ids_wxw_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原企微用户
  #[graphql(name = "revertByIdsWxwUsr")]
  async fn revert_by_ids_wxw_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_usr_resolver::revert_by_ids_wxw_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除企微用户
  #[graphql(name = "forceDeleteByIdsWxwUsr")]
  async fn force_delete_by_ids_wxw_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_usr_resolver::force_delete_by_ids_wxw_usr(
          ids,
          None,
        )
      }).await
  }
  
}
