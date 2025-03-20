<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
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

// 审核
const hasAudit = !!opts?.audit;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
let auditModelLabel = "";
let auditTableIdColumn = undefined;
let auditTableSchema = undefined;
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
}
// 是否有复核
const hasReviewed = opts?.hasReviewed;
const auditTableUp = auditTable.substring(0, 1).toUpperCase()+auditTable.substring(1);
const auditTable_Up = auditTableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
if (hasAudit) {
  auditTableSchema = opts?.audit?.auditTableSchema;
  auditTableIdColumn = auditTableSchema.columns.find(item => item.COLUMN_NAME === `${ table }_id`);
  if (!auditTableIdColumn) {
    throw new Error(`${ auditMod }_${ auditTable }: ${ auditTable }_id 字段不存在`);
  }
  auditModelLabel = auditTableIdColumn.modelLabel;
}

#>#[allow(unused_imports)]
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

use super::<#=table#>_model::*;
use super::<#=table#>_resolver;<#
if (auditTable) {
#>

use crate::r#gen::<#=auditMod#>::<#=auditTable#>::<#=auditTable#>_model::<#=auditTable_Up#>Input;<#
}
#><#
if (hasTenant_id) {
#>

use crate::r#gen::base::tenant::tenant_model::TenantId;<#
}
#>

#[derive(Default)]
pub struct <#=tableUP#>GenQuery;

#[Object(rename_args = "snake_case")]
impl <#=tableUP#>GenQuery {
  
  /// 根据搜索条件和分页查找<#=table_comment#>列表<#
  if (table === "i18n") {
  #>
  #[graphql(name = "findAllI18n")]<#
  }
  #>
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
  
  /// 根据条件查找<#=table_comment#>总数<#
  if (table === "i18n") {
  #>
  #[graphql(name = "findCountI18n")]<#
  }
  #>
  async fn find_count_<#=table#>(
    &self,
    ctx: &Context<'_>,
    search: Option<<#=tableUP#>Search>,
  ) -> Result<u64> {
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
  
  /// 根据条件查找第一个<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "findOneI18n")]<#
  }
  #>
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
  
  /// 根据 id 查找<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "findByIdI18n")]<#
  }
  #>
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
  }
  
  /// 根据 id 查找<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "findByIdsI18n")]<#
  }
  #>
  async fn find_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<Vec<<#=tableUP#>Model>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  /// 根据 ids 获取<#=table_comment#>是否可编辑数据权限
  async fn get_editable_data_permits_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<Vec<u8>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        <#=table#>_resolver::get_editable_data_permits_by_ids(
          ids,
          None,
        )
      }).await
  }<#
  }
  #><#
  if (hasEnabled) {
  #>
  
  /// 根据 id 查找<#=table_comment#>是否已启用
  /// 记录不存在则返回 false<#
  if (table === "i18n") {
  #>
  #[graphql(name = "getIsEnabledByIdI18n")]<#
  }
  #>
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
  
  /// 根据 id 查找<#=table_comment#>是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false<#
  if (table === "i18n") {
  #>
  #[graphql(name = "getIsLoackedByIdI18n")]<#
  }
  #>
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
  
  /// 获取<#=table_comment#>字段注释<#
  if (table === "i18n") {
  #>
  #[graphql(name = "getFieldCommentsI18n")]<#
  }
  #>
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
  
  /// 查找 <#=table_comment#> order_by 字段的最大值<#
  if (table === "i18n") {
  #>
  #[graphql(name = "findLastOrderByI18n")]<#
  }
  #>
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
    if (opts.noAdd === true && opts.noEdit === true) {
  #>
  
  /// 占位方法, 用于实现 <#=tableUP#>Input
  #[allow(unused_variables)]
  async fn no_add_no_edit_<#=table#>(
    &self,
    ctx: &Context<'_>,
    input: <#=tableUP#>Input,
  ) -> Result<<#=Table_Up#>Id> {
    Err(eyre!(""))
  }<#
    }
  #><#
    if (opts.noAdd !== true) {
  #>
  
  /// 创建<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "createsI18n")]<#
  }
  #>
  async fn creates_<#=table#>(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<<#=tableUP#>Input>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<<#=Table_Up#>Id>> {
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
        <#=table#>_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }<#
    }
  #><#
  if (hasTenant_id) {
  #>
  
  /// <#=table_comment#>根据id修改租户id<#
  if (table === "i18n") {
  #>
  #[graphql(name = "updateTenantByIdI18n")]<#
  }
  #>
  async fn update_tenant_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
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
    if (opts.noEdit !== true) {
  #>
  
  /// 根据 id 修改<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "updateByIdI18n")]<#
  }
  #>
  async fn update_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
    input: <#=tableUP#>Input,
  ) -> Result<<#=Table_Up#>Id> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        <#=table#>_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }<#
    }
  #><#
  if (hasAudit) {
  #>
  
  /// <#=table_comment#> 审核提交
  async fn audit_submit_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        <#=table#>_resolver::audit_submit(
          id,
          None,
        )
      }).await
  }
  
  /// <#=table_comment#> 审核通过
  async fn audit_pass_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        <#=table#>_resolver::audit_pass(
          id,
          None,
        )
      }).await
  }
  
  /// <#=table_comment#> 审核拒绝
  async fn audit_reject_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
    input: <#=auditTable_Up#>Input,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        <#=table#>_resolver::audit_reject(
          id,
          input,
          None,
        )
      }).await
  }<#
  if (hasReviewed) {
  #>
  
  /// <#=table_comment#> 复核通过
  async fn audit_review_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        <#=table#>_resolver::audit_review(
          id,
          None,
        )
      }).await
  }<#
  }
  #><#
  }
  #><#
    if (opts.noDelete !== true) {
  #>
  
  /// 根据 ids 删除<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "deleteByIdsI18n")]<#
  }
  #>
  async fn delete_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
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
  
  /// 根据 id 设置默认<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "defaultByIdI18n")]<#
  }
  #>
  async fn default_by_id_<#=table#>(
    &self,
    ctx: &Context<'_>,
    id: <#=Table_Up#>Id,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
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
  
  /// 根据 ids 启用或者禁用<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "enableByIdsI18n")]<#
  }
  #>
  async fn enable_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
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
  
  /// 根据 ids 锁定或解锁数据<#
  if (table === "i18n") {
  #>
  #[graphql(name = "lockByIdsI18n")]<#
  }
  #>
  async fn lock_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
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
  #><#
  if (hasIsDeleted) {
  #>
  
  /// 根据 ids 还原<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "revertByIdsI18n")]<#
  }
  #>
  async fn revert_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        <#=table#>_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }<#
  }
  #><#
  if (hasIsDeleted) {
  #>
  
  /// 根据 ids 彻底删除<#=table_comment#><#
  if (table === "i18n") {
  #>
  #[graphql(name = "forceDeleteByIdsI18n")]<#
  }
  #>
  async fn force_delete_by_ids_<#=table#>(
    &self,
    ctx: &Context<'_>,
    ids: Vec<<#=Table_Up#>Id>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        <#=table#>_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }<#
  }
  #><#
  }
  #>
  
}
