use std::pin::Pin;

use anyhow::{Result, Error};
use futures_util::Future;
use crate::common::context::use_ctx;

use crate::gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

use crate::gen::base::dept::dept_dao::find_all as find_all_dept;
use crate::gen::base::dept::dept_model::DeptSearch;

use crate::common::auth::auth_model::AuthModel;

/// 获取当前登录用户的部门id列表
#[allow(dead_code)]
pub async fn get_auth_dept_ids() -> Result<Vec<String>> {
  
  let ctx = &use_ctx();
  
  let aut_model: Option<AuthModel> = ctx.get_auth_model();
  if aut_model.is_none() {
    return Ok(vec![]);
  }
  let aut_model = aut_model.unwrap();
  
  let usr_id = aut_model.id;
  
  let usr_model = find_by_id_usr(
    usr_id,
    None,
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
  ids: Vec<String>,
  parent_ids: &mut Vec<String>,
) -> Result<()> {
  
  if parent_ids.is_empty() {
    return Ok(());
  }
  
  let dept_models = find_all_dept(
    DeptSearch {
      ids: ids.into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  let ids2: Vec<String> = dept_models.into_iter()
    .map(|dept_model| {
      dept_model.parent_id
    }).collect();
  
  parent_ids.extend(ids2.clone());
  
  let future: Pin<Box<dyn Future<Output = Result<(), Error>>>> = Box::pin(
    get_parents_by_id(
      ids2,
      parent_ids,
    )
  );
  
  future.await?;
  
  Ok(())
}

/// 获取当前用户及其所有父部门的id
#[allow(dead_code)]
pub async fn get_auth_and_parents_dept_ids() -> Result<Vec<String>> {
  
  let dept_ids = get_auth_dept_ids().await?;
  
  let mut parent_ids: Vec<String> = vec![];
  
  parent_ids.extend(dept_ids.clone());
  
  get_parents_by_id(
    dept_ids,
    &mut parent_ids,
  ).await?;
  
  Ok(parent_ids)
}
