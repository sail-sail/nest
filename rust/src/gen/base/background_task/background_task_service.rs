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

use crate::r#gen::base::tenant::tenant_model::TenantId;

use crate::r#gen::base::usr::usr_dao::{
  find_by_id_usr,
  validate_option_usr,
};

use crate::src::base::usr::usr_dao::is_admin;

use super::background_task_model::*;
use super::background_task_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut BackgroundTaskSearch,
  options: Option<Options>,
) -> Result<()> {
  
  let usr_id = get_auth_id_ok()?;
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  if !is_admin(usr_id.clone(), options.clone()).await? {
    search.create_usr_id = Some(vec![usr_id]);
  }
  Ok(())
}

/// 根据搜索条件和分页查找后台任务列表
pub async fn find_all_background_task(
  search: Option<BackgroundTaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let background_task_models = background_task_dao::find_all_background_task(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(background_task_models)
}

/// 根据条件查找后台任务总数
pub async fn find_count_background_task(
  search: Option<BackgroundTaskSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let background_task_num = background_task_dao::find_count_background_task(
    Some(search),
    options,
  ).await?;
  
  Ok(background_task_num)
}

/// 根据条件查找第一个后台任务
pub async fn find_one_background_task(
  search: Option<BackgroundTaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let background_task_model = background_task_dao::find_one_background_task(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(background_task_model)
}

/// 根据 id 查找后台任务
pub async fn find_by_id_background_task(
  background_task_id: BackgroundTaskId,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let background_task_model = background_task_dao::find_by_id_background_task(
    background_task_id,
    options,
  ).await?;
  
  Ok(background_task_model)
}

/// 根据 background_task_ids 查找后台任务
pub async fn find_by_ids_background_task(
  background_task_ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  let background_task_models = background_task_dao::find_by_ids_background_task(
    background_task_ids,
    options,
  ).await?;
  
  Ok(background_task_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_background_task(
  background_task_input: BackgroundTaskInput,
) -> Result<BackgroundTaskInput> {
  
  let background_task_input = background_task_dao::set_id_by_lbl_background_task(
    background_task_input,
  ).await?;
  
  Ok(background_task_input)
}

/// 创建后台任务
#[allow(dead_code)]
pub async fn creates_background_task(
  background_task_inputs: Vec<BackgroundTaskInput>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskId>> {
  
  let background_task_ids = background_task_dao::creates_background_task(
    background_task_inputs,
    options,
  ).await?;
  
  Ok(background_task_ids)
}

/// 后台任务根据 background_task_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_background_task(
  background_task_id: BackgroundTaskId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::update_tenant_by_id_background_task(
    background_task_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 background_task_id 修改后台任务
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_background_task(
  background_task_id: BackgroundTaskId,
  mut background_task_input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<BackgroundTaskId> {
  
  let background_task_id = background_task_dao::update_by_id_background_task(
    background_task_id,
    background_task_input,
    options.clone(),
  ).await?;
  
  Ok(background_task_id)
}

/// 校验后台任务是否存在
#[allow(dead_code)]
pub async fn validate_option_background_task(
  background_task_model: Option<BackgroundTaskModel>,
) -> Result<BackgroundTaskModel> {
  
  let background_task_model = background_task_dao::validate_option_background_task(background_task_model).await?;
  
  Ok(background_task_model)
}

/// 根据 background_task_ids 删除后台任务
#[allow(dead_code)]
pub async fn delete_by_ids_background_task(
  background_task_ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::delete_by_ids_background_task(
    background_task_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取后台任务字段注释
pub async fn get_field_comments_background_task(
  options: Option<Options>,
) -> Result<BackgroundTaskFieldComment> {
  
  let comments = background_task_dao::get_field_comments_background_task(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 background_task_ids 还原后台任务
#[allow(dead_code)]
pub async fn revert_by_ids_background_task(
  background_task_ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::revert_by_ids_background_task(
    background_task_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 background_task_ids 彻底删除后台任务
#[allow(dead_code)]
pub async fn force_delete_by_ids_background_task(
  background_task_ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_dao::force_delete_by_ids_background_task(
    background_task_ids,
    options,
  ).await?;
  
  Ok(num)
}
