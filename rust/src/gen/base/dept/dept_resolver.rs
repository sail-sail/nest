use tracing::instrument;
use anyhow::Result;

use crate::common::context::{Ctx, Options};
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::dept_model::*;
use super::dept_service;

use crate::src::base::i18n::i18n_service::ns;
use crate::src::base::operation_record::operation_record_service::log;
use crate::gen::base::operation_record::operation_record_model::OperationRecordInput;

/// 根据搜索条件和分页查找数据
#[instrument(skip(ctx))]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<DeptSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DeptModel>> {
  
  let res = dept_service::find_all(
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
  search: Option<DeptSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = dept_service::find_count(
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
  search: Option<DeptSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DeptModel>> {
  
  let model = dept_service::find_one(
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
) -> Result<Option<DeptModel>> {
  
  let model = dept_service::find_by_id(
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
  input: DeptInput,
  options: Option<Options>,
) -> Result<String> {
  
  use_permit(
    ctx,
    "/base/dept".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = dept_service::create(
    ctx,
    input,
    options,
  ).await?;
  
  let new_data = dept_service::find_by_id(
    ctx,
    id.clone(),
    None,
  ).await?;
  
  let method_lbl = ns(ctx, "新增".to_owned(), None).await?;
  let table_comment = ns(ctx, "部门".to_owned(), None).await?;
  
  log(
    ctx,
    OperationRecordInput {
      module: "base_dept".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "create".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: "{}".to_owned().into(),
      new_data: serde_json::to_string(&new_data)?.into(),
      ..Default::default()
    },
  ).await?;
  
  Ok(id)
}

/// 根据id修改租户id
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dept_service::update_tenant_by_id(
    ctx,
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  input: DeptInput,
  options: Option<Options>,
) -> Result<String> {
  
  use_permit(
    ctx,
    "/base/dept".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let old_data = dept_service::find_by_id(
    ctx,
    id.clone(),
    None,
  ).await?;
  
  let res = dept_service::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  let new_data = dept_service::find_by_id(
    ctx,
    res.clone(),
    None,
  ).await?;
  
  let method_lbl = ns(ctx, "修改".to_owned(), None).await?;
  let table_comment = ns(ctx, "部门".to_owned(), None).await?;
  
  log(
    ctx,
    OperationRecordInput {
      module: "base_dept".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "update".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: serde_json::to_string(&old_data)?.into(),
      new_data: serde_json::to_string(&new_data)?.into(),
      ..Default::default()
    },
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
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/base/dept".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let old_data = dept_service::find_all(
    ctx,
    DeptSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  let num = dept_service::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  let method_lbl = ns(ctx, "删除".to_owned(), None).await?;
  let table_comment = ns(ctx, "部门".to_owned(), None).await?;
  
  log(
    ctx,
    OperationRecordInput {
      module: "base_dept".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "delete".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: serde_json::to_string(&old_data)?.into(),
      new_data: "[]".to_owned().into(),
      ..Default::default()
    },
  ).await?;
  
  Ok(num)
}

/// 根据 ID 查找是否已启用
/// 记录不存在则返回 false
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn get_is_enabled_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dept_service::get_is_enabled_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或禁用数据
#[allow(dead_code)]
pub async fn enable_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/base/dept".to_owned(),
    "enable".to_owned(),
  ).await?;
  
  let old_data = serde_json::to_string(&ids)?;
  
  let num = dept_service::enable_by_ids(
    ctx,
    ids,
    is_enabled,
    options,
  ).await?;
  
  let method_lbl = ns(ctx, "启用".to_owned(), None).await?;
  let table_comment = ns(ctx, "部门".to_owned(), None).await?;
  
  log(
    ctx,
    OperationRecordInput {
      module: "base_dept".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "enable".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: old_data.into(),
      new_data: "[]".to_owned().into(),
      ..Default::default()
    },
  ).await?;
  
  Ok(num)
}

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
  
  let is_locked = dept_service::get_is_locked_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或解锁数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn lock_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/base/dept".to_owned(),
    "lock".to_owned(),
  ).await?;
  
  let new_data = serde_json::json!({
    "ids": ids,
    "is_locked": is_locked,
  }).to_string();
  
  let num = dept_service::lock_by_ids(
    ctx,
    ids,
    is_locked,
    options,
  ).await?;
  
  let method_lbl: String = if is_locked == 0 {
    ns(ctx, "解锁".to_owned(), None).await?
  } else {
    ns(ctx, "锁定".to_owned(), None).await?
  };
  let table_comment = ns(ctx, "部门".to_owned(), None).await?;
  
  log(
    ctx,
    OperationRecordInput {
      module: "base_dept".to_owned().into(),
      module_lbl: table_comment.into(),
      method: "lockByIds".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: "".to_owned().into(),
      new_data: new_data.into(),
      ..Default::default()
    },
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<DeptFieldComment> {
  
  let comments = dept_service::get_field_comments(
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
  
  use_permit(
    ctx,
    "/base/dept".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let new_data = serde_json::to_string(&ids)?;
  
  let num = dept_service::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  let method_lbl = ns(ctx, "还原".to_owned(), None).await?;
  let table_comment = ns(ctx, "部门".to_owned(), None).await?;
  
  log(
    ctx,
    OperationRecordInput {
      module: "base_dept".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "revertByIds".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: "[]".to_owned().into(),
      new_data: new_data.into(),
      ..Default::default()
    },
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
  
  use_permit(
    ctx,
    "/base/dept".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let old_data = serde_json::to_string(&ids)?;
  
  let num = dept_service::force_delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  let method_lbl = ns(ctx, "彻底删除".to_owned(), None).await?;
  let table_comment = ns(ctx, "部门".to_owned(), None).await?;
  
  log(
    ctx,
    OperationRecordInput {
      module: "base_dept".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "force_delete".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: old_data.into(),
      new_data: "[]".to_owned().into(),
      ..Default::default()
    },
  ).await?;
  
  Ok(num)
}

/// 查找 order_by 字段的最大值
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dept_service::find_last_order_by(
    ctx,
    options,
  ).await?;
  
  Ok(res)
}
