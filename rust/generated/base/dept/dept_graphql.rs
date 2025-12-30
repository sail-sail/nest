
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

use super::dept_model::*;
use super::dept_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct DeptGenQuery;

#[Object(rename_args = "snake_case")]
impl DeptGenQuery {
  
  /// 根据搜索条件和分页查找部门列表
  #[graphql(name = "findAllDept")]
  async fn find_all_dept(
    &self,
    ctx: &Context<'_>,
    search: Option<DeptSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DeptModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_all_dept(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找部门总数
  #[graphql(name = "findCountDept")]
  async fn find_count_dept(
    &self,
    ctx: &Context<'_>,
    search: Option<DeptSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_count_dept(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个部门
  #[graphql(name = "findOneDept")]
  async fn find_one_dept(
    &self,
    ctx: &Context<'_>,
    search: Option<DeptSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DeptModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_one_dept(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个部门, 如果不存在则抛错
  #[graphql(name = "findOneOkDept")]
  async fn find_one_ok_dept(
    &self,
    ctx: &Context<'_>,
    search: Option<DeptSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<DeptModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_one_ok_dept(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找部门
  #[graphql(name = "findByIdDept")]
  async fn find_by_id_dept(
    &self,
    ctx: &Context<'_>,
    id: DeptId,
  ) -> Result<Option<DeptModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_by_id_dept(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找部门, 如果不存在则抛错
  #[graphql(name = "findByIdOkDept")]
  async fn find_by_id_ok_dept(
    &self,
    ctx: &Context<'_>,
    id: DeptId,
  ) -> Result<DeptModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_by_id_ok_dept(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找部门
  #[graphql(name = "findByIdsDept")]
  async fn find_by_ids_dept(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DeptId>,
  ) -> Result<Vec<DeptModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_by_ids_dept(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找部门
  #[graphql(name = "findByIdsOkDept")]
  async fn find_by_ids_ok_dept(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DeptId>,
  ) -> Result<Vec<DeptModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_by_ids_ok_dept(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找部门是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdDept")]
  async fn get_is_enabled_by_id_dept(
    &self,
    ctx: &Context<'_>,
    id: DeptId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::get_is_enabled_by_id_dept(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找部门是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  #[graphql(name = "getIsLockedByIdDept")]
  async fn get_is_locked_by_id_dept(
    &self,
    ctx: &Context<'_>,
    id: DeptId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::get_is_locked_by_id_dept(
          id,
          None,
        )
      }).await
  }
  
  /// 获取部门字段注释
  #[graphql(name = "getFieldCommentsDept")]
  async fn get_field_comments_dept(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DeptFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dept_resolver::get_field_comments_dept(
          None,
        )
      }).await
  }
  
  /// 查找 部门 order_by 字段的最大值
  #[graphql(name = "findLastOrderByDept")]
  async fn find_last_order_by_dept(
    &self,
    ctx: &Context<'_>,
    search: Option<DeptSearch>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dept_resolver::find_last_order_by_dept(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DeptGenMutation;

#[Object(rename_args = "snake_case")]
impl DeptGenMutation {
  
  /// 创建部门
  #[graphql(name = "createsDept")]
  async fn creates_dept(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DeptInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DeptId>> {
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
        dept_resolver::creates_dept(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 部门根据id修改租户id
  #[graphql(name = "updateTenantByIdDept")]
  async fn update_tenant_by_id_dept(
    &self,
    ctx: &Context<'_>,
    id: DeptId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dept_resolver::update_tenant_by_id_dept(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改部门
  #[graphql(name = "updateByIdDept")]
  async fn update_by_id_dept(
    &self,
    ctx: &Context<'_>,
    id: DeptId,
    input: DeptInput,
  ) -> Result<DeptId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dept_resolver::update_by_id_dept(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除部门
  #[graphql(name = "deleteByIdsDept")]
  async fn delete_by_ids_dept(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DeptId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dept_resolver::delete_by_ids_dept(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用部门
  #[graphql(name = "enableByIdsDept")]
  async fn enable_by_ids_dept(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DeptId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dept_resolver::enable_by_ids_dept(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  #[graphql(name = "lockByIdsDept")]
  async fn lock_by_ids_dept(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DeptId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dept_resolver::lock_by_ids_dept(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原部门
  #[graphql(name = "revertByIdsDept")]
  async fn revert_by_ids_dept(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DeptId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dept_resolver::revert_by_ids_dept(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除部门
  #[graphql(name = "forceDeleteByIdsDept")]
  async fn force_delete_by_ids_dept(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DeptId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dept_resolver::force_delete_by_ids_dept(
          ids,
          None,
        )
      }).await
  }
  
}
