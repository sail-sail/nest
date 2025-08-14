
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

use super::org_model::*;
use super::org_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct OrgGenQuery;

#[Object(rename_args = "snake_case")]
impl OrgGenQuery {
  
  /// 根据搜索条件和分页查找组织列表
  async fn find_all_org(
    &self,
    ctx: &Context<'_>,
    search: Option<OrgSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_all_org(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找组织总数
  async fn find_count_org(
    &self,
    ctx: &Context<'_>,
    search: Option<OrgSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_count_org(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个组织
  async fn find_one_org(
    &self,
    ctx: &Context<'_>,
    search: Option<OrgSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_one_org(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个组织, 如果不存在则抛错
  async fn find_one_ok_org(
    &self,
    ctx: &Context<'_>,
    search: Option<OrgSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<OrgModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_one_ok_org(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组织
  async fn find_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: OrgId,
  ) -> Result<Option<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_by_id_org(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组织, 如果不存在则抛错
  async fn find_by_id_ok_org(
    &self,
    ctx: &Context<'_>,
    id: OrgId,
  ) -> Result<OrgModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_by_id_ok_org(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组织
  async fn find_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OrgId>,
  ) -> Result<Vec<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_by_ids_org(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组织
  async fn find_by_ids_ok_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OrgId>,
  ) -> Result<Vec<OrgModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_by_ids_ok_org(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组织是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: OrgId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::get_is_enabled_by_id_org(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找组织是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: OrgId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::get_is_locked_by_id_org(
          id,
          None,
        )
      }).await
  }
  
  /// 获取组织字段注释
  async fn get_field_comments_org(
    &self,
    ctx: &Context<'_>,
  ) -> Result<OrgFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        org_resolver::get_field_comments_org(
          None,
        )
      }).await
  }
  
  /// 查找 组织 order_by 字段的最大值
  async fn find_last_order_by_org(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        org_resolver::find_last_order_by_org(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct OrgGenMutation;

#[Object(rename_args = "snake_case")]
impl OrgGenMutation {
  
  /// 创建组织
  async fn creates_org(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<OrgInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<OrgId>> {
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
        org_resolver::creates_org(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 组织根据id修改租户id
  async fn update_tenant_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: OrgId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        org_resolver::update_tenant_by_id_org(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改组织
  async fn update_by_id_org(
    &self,
    ctx: &Context<'_>,
    id: OrgId,
    input: OrgInput,
  ) -> Result<OrgId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        org_resolver::update_by_id_org(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除组织
  async fn delete_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OrgId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        org_resolver::delete_by_ids_org(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用组织
  async fn enable_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OrgId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        org_resolver::enable_by_ids_org(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OrgId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        org_resolver::lock_by_ids_org(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原组织
  async fn revert_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OrgId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        org_resolver::revert_by_ids_org(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除组织
  async fn force_delete_by_ids_org(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OrgId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        org_resolver::force_delete_by_ids_org(
          ids,
          None,
        )
      }).await
  }
  
}
