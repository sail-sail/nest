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

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao::ns;

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::role_model::*;
use super::role_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut RoleSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找角色列表
pub async fn find_all(
  search: Option<RoleSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = role_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找角色总数
pub async fn find_count(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = role_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个角色
pub async fn find_one(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = role_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找角色
pub async fn find_by_id(
  id: RoleId,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let model = role_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: RoleInput,
) -> Result<RoleInput> {
  
  let input = role_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建角色
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<RoleInput>,
  options: Option<Options>,
) -> Result<Vec<RoleId>> {
  
  let role_ids = role_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(role_ids)
}

/// 角色根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: RoleId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改角色
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: RoleId,
  mut input: RoleInput,
  options: Option<Options>,
) -> Result<RoleId> {
  
  let is_locked = role_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = ns(
      "角色".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(eyre!(err_msg));
  }
  
  let role_id = role_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(role_id)
}

/// 根据 ids 删除角色
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = role_dao::find_all(
    Some(RoleSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let table_comment = ns(
        "角色".to_owned(),
        None,
      ).await?;
      let map = HashMap::from([
        ("0".to_owned(), table_comment),
      ]);
      let err_msg = ns(
        "不能删除已经锁定的 {0}",
        map.into(),
      ).await?;
      return Err(eyre!(err_msg));
    }
  }
  
  let models = role_dao::find_all(
    Some(RoleSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_sys == 1 {
      let err_msg = ns("不能删除系统记录".to_owned(), None).await?;
      return Err(eyre!(err_msg));
    }
  }
  
  let num = role_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找角色是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = role_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用角色
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<RoleId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找角色是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = role_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁角色
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<RoleId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取角色字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<RoleFieldComment> {
  
  let comments = role_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原角色
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除角色
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 角色 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = role_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
