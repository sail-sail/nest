<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDeptId = columns.some((column) => column.COLUMN_NAME === "dept_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
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

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::<#=table#>_model::*;
use super::<#=table#>_service;


#[derive(Default)]
pub struct <#=tableUP#>GenQuery;

#[Object(rename_args = "snake_case")]
impl <#=tableUP#>GenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<<#=tableUP#>Search>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<<#=tableUP#>Model>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = <#=table#>_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<<#=tableUP#>Search>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = <#=table#>_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<<#=tableUP#>Search>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<<#=tableUP#>Model>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = <#=table#>_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<<#=tableUP#>Model>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = <#=table#>_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }<#
  if (hasLocked) {
  #>
  
  /// 根据 ID 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  pub async fn get_is_locked_by_id_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = <#=table#>_service::get_is_locked_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }<#
  }
  #>
  
  /// 获取字段对应的名称
  pub async fn get_field_comments_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<<#=tableUP#>FieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = <#=table#>_service::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct <#=tableUP#>GenMutation;

#[Object(rename_args = "snake_case")]
impl <#=tableUP#>GenMutation {
  
  /// 创建数据
  pub async fn create_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    model: <#=tableUP#>Input,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = <#=table#>_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }<#
  if (hasTenant_id) {
  #>
  
  /// 根据id修改租户id
  pub async fn update_tenant_by_id_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::update_tenant_by_id(
      &mut ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }<#
  }
  #><#
  if (hasDeptId) {
  #>
  
  /// 根据id修改部门id
  pub async fn update_dept_by_id_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    dept_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::update_dept_by_id(
      &mut ctx,
      id,
      dept_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }<#
  }
  #>
  
  /// 根据id修改数据
  pub async fn update_by_id_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: <#=tableUP#>Input,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }<#
  if (hasLocked) {
  #>
  
  /// 根据 ids 锁定或者解锁数据
  pub async fn lock_by_ids_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_locked: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::lock_by_ids(
      &mut ctx,
      ids,
      is_locked,
      None,
    ).await;
    
    ctx.ok(res).await
  }<#
  }
  #>
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
