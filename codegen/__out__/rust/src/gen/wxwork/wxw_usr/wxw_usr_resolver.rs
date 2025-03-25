#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::wxw_usr_model::*;
use super::wxw_usr_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找企微用户列表
#[function_name::named]
pub async fn find_all_wxw_usr(
  search: Option<WxwUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_usr(sort.as_deref())?;
  
  let models = wxw_usr_service::find_all_wxw_usr(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找企微用户总数
#[function_name::named]
pub async fn find_count_wxw_usr(
  search: Option<WxwUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_usr_service::find_count_wxw_usr(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个企微用户
#[function_name::named]
pub async fn find_one_wxw_usr(
  search: Option<WxwUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxw_usr(sort.as_deref())?;
  
  let model = wxw_usr_service::find_one_wxw_usr(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找企微用户
#[function_name::named]
pub async fn find_by_id_wxw_usr(
  id: WxwUsrId,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxw_usr_service::find_by_id_wxw_usr(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找企微用户
#[function_name::named]
pub async fn find_by_ids_wxw_usr(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxw_usr_service::find_by_ids_wxw_usr(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建企微用户
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_wxw_usr(
  inputs: Vec<WxwUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrId>> {
  
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
    let input = wxw_usr_service::set_id_by_lbl_wxw_usr(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wxw_usr(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxw_usr_service::creates_wxw_usr(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 企微用户根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wxw_usr(
  id: WxwUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxw_usr_service::update_tenant_by_id_wxw_usr(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改企微用户
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_wxw_usr(
  id: WxwUsrId,
  input: WxwUsrInput,
  options: Option<Options>,
) -> Result<WxwUsrId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxw_usr_service::set_id_by_lbl_wxw_usr(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wxw_usr(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxw_usr_service::update_by_id_wxw_usr(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除企微用户
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wxw_usr(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_usr_service::delete_by_ids_wxw_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取企微用户字段注释
#[function_name::named]
pub async fn get_field_comments_wxw_usr(
  options: Option<Options>,
) -> Result<WxwUsrFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxw_usr_service::get_field_comments_wxw_usr(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原企微用户
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wxw_usr(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_usr_service::revert_by_ids_wxw_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除企微用户
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wxw_usr(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxw_usr(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_usr_service::force_delete_by_ids_wxw_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
