<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const hasDict = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
  return column.dict;
});
const hasDictbiz = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
  return column.dictbiz;
});
#>use anyhow::Result;
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

use super::<#=table#>_model::*;
use super::<#=table#>_resolver;<#
if (hasTenant_id) {
#>

use crate::gen::base::tenant::tenant_model::TenantId;<#
}
#><#
if (hasOrgId) {
#>

use crate::gen::base::org::org_model::OrgId;<#
}
#>

#[derive(Default)]
pub struct <#=tableUP#>GenQuery;

#[Object(rename_args = "snake_case")]
impl <#=tableUP#>GenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_<#=table#>(
    &self,
    ctx: &Context<'_>,
    search: Option<<#=tableUP#>Search>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<<#=tableUP#>Model>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_<#=table#>(
    &self,
    ctx: &Context<'_>,
    search: Option<<#=tableUP#>Search>,
  ) -> Result<i64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_<#=table#>(
    &self,
    ctx: &Context<'_>,
    search: Option<<#=tableUP#>Search>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<<#=tableUP#>Model>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找第一条数据
  async fn find_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<Option<<#=tableUP#>Model>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }<#
  if (hasEnabled) {
  #>
  
  /// 根据 id 查找是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }<#
  }
  #><#
  if (hasLocked) {
  #>
  
  /// 根据 id 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }<#
  }
  #>
  
  /// 获取字段对应的名称
  async fn get_field_comments_<#=table#>(
    &self,
    ctx: &Context<'_>,
  ) -> Result<<#=tableUP#>FieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        <#=table#>_resolver::get_field_comments(
          None,
        )
      }).await
  }<#
  if (hasOrderBy) {
  #>
  
  /// 查找 order_by 字段的最大值
  async fn find_last_order_by_<#=table#>(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::find_last_order_by(
          None,
        )
      }).await
  }<#
  }
  #>
  
}

#[derive(Default)]
pub struct <#=tableUP#>GenMutation;

#[Object(rename_args = "snake_case")]
impl <#=tableUP#>GenMutation {<#
    if (opts.noAdd !== true) {
  #>
  
  /// 创建数据
  async fn create_<#=table#>(
    &self,
    ctx: &Context<'_>,
    model: <#=tableUP#>Input,
    unique_type: Option<UniqueType>,
  ) -> Result<<#=Table_Up#>Id> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::create(
          model,
          options.into(),
        )
      }).await
  }<#
    }
  #><#
  if (hasTenant_id) {
  #>
  
  /// 根据id修改租户id
  async fn update_tenant_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::update_tenant_by_id(
          id,
          tenant_id,
          None,
        )
      }).await
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  
  /// 根据id修改部门id
  async fn update_org_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
    org_id: OrgId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::update_org_by_id(
          id,
          org_id,
          None,
        )
      }).await
  }<#
  }
  #><#
    if (opts.noEdit !== true) {
  #>
  
  /// 根据id修改数据
  async fn update_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
    model: <#=tableUP#>Input,
  ) -> Result<<#=Table_Up#>Id> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::update_by_id(
          id,
          model,
          None,
        )
      }).await
  }<#
    }
  #><#
    if (opts.noDelete !== true) {
  #>
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }<#
    }
  #><#
    if (hasDefault && opts.noEdit !== true) {
  #>
  
  /// 根据 id 设置默认记录
  async fn default_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::default_by_id(
          id,
          None,
        )
      }).await
  }<#
    }
  #><#
    if (hasEnabled && opts.noEdit !== true) {
  #>
  
  /// 根据 ids 启用或禁用数据
  async fn enable_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }<#
    }
  #><#
    if (hasLocked && opts.noEdit !== true) {
  #>
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }<#
    }
  #><#
    if (opts.noDelete !== true) {
  #>
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        <#=table#>_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }<#
    }
  #>
  
}
