#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use anyhow::{Result, anyhow};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao::ns;

use super::menu_model::*;
use super::menu_dao;

/// 根据搜索条件和分页查找菜单列表
pub async fn find_all(
  search: Option<MenuSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let res = menu_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找菜单总数
pub async fn find_count(
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = menu_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个菜单
pub async fn find_one(
  search: Option<MenuSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  let model = menu_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找菜单
pub async fn find_by_id(
  id: MenuId,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  let model = menu_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: MenuInput,
) -> Result<MenuInput> {
  
  let input = menu_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建菜单
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<MenuInput>,
  options: Option<Options>,
) -> Result<Vec<MenuId>> {
  
  let ids = menu_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改菜单
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: MenuId,
  mut input: MenuInput,
  options: Option<Options>,
) -> Result<MenuId> {
  
  let is_locked = menu_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = ns(
      "菜单".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  
  let res = menu_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除菜单
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = menu_dao::find_all(
    Some(MenuSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    None,
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let table_comment = ns(
        "菜单".to_owned(),
        None,
      ).await?;
      let map = HashMap::from([
        ("0".to_owned(), table_comment),
      ]);
      let err_msg = ns(
        "不能删除已经锁定的 {0}",
        map.into(),
      ).await?;
      return Err(anyhow!(err_msg));
    }
  }
  
  let num = menu_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找菜单是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: MenuId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = menu_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用菜单
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<MenuId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找菜单是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: MenuId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = menu_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁菜单
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<MenuId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取菜单字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<MenuFieldComment> {
  
  let comments = menu_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原菜单
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除菜单
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 菜单 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = menu_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
