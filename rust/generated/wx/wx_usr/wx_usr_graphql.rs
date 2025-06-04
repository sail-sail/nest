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

use super::wx_usr_model::*;
use super::wx_usr_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxUsrGenQuery;

#[Object(rename_args = "snake_case")]
impl WxUsrGenQuery {
  
  /// 根据搜索条件和分页查找小程序用户列表
  async fn find_all_wx_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxUsrSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_all_wx_usr(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找小程序用户总数
  async fn find_count_wx_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxUsrSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_count_wx_usr(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个小程序用户
  async fn find_one_wx_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxUsrSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_one_wx_usr(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个小程序用户, 如果不存在则抛错
  async fn find_one_ok_wx_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxUsrSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxUsrModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_one_ok_wx_usr(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序用户
  async fn find_by_id_wx_usr(
    &self,
    ctx: &Context<'_>,
    id: WxUsrId,
  ) -> Result<Option<WxUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_by_id_wx_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序用户, 如果不存在则抛错
  async fn find_by_id_ok_wx_usr(
    &self,
    ctx: &Context<'_>,
    id: WxUsrId,
  ) -> Result<WxUsrModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_by_id_ok_wx_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序用户
  async fn find_by_ids_wx_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxUsrId>,
  ) -> Result<Vec<WxUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_by_ids_wx_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找小程序用户
  async fn find_by_ids_ok_wx_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxUsrId>,
  ) -> Result<Vec<WxUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_usr_resolver::find_by_ids_ok_wx_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取小程序用户字段注释
  async fn get_field_comments_wx_usr(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxUsrFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wx_usr_resolver::get_field_comments_wx_usr(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxUsrGenMutation;

#[Object(rename_args = "snake_case")]
impl WxUsrGenMutation {
  
  /// 创建小程序用户
  async fn creates_wx_usr(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxUsrInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxUsrId>> {
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
        wx_usr_resolver::creates_wx_usr(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 小程序用户根据id修改租户id
  async fn update_tenant_by_id_wx_usr(
    &self,
    ctx: &Context<'_>,
    id: WxUsrId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_usr_resolver::update_tenant_by_id_wx_usr(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改小程序用户
  async fn update_by_id_wx_usr(
    &self,
    ctx: &Context<'_>,
    id: WxUsrId,
    input: WxUsrInput,
  ) -> Result<WxUsrId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_usr_resolver::update_by_id_wx_usr(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除小程序用户
  async fn delete_by_ids_wx_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_usr_resolver::delete_by_ids_wx_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原小程序用户
  async fn revert_by_ids_wx_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_usr_resolver::revert_by_ids_wx_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除小程序用户
  async fn force_delete_by_ids_wx_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wx_usr_resolver::force_delete_by_ids_wx_usr(
          ids,
          None,
        )
      }).await
  }
  
}
