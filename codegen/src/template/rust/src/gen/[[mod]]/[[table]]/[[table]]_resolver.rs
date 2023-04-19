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

use super::<#=table#>_model::{<#=tableUP#>Model, <#=tableUP#>Search};
use super::<#=table#>_service;


#[derive(Default)]
pub struct <#=tableUP#>Resolver;

#[Object]
impl <#=tableUP#>Resolver {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<<#=tableUP#>Search>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<<#=tableUP#>Model>> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查找总数
  async fn find_count_<#=table#><'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<UsrSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = <#=table#>_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
