<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
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
#>use tracing::instrument;
use anyhow::Result;

use crate::common::context::{
  Ctx,
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};<#
if (table !== "i18n") {
#>

use crate::src::base::i18n::i18n_dao;<#
}
#>

use super::<#=table#>_model::*;
use super::<#=table#>_dao;

/// 根据搜索条件和分页查找数据
#[instrument(skip(ctx))]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let res = <#=table#>_dao::find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
#[instrument(skip(ctx))]
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = <#=table#>_dao::find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
#[instrument(skip(ctx))]
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let model = <#=table#>_dao::find_one(
    ctx,
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据ID查找第一条数据
#[instrument(skip(ctx))]
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let model = <#=table#>_dao::find_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<String> {
  
  let id = <#=table#>_dao::create(
    ctx,
    input,
    options,
  ).await?;
  
  Ok(id)
}<#
if (hasTenant_id) {
#>

/// 根据id修改租户id
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::update_tenant_by_id(
    ctx,
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasDeptId) {
#>

/// 根据id修改部门id
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn update_dept_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  dept_id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::update_dept_by_id(
    ctx,
    id,
    dept_id,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#>

/// 根据id修改数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<String> {<#
  if (hasLocked) {
  #>
  
  let is_locked = <#=table#>_dao::get_is_locked_by_id(
    ctx,
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = i18n_dao::ns(ctx, "不能修改已经锁定的数据".to_owned(), None).await?;
    return Err(SrvErr::msg(err_msg).into());
  }<#
  }
  #>
  
  let res = <#=table#>_dao::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasLocked) {
  #>
  
  let ids0 = ids.clone();
  let mut ids: Vec<String> = vec![];
  for id in ids0 {
    let model = <#=table#>_dao::find_by_id(
      ctx,
      id.clone(),
      None,
    ).await?;
    
    if model.is_none() {
      continue;
    }
    
    let is_locked = <#=table#>_dao::get_is_locked_by_id(
      ctx,
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  let ids = ids;<#
  }
  #>
  
  let num = <#=table#>_dao::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}<#
if (hasDefault) {
#>

/// 根据 id 设置默认记录
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn default_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::default_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasEnabled) {
#>

/// 根据 ID 查找是否已启用
/// 记录不存在则返回 false
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn get_is_enabled_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = <#=table#>_dao::get_is_enabled_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn enable_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::enable_by_ids(
    ctx,
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasLocked) {
#>

/// 根据 ID 查找是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn get_is_locked_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = <#=table#>_dao::get_is_locked_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn lock_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::lock_by_ids(
    ctx,
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#>

/// 获取字段对应的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {
  
  let comments = <#=table#>_dao::get_field_comments(
    ctx,
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::force_delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}<#
if (hasOrderBy) {
#>

/// 查找 order_by 字段的最大值
#[instrument(skip(ctx))]
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<u32> {
  
  let res = <#=table#>_dao::find_last_order_by(
    ctx,
    options,
  ).await?;
  
  Ok(res)
}<#
}
#>
