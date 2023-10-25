use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::wxw_usr_model::*;
use super::wxw_usr_service;

/// 根据搜索条件和分页查找数据
pub async fn find_all(
  search: Option<WxwUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  let res = wxw_usr_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
pub async fn find_count(
  search: Option<WxwUsrSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = wxw_usr_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一条数据
pub async fn find_one(
  search: Option<WxwUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  let model = wxw_usr_service::find_one(
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
) -> Result<Option<WxwUsrModel>> {
  
  let model = wxw_usr_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
#[allow(dead_code)]
pub async fn create(
  input: WxwUsrInput,
  options: Option<Options>,
) -> Result<String> {
  
  let input = wxw_usr_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/wxwork/wxw_usr".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = wxw_usr_service::create(
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
  
  let num = wxw_usr_service::update_tenant_by_id(
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
  input: WxwUsrInput,
  options: Option<Options>,
) -> Result<String> {
  
  let input = wxw_usr_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/wxwork/wxw_usr".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = wxw_usr_service::update_by_id(
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
    "/wxwork/wxw_usr".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_usr_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwUsrFieldComment> {
  
  let comments = wxw_usr_service::get_field_comments(
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
    "/wxwork/wxw_usr".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = wxw_usr_service::revert_by_ids(
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
    "/wxwork/wxw_usr".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = wxw_usr_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
