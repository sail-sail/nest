use color_eyre::eyre::Result;
use crate::common::context::{get_auth_model, Options};

use crate::r#gen::base::usr::usr_dao::find_by_id_usr;

use crate::r#gen::base::dept::dept_dao::find_all_dept;
use crate::r#gen::base::dept::dept_model::{DeptSearch, DeptId};

use crate::common::auth::auth_model::AuthModel;
use crate::r#gen::base::usr::usr_model::UsrId;

/// 获取当前登录用户的部门id列表
#[allow(dead_code)]
pub async fn get_auth_dept_ids() -> Result<Vec<DeptId>> {
  
  let aut_model: Option<AuthModel> = get_auth_model();
  if aut_model.is_none() {
    return Ok(vec![]);
  }
  let aut_model = aut_model.unwrap();
  
  let usr_id = aut_model.id;
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  
  let usr_model = find_by_id_usr(
    usr_id,
    Some(options),
  ).await?;
  
  if usr_model.is_none() {
    return Ok(vec![]);
  }
  let usr_model = usr_model.unwrap();
  
  if usr_model.is_enabled == 0 {
    return Ok(vec![]);
  }
  
  let dept_ids = usr_model.dept_ids;
  
  Ok(dept_ids)
}

/// 获取指定用户的部门ID列表
#[allow(dead_code)]
pub async fn get_dept_ids(
  usr_id: UsrId,
) -> Result<Vec<DeptId>> {
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    usr_id,
    options,
  ).await?;
  
  if usr_model.is_none() {
    return Ok(vec![]);
  }
  let usr_model = usr_model.unwrap();
  
  if usr_model.is_enabled == 0 {
    return Ok(vec![]);
  }
  
  let dept_ids = usr_model.dept_ids;
  
  Ok(dept_ids)
}

#[allow(dead_code)]
async fn get_parents_by_id(
  ids: Vec<DeptId>,
  parent_ids: &mut Vec<DeptId>,
) -> Result<()> {
  
  if ids.is_empty() {
    return Ok(());
  }
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let dept_models = find_all_dept(
    DeptSearch {
      ids: ids.into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options,
  ).await?;
  
  let ids2: Vec<DeptId> = dept_models
    .into_iter()
    .map(|dept_model| {
      dept_model.parent_id
    }).collect();
  
  parent_ids.extend(ids2.clone());
  
  Box::pin(get_parents_by_id(
    ids2,
    parent_ids,
  )).await?;
  
  Ok(())
}

/// 获取当前用户及其所有父部门的id
#[allow(dead_code)]
pub async fn get_auth_and_parents_dept_ids() -> Result<Vec<DeptId>> {
  
  let dept_ids = get_auth_dept_ids().await?;
  
  let mut parent_ids: Vec<DeptId> = vec![];
  
  parent_ids.extend(dept_ids.clone());
  
  get_parents_by_id(
    dept_ids,
    &mut parent_ids,
  ).await?;
  
  Ok(parent_ids)
}

/// 获取指定用户及其所有父部门的id
#[allow(dead_code)]
pub async fn get_parents_dept_ids(
  usr_id: Option<UsrId>,
) -> Result<Vec<DeptId>> {
  
  if usr_id.is_none() {
    return Ok(vec![]);
  }
  let usr_id = usr_id.unwrap();
  
  let dept_ids = get_dept_ids(
    usr_id,
  ).await?;
  
  let mut parent_ids: Vec<DeptId> = vec![];
  
  get_parents_by_id(
    dept_ids,
    &mut parent_ids,
  ).await?;
  
  Ok(parent_ids)
}

/// 获取当前用户所在部门及其全部子部门的id
#[allow(dead_code)]
pub async fn get_auth_and_children_dept_ids() -> Result<Vec<DeptId>> {
  
  let dept_ids = get_auth_dept_ids().await?;
  
  let mut children_ids: Vec<DeptId> = vec![];
  
  for id in dept_ids {
    get_children_all_dept_ids(
      id,
      &mut children_ids,
    ).await?;
  }
  
  Ok(children_ids)
}

/// 递归获取指定部门子部门的id列表
#[allow(dead_code)]
async fn get_children_all_dept_ids(
  parent_id: DeptId,
  children_ids: &mut Vec<DeptId>,
) -> Result<()> {
  
  children_ids.push(parent_id.clone());
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let dept_models = find_all_dept(
    DeptSearch {
      parent_id: vec![parent_id].into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options,
  ).await?;
  
  let ids: Vec<DeptId> = dept_models
    .into_iter()
    .map(|dept_model| {
      dept_model.id
    }).collect();
  
  for id in ids {
    Box::pin(get_children_all_dept_ids(
      id,
      children_ids,
    )).await?;
  }
  
  Ok(())
}
