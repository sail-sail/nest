#[allow(unused_imports)]
use std::collections::HashMap;

use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use crate::gen::base::tenant::tenant_model::TenantId;

use super::dictbiz_model::*;
use super::dictbiz_dao;

/// 根据搜索条件和分页查找业务字典列表
pub async fn find_all(
  search: Option<DictbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  let res = dictbiz_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找业务字典总数
pub async fn find_count(
  search: Option<DictbizSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = dictbiz_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个业务字典
pub async fn find_one(
  search: Option<DictbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let model = dictbiz_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务字典
pub async fn find_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let model = dictbiz_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: DictbizInput,
) -> Result<DictbizInput> {
  
  let input = dictbiz_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建业务字典
#[allow(dead_code)]
pub async fn create(
  input: DictbizInput,
  options: Option<Options>,
) -> Result<DictbizId> {
  
  let id = dictbiz_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 业务字典根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: DictbizId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改业务字典
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: DictbizId,
  mut input: DictbizInput,
  options: Option<Options>,
) -> Result<DictbizId> {
  
  let is_locked = dictbiz_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = i18n_dao::ns(
      "业务字典".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  let res = dictbiz_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除业务字典
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<DictbizId> = vec![];
  for id in ids0 {
    let is_locked = dictbiz_dao::get_is_locked_by_id(
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let table_comment = i18n_dao::ns(
      "业务字典".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能删除已经锁定的 {0}",
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  let ids = ids;
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<DictbizId> = vec![];
  for id in ids0 {
    let model = dictbiz_dao::find_by_id(
      id.clone(),
      None,
    ).await?;
    if model.is_none() {
      continue;
    }
    let model = model.unwrap();
    if model.is_sys == 1 {
      continue;
    }
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let err_msg = i18n_dao::ns("不能删除系统记录".to_owned(), None).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  let num = dictbiz_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dictbiz_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用业务字典
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DictbizId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务字典是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = dictbiz_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁业务字典
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<DictbizId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务字典字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictbizFieldComment> {
  
  let comments = dictbiz_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原业务字典
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除业务字典
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务字典 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dictbiz_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}