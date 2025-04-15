#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
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
pub async fn find_all_domain(
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
  
  let domain_models = domain_dao::find_all_domain(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(domain_models)
}

/// 根据条件查找域名总数
pub async fn find_count_domain(
  search: Option<DomainSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let domain_num = domain_dao::find_count_domain(
    Some(search),
    options,
  ).await?;
  
  Ok(domain_num)
}

/// 根据条件查找第一个域名
pub async fn find_one_domain(
  search: Option<DomainSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let domain_model = domain_dao::find_one_domain(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(domain_model)
}

/// 根据 id 查找域名
pub async fn find_by_id_domain(
  domain_id: DomainId,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  let domain_model = domain_dao::find_by_id_domain(
    domain_id,
    options,
  ).await?;
  
  Ok(domain_model)
}

/// 根据 domain_ids 查找域名
pub async fn find_by_ids_domain(
  domain_ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<Vec<DomainModel>> {
  
  let domain_models = domain_dao::find_by_ids_domain(
    domain_ids,
    options,
  ).await?;
  
  Ok(domain_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_domain(
  domain_input: DomainInput,
) -> Result<DomainInput> {
  
  let domain_input = domain_dao::set_id_by_lbl_domain(
    domain_input,
  ).await?;
  
  Ok(domain_input)
}

/// 创建域名
#[allow(dead_code)]
pub async fn creates_domain(
  domain_inputs: Vec<DomainInput>,
  options: Option<Options>,
) -> Result<Vec<DomainId>> {
  
  let domain_ids = domain_dao::creates_domain(
    domain_inputs,
    options,
  ).await?;
  
  Ok(domain_ids)
}

/// 根据 domain_id 修改域名
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_domain(
  domain_id: DomainId,
  mut domain_input: DomainInput,
  options: Option<Options>,
) -> Result<DomainId> {
  
  let is_locked = domain_dao::get_is_locked_by_id_domain(
    domain_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 域名";
    return Err(eyre!(err_msg));
  }
  
  let domain_id = domain_dao::update_by_id_domain(
    domain_id,
    domain_input,
    options.clone(),
  ).await?;
  
  Ok(domain_id)
}

/// 校验域名是否存在
#[allow(dead_code)]
pub async fn validate_option_domain(
  domain_model: Option<DomainModel>,
) -> Result<DomainModel> {
  
  let domain_model = domain_dao::validate_option_domain(domain_model).await?;
  
  Ok(domain_model)
}

/// 根据 domain_ids 删除域名
#[allow(dead_code)]
pub async fn delete_by_ids_domain(
  domain_ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = domain_dao::find_all_domain(
    Some(DomainSearch {
      ids: Some(domain_ids.clone()),
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
  
  let num = domain_dao::delete_by_ids_domain(
    domain_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 domain_id 设置默认域名
#[allow(dead_code)]
pub async fn default_by_id_domain(
  domain_id: DomainId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::default_by_id_domain(
    domain_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 domain_id 查找域名是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_domain(
  domain_id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = domain_dao::get_is_enabled_by_id_domain(
    domain_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 domain_ids 启用或者禁用域名
#[allow(dead_code)]
pub async fn enable_by_ids_domain(
  domain_ids: Vec<DomainId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::enable_by_ids_domain(
    domain_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 domain_id 查找域名是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_domain(
  domain_id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = domain_dao::get_is_locked_by_id_domain(
    domain_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 domain_ids 锁定或者解锁域名
#[allow(dead_code)]
pub async fn lock_by_ids_domain(
  domain_ids: Vec<DomainId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::lock_by_ids_domain(
    domain_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取域名字段注释
pub async fn get_field_comments_domain(
  options: Option<Options>,
) -> Result<DomainFieldComment> {
  
  let comments = domain_dao::get_field_comments_domain(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 domain_ids 还原域名
#[allow(dead_code)]
pub async fn revert_by_ids_domain(
  domain_ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::revert_by_ids_domain(
    domain_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 domain_ids 彻底删除域名
#[allow(dead_code)]
pub async fn force_delete_by_ids_domain(
  domain_ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::force_delete_by_ids_domain(
    domain_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 域名 order_by 字段的最大值
pub async fn find_last_order_by_domain(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = domain_dao::find_last_order_by_domain(
    options,
  ).await?;
  
  Ok(res)
}
