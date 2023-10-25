use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use super::wxw_app_token_model::*;
use super::wxw_app_token_dao;

/// 根据搜索条件和分页查找数据
pub async fn find_all(
  search: Option<WxwAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  let res = wxw_app_token_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
pub async fn find_count(
  search: Option<WxwAppTokenSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = wxw_app_token_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
pub async fn find_one(
  search: Option<WxwAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  let model = wxw_app_token_dao::find_one(
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
) -> Result<Option<WxwAppTokenModel>> {
  
  let model = wxw_app_token_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: WxwAppTokenInput,
) -> Result<WxwAppTokenInput> {
  
  let input = wxw_app_token_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建数据
#[allow(dead_code)]
pub async fn create(
  input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<String> {
  
  let id = wxw_app_token_dao::create(
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
  
  let num = wxw_app_token_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: String,
  mut input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<String> {
  
  let res = wxw_app_token_dao::update_by_id(
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
  
  let num = wxw_app_token_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<WxwAppTokenFieldComment> {
  
  let comments = wxw_app_token_dao::get_field_comments(
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
  
  let num = wxw_app_token_dao::revert_by_ids(
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
  
  let num = wxw_app_token_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
