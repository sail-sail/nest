use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::payslip_model::*;
use super::payslip_service;

/// 根据搜索条件和分页查找数据
pub async fn find_all(
  search: Option<PayslipSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayslipModel>> {
  
  let res = payslip_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
pub async fn find_count(
  search: Option<PayslipSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = payslip_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一条数据
pub async fn find_one(
  search: Option<PayslipSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PayslipModel>> {
  
  let model = payslip_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id(
  id: String,
  options: Option<Options>,
) -> Result<Option<PayslipModel>> {
  
  let model = payslip_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
#[allow(dead_code)]
pub async fn create(
  input: PayslipInput,
  options: Option<Options>,
) -> Result<String> {
  
  let input = payslip_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/hrm/payslip".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = payslip_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = payslip_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
#[allow(dead_code)]
pub async fn update_by_id(
  id: String,
  input: PayslipInput,
  options: Option<Options>,
) -> Result<String> {
  
  let input = payslip_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/hrm/payslip".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = payslip_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/hrm/payslip".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = payslip_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ID 查找是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = payslip_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或解锁数据
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/hrm/payslip".to_owned(),
    "lock".to_owned(),
  ).await?;
  
  let num = payslip_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<PayslipFieldComment> {
  
  let comments = payslip_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/hrm/payslip".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = payslip_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/hrm/payslip".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = payslip_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
