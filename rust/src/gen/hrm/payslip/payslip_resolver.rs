use anyhow::Result;

use crate::common::context::{Ctx, Options};
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::payslip_model::*;
use super::payslip_service;

use chrono::Datelike;

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<PayslipSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayslipModel>> {
  
  let res = payslip_service::find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<PayslipSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = payslip_service::find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<PayslipSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PayslipModel>> {
  
  let model = payslip_service::find_one(
    ctx,
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<PayslipModel>> {
  
  let model = payslip_service::find_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
#[allow(dead_code)]
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  input: PayslipInput,
  options: Option<Options>,
) -> Result<String> {
  
  use_permit(
    ctx,
    "/hrm/payslip".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let mut input = input;
  // 发放月份
  if let Some(pay_month) = input.pay_month {
    input.pay_month = pay_month.with_day(1);
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    input.is_locked = None;
  }
  let input = input;
  
  let id = payslip_service::create(
    ctx,
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = payslip_service::update_tenant_by_id(
    ctx,
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
#[allow(dead_code)]
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  input: PayslipInput,
  options: Option<Options>,
) -> Result<String> {
  
  use_permit(
    ctx,
    "/hrm/payslip".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let mut input = input;
  // 发放月份
  if let Some(pay_month) = input.pay_month {
    input.pay_month = pay_month.with_day(1);
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    input.is_locked = None;
  }
  let input = input;
  
  let res = payslip_service::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据
#[allow(dead_code)]
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/hrm/payslip".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = payslip_service::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ID 查找是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = payslip_service::get_is_locked_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或解锁数据
#[allow(dead_code)]
pub async fn lock_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/hrm/payslip".to_owned(),
    "lock".to_owned(),
  ).await?;
  
  let num = payslip_service::lock_by_ids(
    ctx,
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<PayslipFieldComment> {
  
  let comments = payslip_service::get_field_comments(
    ctx,
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
#[allow(dead_code)]
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/hrm/payslip".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = payslip_service::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
#[allow(dead_code)]
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    ctx,
    "/hrm/payslip".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = payslip_service::force_delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}
