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

use super::background_task_model::*;
use super::background_task_dao;

/// 根据搜索条件和分页查找后台任务列表
pub async fn find_all(
  search: Option<BackgroundTaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  let res = background_task_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找后台任务总数
pub async fn find_count(
  search: Option<BackgroundTaskSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = background_task_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个后台任务
pub async fn find_one(
  search: Option<BackgroundTaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let model = background_task_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找后台任务
pub async fn find_by_id(
  id: BackgroundTaskId,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let model = background_task_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: BackgroundTaskInput,
) -> Result<BackgroundTaskInput> {
  
  let input = background_task_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建后台任务
#[allow(dead_code)]
pub async fn create(
  input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<BackgroundTaskId> {
  
  let id = background_task_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 后台任务根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: BackgroundTaskId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改后台任务
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: BackgroundTaskId,
  mut input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<BackgroundTaskId> {
  
  let res = background_task_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除后台任务
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取后台任务字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<BackgroundTaskFieldComment> {
  
  let comments = background_task_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原后台任务
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除后台任务
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}