#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::data_permit_model::*;
use super::data_permit_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找数据权限列表
pub async fn find_all(
  search: Option<DataPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  check_sort_data_permit(sort.as_deref())?;
  
  let models = data_permit_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找数据权限总数
pub async fn find_count(
  search: Option<DataPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个数据权限
pub async fn find_one(
  search: Option<DataPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  check_sort_data_permit(sort.as_deref())?;
  
  let model = data_permit_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找数据权限
pub async fn find_by_id(
  id: DataPermitId,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let model = data_permit_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据权限
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DataPermitInput>,
  options: Option<Options>,
) -> Result<Vec<DataPermitId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = data_permit_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_data_permit(),
    "add".to_owned(),
  ).await?;
  
  let ids = data_permit_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 数据权限根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: DataPermitId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改数据权限
#[allow(dead_code)]
pub async fn update_by_id(
  id: DataPermitId,
  input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = data_permit_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_data_permit(),
    "edit".to_owned(),
  ).await?;
  
  let res = data_permit_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据权限
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_data_permit(),
    "delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取数据权限字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DataPermitFieldComment> {
  
  let comments = data_permit_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据权限
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_data_permit(),
    "delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据权限
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_data_permit(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
