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

use super::role_model::*;
use super::role_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct RoleGenQuery;

#[Object(rename_args = "snake_case")]
impl RoleGenQuery {
  
  /// 根据搜索条件和分页查找角色列表
  async fn find_all_role(
    &self,
    ctx: &Context<'_>,
    search: Option<RoleSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<RoleModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_all_role(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找角色总数
  async fn find_count_role(
    &self,
    ctx: &Context<'_>,
    search: Option<RoleSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_count_role(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个角色
  async fn find_one_role(
    &self,
    ctx: &Context<'_>,
    search: Option<RoleSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<RoleModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_one_role(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个角色, 如果不存在则抛错
  async fn find_one_ok_role(
    &self,
    ctx: &Context<'_>,
    search: Option<RoleSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<RoleModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_one_ok_role(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找角色
  async fn find_by_id_role(
    &self,
    ctx: &Context<'_>,
    id: RoleId,
  ) -> Result<Option<RoleModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_by_id_role(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找角色, 如果不存在则抛错
  async fn find_by_id_ok_role(
    &self,
    ctx: &Context<'_>,
    id: RoleId,
  ) -> Result<RoleModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_by_id_ok_role(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找角色
  async fn find_by_ids_role(
    &self,
    ctx: &Context<'_>,
    ids: Vec<RoleId>,
  ) -> Result<Vec<RoleModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_by_ids_role(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找角色
  async fn find_by_ids_ok_role(
    &self,
    ctx: &Context<'_>,
    ids: Vec<RoleId>,
  ) -> Result<Vec<RoleModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_by_ids_ok_role(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找角色是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_role(
    &self,
    ctx: &Context<'_>,
    id: RoleId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::get_is_enabled_by_id_role(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找角色是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_role(
    &self,
    ctx: &Context<'_>,
    id: RoleId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::get_is_locked_by_id_role(
          id,
          None,
        )
      }).await
  }
  
  /// 获取角色字段注释
  async fn get_field_comments_role(
    &self,
    ctx: &Context<'_>,
  ) -> Result<RoleFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        role_resolver::get_field_comments_role(
          None,
        )
      }).await
  }
  
  /// 查找 角色 order_by 字段的最大值
  async fn find_last_order_by_role(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::find_last_order_by_role(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct RoleGenMutation;

#[Object(rename_args = "snake_case")]
impl RoleGenMutation {
  
  /// 创建角色
  async fn creates_role(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<RoleInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<RoleId>> {
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
        role_resolver::creates_role(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 角色根据id修改租户id
  async fn update_tenant_by_id_role(
    &self,
    ctx: &Context<'_>,
    id: RoleId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        role_resolver::update_tenant_by_id_role(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改角色
  async fn update_by_id_role(
    &self,
    ctx: &Context<'_>,
    id: RoleId,
    input: RoleInput,
  ) -> Result<RoleId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        role_resolver::update_by_id_role(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除角色
  async fn delete_by_ids_role(
    &self,
    ctx: &Context<'_>,
    ids: Vec<RoleId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        role_resolver::delete_by_ids_role(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用角色
  async fn enable_by_ids_role(
    &self,
    ctx: &Context<'_>,
    ids: Vec<RoleId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        role_resolver::enable_by_ids_role(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_role(
    &self,
    ctx: &Context<'_>,
    ids: Vec<RoleId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        role_resolver::lock_by_ids_role(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原角色
  async fn revert_by_ids_role(
    &self,
    ctx: &Context<'_>,
    ids: Vec<RoleId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        role_resolver::revert_by_ids_role(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除角色
  async fn force_delete_by_ids_role(
    &self,
    ctx: &Context<'_>,
    ids: Vec<RoleId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        role_resolver::force_delete_by_ids_role(
          ids,
          None,
        )
      }).await
  }
  
}
