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

use super::wxw_msg_model::*;
use super::wxw_msg_resolver;

use crate::r#gen::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxwMsgGenQuery;

#[Object(rename_args = "snake_case")]
impl WxwMsgGenQuery {
  
  /// 根据搜索条件和分页查找企微消息列表
  async fn find_all_wxw_msg(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwMsgSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxwMsgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_msg_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找企微消息总数
  async fn find_count_wxw_msg(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwMsgSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_msg_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个企微消息
  async fn find_one_wxw_msg(
    &self,
    ctx: &Context<'_>,
    search: Option<WxwMsgSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxwMsgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_msg_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找企微消息
  async fn find_by_id_wxw_msg(
    &self,
    ctx: &Context<'_>,
    id: WxwMsgId,
  ) -> Result<Option<WxwMsgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_msg_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取企微消息字段注释
  async fn get_field_comments_wxw_msg(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxwMsgFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_msg_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxwMsgGenMutation;

#[Object(rename_args = "snake_case")]
impl WxwMsgGenMutation {
  
  /// 占位方法, 用于实现 WxwMsgInput
  #[allow(unused_variables)]
  async fn no_add_no_edit_wxw_msg(
    &self,
    ctx: &Context<'_>,
    input: WxwMsgInput,
  ) -> Result<WxwMsgId> {
    Err(eyre!(""))
  }
  
  /// 企微消息根据id修改租户id
  async fn update_tenant_by_id_wxw_msg(
    &self,
    ctx: &Context<'_>,
    id: WxwMsgId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        wxw_msg_resolver::update_tenant_by_id(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除企微消息
  async fn delete_by_ids_wxw_msg(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwMsgId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        wxw_msg_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原企微消息
  async fn revert_by_ids_wxw_msg(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwMsgId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        wxw_msg_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除企微消息
  async fn force_delete_by_ids_wxw_msg(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxwMsgId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        wxw_msg_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
