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

use super::usr_model::*;
use super::usr_resolver;

use crate::r#gen::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct UsrGenQuery;

#[Object(rename_args = "snake_case")]
impl UsrGenQuery {
  
  /// 根据搜索条件和分页查找用户列表
  async fn find_all_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<UsrSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<UsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::find_all_usr(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找用户总数
  async fn find_count_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<UsrSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::find_count_usr(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个用户
  async fn find_one_usr(
    &self,
    ctx: &Context<'_>,
    search: Option<UsrSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<UsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::find_one_usr(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找用户
  async fn find_by_id_usr(
    &self,
    ctx: &Context<'_>,
    id: UsrId,
  ) -> Result<Option<UsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::find_by_id_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找用户
  async fn find_by_ids_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<UsrId>,
  ) -> Result<Vec<UsrModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::find_by_ids_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找用户是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_usr(
    &self,
    ctx: &Context<'_>,
    id: UsrId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::get_is_enabled_by_id_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找用户是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_usr(
    &self,
    ctx: &Context<'_>,
    id: UsrId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::get_is_locked_by_id_usr(
          id,
          None,
        )
      }).await
  }
  
  /// 获取用户字段注释
  async fn get_field_comments_usr(
    &self,
    ctx: &Context<'_>,
  ) -> Result<UsrFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        usr_resolver::get_field_comments_usr(
          None,
        )
      }).await
  }
  
  /// 查找 用户 order_by 字段的最大值
  async fn find_last_order_by_usr(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::find_last_order_by_usr(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct UsrGenMutation;

#[Object(rename_args = "snake_case")]
impl UsrGenMutation {
  
  /// 创建用户
  async fn creates_usr(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<UsrInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<UsrId>> {
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
        usr_resolver::creates_usr(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 用户根据id修改租户id
  async fn update_tenant_by_id_usr(
    &self,
    ctx: &Context<'_>,
    id: UsrId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::update_tenant_by_id_usr(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改用户
  async fn update_by_id_usr(
    &self,
    ctx: &Context<'_>,
    id: UsrId,
    input: UsrInput,
  ) -> Result<UsrId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::update_by_id_usr(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除用户
  async fn delete_by_ids_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<UsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::delete_by_ids_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用用户
  async fn enable_by_ids_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<UsrId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::enable_by_ids_usr(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<UsrId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::lock_by_ids_usr(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原用户
  async fn revert_by_ids_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<UsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::revert_by_ids_usr(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除用户
  async fn force_delete_by_ids_usr(
    &self,
    ctx: &Context<'_>,
    ids: Vec<UsrId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::force_delete_by_ids_usr(
          ids,
          None,
        )
      }).await
  }
  
}
