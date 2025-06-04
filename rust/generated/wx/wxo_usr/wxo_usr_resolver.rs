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

use super::wxo_usr_model::*;
use super::wxo_usr_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找公众号用户列表
#[function_name::named]
pub async fn find_all_wxo_usr(
  search: Option<WxoUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_usr(sort.as_deref())?;
  
  let models = wxo_usr_service::find_all_wxo_usr(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找公众号用户总数
#[function_name::named]
pub async fn find_count_wxo_usr(
  search: Option<WxoUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxo_usr_service::find_count_wxo_usr(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个公众号用户
#[function_name::named]
pub async fn find_one_wxo_usr(
  search: Option<WxoUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoUsrModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_usr(sort.as_deref())?;
  
  let model = wxo_usr_service::find_one_wxo_usr(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个公众号用户, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wxo_usr(
  search: Option<WxoUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxoUsrModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wxo_usr(sort.as_deref())?;
  
  let model = wxo_usr_service::find_one_ok_wxo_usr(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找公众号用户
#[function_name::named]
pub async fn find_by_id_wxo_usr(
  id: WxoUsrId,
  options: Option<Options>,
) -> Result<Option<WxoUsrModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxo_usr_service::find_by_id_wxo_usr(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找公众号用户, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wxo_usr(
  id: WxoUsrId,
  options: Option<Options>,
) -> Result<WxoUsrModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wxo_usr_service::find_by_id_ok_wxo_usr(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找公众号用户
#[function_name::named]
pub async fn find_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxo_usr_service::find_by_ids_wxo_usr(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找公众号用户, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wxo_usr_service::find_by_ids_ok_wxo_usr(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建公众号用户
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_wxo_usr(
  inputs: Vec<WxoUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrId>> {
  
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
    let input = wxo_usr_service::set_id_by_lbl_wxo_usr(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_wxo_usr(),
    "add".to_owned(),
  ).await?;
  
  let ids = wxo_usr_service::creates_wxo_usr(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 公众号用户根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wxo_usr(
  id: WxoUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wxo_usr_service::update_tenant_by_id_wxo_usr(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改公众号用户
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_wxo_usr(
  id: WxoUsrId,
  input: WxoUsrInput,
  options: Option<Options>,
) -> Result<WxoUsrId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = wxo_usr_service::set_id_by_lbl_wxo_usr(
    input,
  ).await?;
  
  use_permit(
    get_route_path_wxo_usr(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxo_usr_service::update_by_id_wxo_usr(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除公众号用户
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxo_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxo_usr_service::delete_by_ids_wxo_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取公众号用户字段注释
#[function_name::named]
pub async fn get_field_comments_wxo_usr(
  options: Option<Options>,
) -> Result<WxoUsrFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wxo_usr_service::get_field_comments_wxo_usr(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原公众号用户
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxo_usr(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxo_usr_service::revert_by_ids_wxo_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除公众号用户
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_wxo_usr(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxo_usr_service::force_delete_by_ids_wxo_usr(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
