#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use super::domain_model::*;
use super::domain_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DomainSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找域名列表
pub async fn find_all(
  search: Option<DomainSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DomainModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = domain_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找域名总数
pub async fn find_count(
  search: Option<DomainSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let res = domain_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个域名
pub async fn find_one(
  search: Option<DomainSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let model = domain_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找域名
pub async fn find_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  let model = domain_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: DomainInput,
) -> Result<DomainInput> {
  
  let input = domain_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建域名
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DomainInput>,
  options: Option<Options>,
) -> Result<Vec<DomainId>> {
  
  let domain_ids = domain_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(domain_ids)
}

/// 根据 id 修改域名
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: DomainId,
  mut input: DomainInput,
  options: Option<Options>,
) -> Result<DomainId> {
  
  let is_locked = domain_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 域名";
    return Err(eyre!(err_msg));
  }
  
  let domain_id = domain_dao::update_by_id(
    id,
    input,
    options.clone(),
  ).await?;
  
  Ok(domain_id)
}

/// 校验域名是否存在
#[allow(dead_code)]
pub async fn validate_option(
  model: Option<DomainModel>,
) -> Result<DomainModel> {
  
  let model = domain_dao::validate_option(model).await?;
  
  Ok(model)
}

/// 根据 ids 删除域名
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = domain_dao::find_all(
    Some(DomainSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 域名";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = domain_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 设置默认域名
#[allow(dead_code)]
pub async fn default_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::default_by_id(
    id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找域名是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = domain_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用域名
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DomainId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找域名是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = domain_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁域名
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<DomainId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取域名字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DomainFieldComment> {
  
  let comments = domain_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原域名
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除域名
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 域名 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = domain_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
