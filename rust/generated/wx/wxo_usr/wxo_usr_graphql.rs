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

use super::wxo_usr_model::*;
use super::wxo_usr_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxoUsrGenQuery;

#[Object(rename_args = "snake_case")]
impl WxoUsrGenQuery {
  
  /// 根据搜索条件和分页查找公众号用户列表
  async fn find_all_wxo_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoUsrSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxoUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_usr_resolver::find_all_wxo_usr(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找公众号用户总数
  async fn find_count_wxo_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoUsrSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_usr_resolver::find_count_wxo_usr(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个公众号用户
  async fn find_one_wxo_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<WxoUsrSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxoUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_usr_resolver::find_one_wxo_usr(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号用户
  async fn find_by_id_wxo_usr(
    &self,
    ctx: &Context<'_>,
    id: WxoUsrId,
  ) -> Result<Option<WxoUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_usr_resolver::find_by_id_wxo_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找公众号用户
  async fn find_by_ids_wxo_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoUsrId>,
  ) -> Result<Vec<WxoUsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxo_usr_resolver::find_by_ids_wxo_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取公众号用户字段注释
  async fn get_field_comments_wxo_usr(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxoUsrFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxo_usr_resolver::get_field_comments_wxo_usr(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxoUsrGenMutation;

#[Object(rename_args = "snake_case")]
impl WxoUsrGenMutation {
  
  /// 创建公众号用户
  async fn creates_wxo_usr(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<WxoUsrInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxoUsrId>> {
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
        wxo_usr_resolver::creates_wxo_usr(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 公众号用户根据id修改租户id
  async fn update_tenant_by_id_wxo_usr(
    &self,
    ctx: &Context<'_>,
    id: WxoUsrId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_usr_resolver::update_tenant_by_id_wxo_usr(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改公众号用户
  async fn update_by_id_wxo_usr(
    &self,
    ctx: &Context<'_>,
    id: WxoUsrId,
    input: WxoUsrInput,
  ) -> Result<WxoUsrId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_usr_resolver::update_by_id_wxo_usr(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除公众号用户
  async fn delete_by_ids_wxo_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_usr_resolver::delete_by_ids_wxo_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原公众号用户
  async fn revert_by_ids_wxo_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_usr_resolver::revert_by_ids_wxo_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除公众号用户
  async fn force_delete_by_ids_wxo_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<WxoUsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxo_usr_resolver::force_delete_by_ids_wxo_usr(
          ids,
          None,
        )
      }).await
  }
  
}
