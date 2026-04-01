
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_auth_org_id,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::task_model::*;
use super::task_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut TaskSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找审批任务列表
pub async fn find_all_task(
  search: Option<TaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TaskModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let task_models = task_dao::find_all_task(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(task_models)
}

/// 根据条件查找审批任务总数
pub async fn find_count_task(
  search: Option<TaskSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let task_num = task_dao::find_count_task(
    Some(search),
    options,
  ).await?;
  
  Ok(task_num)
}

/// 根据条件查找第一个审批任务
pub async fn find_one_task(
  search: Option<TaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TaskModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let task_model = task_dao::find_one_task(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(task_model)
}

/// 根据条件查找第一个审批任务, 如果不存在则抛错
pub async fn find_one_ok_task(
  search: Option<TaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<TaskModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let task_model = task_dao::find_one_ok_task(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(task_model)
}

/// 根据 id 查找审批任务
pub async fn find_by_id_task(
  task_id: TaskId,
  options: Option<Options>,
) -> Result<Option<TaskModel>> {
  
  let task_model = task_dao::find_by_id_task(
    task_id,
    options,
  ).await?;
  
  Ok(task_model)
}

/// 根据 id 查找审批任务, 如果不存在则抛错
pub async fn find_by_id_ok_task(
  task_id: TaskId,
  options: Option<Options>,
) -> Result<TaskModel> {
  
  let task_model = task_dao::find_by_id_ok_task(
    task_id,
    options,
  ).await?;
  
  Ok(task_model)
}

/// 根据 ids 查找审批任务
pub async fn find_by_ids_task(
  task_ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<Vec<TaskModel>> {
  
  let task_models = task_dao::find_by_ids_task(
    task_ids,
    options,
  ).await?;
  
  Ok(task_models)
}

/// 根据 ids 查找审批任务, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_task(
  task_ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<Vec<TaskModel>> {
  
  let task_models = task_dao::find_by_ids_ok_task(
    task_ids,
    options,
  ).await?;
  
  Ok(task_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_task(
  task_input: TaskInput,
) -> Result<TaskInput> {
  
  let task_input = task_dao::set_id_by_lbl_task(
    task_input,
  ).await?;
  
  Ok(task_input)
}

/// 创建审批任务
#[allow(dead_code)]
pub async fn creates_task(
  task_inputs: Vec<TaskInput>,
  options: Option<Options>,
) -> Result<Vec<TaskId>> {
  
  let task_ids = task_dao::creates_task(
    task_inputs,
    options,
  ).await?;
  
  Ok(task_ids)
}

/// 审批任务根据 task_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_task(
  task_id: TaskId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = task_dao::update_tenant_by_id_task(
    task_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 task_id 修改审批任务
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_task(
  task_id: TaskId,
  mut task_input: TaskInput,
  options: Option<Options>,
) -> Result<TaskId> {
  
  let task_id = task_dao::update_by_id_task(
    task_id,
    task_input,
    options,
  ).await?;
  
  Ok(task_id)
}

/// 校验审批任务是否存在
#[allow(dead_code)]
pub async fn validate_option_task(
  task_model: Option<TaskModel>,
) -> Result<TaskModel> {
  
  let task_model = task_dao::validate_option_task(task_model).await?;
  
  Ok(task_model)
}

/// 根据 task_ids 删除审批任务
#[allow(dead_code)]
pub async fn delete_by_ids_task(
  task_ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = task_dao::delete_by_ids_task(
    task_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取审批任务字段注释
pub async fn get_field_comments_task(
  options: Option<Options>,
) -> Result<TaskFieldComment> {
  
  let comments = task_dao::get_field_comments_task(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 task_ids 还原审批任务
#[allow(dead_code)]
pub async fn revert_by_ids_task(
  task_ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = task_dao::revert_by_ids_task(
    task_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 task_ids 彻底删除审批任务
#[allow(dead_code)]
pub async fn force_delete_by_ids_task(
  task_ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = task_dao::force_delete_by_ids_task(
    task_ids,
    options,
  ).await?;
  
  Ok(num)
}
