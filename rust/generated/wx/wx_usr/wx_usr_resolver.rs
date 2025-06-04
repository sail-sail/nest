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

use super::wx_usr_model::*;
use super::wx_usr_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找小程序用户列表
#[function_name::named]
pub async fn find_all_wx_usr(
  search: Option<WxUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxUsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_usr(sort.as_deref())?;
  
  let models = wx_usr_service::find_all_wx_usr(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找小程序用户总数
#[function_name::named]
pub async fn find_count_wx_usr(
  search: Option<WxUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_usr_service::find_count_wx_usr(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个小程序用户
#[function_name::named]
pub async fn find_one_wx_usr(
  search: Option<WxUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxUsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_usr(sort.as_deref())?;
  
  let model = wx_usr_service::find_one_wx_usr(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个小程序用户, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wx_usr(
  search: Option<WxUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxUsrModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_usr(sort.as_deref())?;
  
  let model = wx_usr_service::find_one_ok_wx_usr(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找小程序用户
#[function_name::named]
pub async fn find_by_id_wx_usr(
  id: WxUsrId,
  options: Option<Options>,
) -> Result<Option<WxUsrModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_usr_service::find_by_id_wx_usr(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找小程序用户, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wx_usr(
  id: WxUsrId,
  options: Option<Options>,
) -> Result<WxUsrModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_usr_service::find_by_id_ok_wx_usr(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找小程序用户
#[function_name::named]
pub async fn find_by_ids_wx_usr(
  ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxUsrModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_usr_service::find_by_ids_wx_usr(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找小程序用户, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wx_usr(
  ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxUsrModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_usr_service::find_by_ids_ok_wx_usr(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建小程序用户
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_wx_usr(
  inputs: Vec<WxUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxUsrId>> {
  
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
    let input = wx_usr_service::set_id_by_lbl_wx_usr(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wx_usr(),
    "add".to_owned(),
  ).await?;
  
  let ids = wx_usr_service::creates_wx_usr(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 小程序用户根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wx_usr(
  id: WxUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_usr_service::update_tenant_by_id_wx_usr(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改小程序用户
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_wx_usr(
  id: WxUsrId,
  input: WxUsrInput,
  options: Option<Options>,
) -> Result<WxUsrId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wx_usr_service::set_id_by_lbl_wx_usr(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wx_usr(),
    "edit".to_owned(),
  ).await?;
  
  let res = wx_usr_service::update_by_id_wx_usr(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除小程序用户
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wx_usr(
  ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = wx_usr_service::delete_by_ids_wx_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取小程序用户字段注释
#[function_name::named]
pub async fn get_field_comments_wx_usr(
  options: Option<Options>,
) -> Result<WxUsrFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wx_usr_service::get_field_comments_wx_usr(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原小程序用户
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wx_usr(
  ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = wx_usr_service::revert_by_ids_wx_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除小程序用户
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wx_usr(
  ids: Vec<WxUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wx_usr(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wx_usr_service::force_delete_by_ids_wx_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
