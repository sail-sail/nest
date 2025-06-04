#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::usr_model::*;
use super::usr_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找用户列表
#[function_name::named]
pub async fn find_all_usr(
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  check_sort_usr(sort.as_deref())?;
  
  let models = usr_service::find_all_usr(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let mut models = models;
  for model in &mut models {
    // 密码
    model.password = String::new();
  }
  let models = models;
  
  Ok(models)
}

/// 根据条件查找用户总数
#[function_name::named]
pub async fn find_count_usr(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  let num = usr_service::find_count_usr(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个用户
#[function_name::named]
pub async fn find_one_usr(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  check_sort_usr(sort.as_deref())?;
  
  let model = usr_service::find_one_usr(
    search,
    sort,
    options,
  ).await?;
  
  let mut model = model;
  if let Some(model) = &mut model {
    // 密码
    model.password = String::new();
  }
  let model = model;
  
  Ok(model)
}

/// 根据条件查找第一个用户, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_usr(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<UsrModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  check_sort_usr(sort.as_deref())?;
  
  let model = usr_service::find_one_ok_usr(
    search,
    sort,
    options,
  ).await?;
  
  let mut model = model;
  // 密码
  model.password = String::new();
  let model = model;
  
  Ok(model)
}

/// 根据 id 查找用户
#[function_name::named]
pub async fn find_by_id_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = usr_service::find_by_id_usr(
    id,
    options,
  ).await?;
  
  let mut model = model;
  if let Some(model) = &mut model {
    // 密码
    model.password = String::new();
  }
  let model = model;
  
  Ok(model)
}

/// 根据 id 查找用户, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<UsrModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = usr_service::find_by_id_ok_usr(
    id,
    options,
  ).await?;
  
  let mut model = model;
  // 密码
  model.password = String::new();
  let model = model;
  
  Ok(model)
}

/// 根据 ids 查找用户
#[function_name::named]
pub async fn find_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = usr_service::find_by_ids_usr(
    ids,
    options,
  ).await?;
  
  let mut models = models;
  for model in models.iter_mut() {
    // 密码
    model.password = String::new();
  }
  let models = models;
  
  Ok(models)
}

/// 根据 ids 查找用户, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = usr_service::find_by_ids_ok_usr(
    ids,
    options,
  ).await?;
  
  let mut models = models;
  for model in models.iter_mut() {
    // 密码
    model.password = String::new();
  }
  let models = models;
  
  Ok(models)
}

/// 创建用户
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_usr(
  inputs: Vec<UsrInput>,
  options: Option<Options>,
) -> Result<Vec<UsrId>> {
  
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = usr_service::set_id_by_lbl_usr(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_usr(),
    "add".to_owned(),
  ).await?;
  
  let ids = usr_service::creates_usr(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 用户根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_usr(
  id: UsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = usr_service::update_tenant_by_id_usr(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改用户
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_usr(
  id: UsrId,
  input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = usr_service::set_id_by_lbl_usr(
    input,
  ).await?;
  
  use_permit(
    get_route_path_usr(),
    "edit".to_owned(),
  ).await?;
  
  let res = usr_service::update_by_id_usr(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除用户
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = usr_service::delete_by_ids_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找用户是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = usr_service::get_is_enabled_by_id_usr(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用用户
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_usr(
  ids: Vec<UsrId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_usr(),
    "edit".to_owned(),
  ).await?;
  
  let num = usr_service::enable_by_ids_usr(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找用户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = usr_service::get_is_locked_by_id_usr(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁用户
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_usr(
  ids: Vec<UsrId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_usr(),
    "edit".to_owned(),
  ).await?;
  
  let num = usr_service::lock_by_ids_usr(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取用户字段注释
#[function_name::named]
pub async fn get_field_comments_usr(
  options: Option<Options>,
) -> Result<UsrFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = usr_service::get_field_comments_usr(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原用户
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = usr_service::revert_by_ids_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除用户
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_usr(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = usr_service::force_delete_by_ids_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 用户 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_usr(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = usr_service::find_last_order_by_usr(
    options,
  ).await?;
  
  Ok(res)
}
