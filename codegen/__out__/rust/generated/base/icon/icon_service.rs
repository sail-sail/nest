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

use crate::common::gql::model::{PageInput, SortInput};

use super::icon_model::*;
use super::icon_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut IconSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找图标库列表
pub async fn find_all_icon(
  search: Option<IconSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<IconModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let icon_models = icon_dao::find_all_icon(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(icon_models)
}

/// 根据条件查找图标库总数
pub async fn find_count_icon(
  search: Option<IconSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let icon_num = icon_dao::find_count_icon(
    Some(search),
    options,
  ).await?;
  
  Ok(icon_num)
}

/// 根据条件查找第一个图标库
pub async fn find_one_icon(
  search: Option<IconSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<IconModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let icon_model = icon_dao::find_one_icon(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(icon_model)
}

/// 根据条件查找第一个图标库, 如果不存在则抛错
pub async fn find_one_ok_icon(
  search: Option<IconSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<IconModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let icon_model = icon_dao::find_one_ok_icon(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(icon_model)
}

/// 根据 id 查找图标库
pub async fn find_by_id_icon(
  icon_id: IconId,
  options: Option<Options>,
) -> Result<Option<IconModel>> {
  
  let icon_model = icon_dao::find_by_id_icon(
    icon_id,
    options,
  ).await?;
  
  Ok(icon_model)
}

/// 根据 id 查找图标库, 如果不存在则抛错
pub async fn find_by_id_ok_icon(
  icon_id: IconId,
  options: Option<Options>,
) -> Result<IconModel> {
  
  let icon_model = icon_dao::find_by_id_ok_icon(
    icon_id,
    options,
  ).await?;
  
  Ok(icon_model)
}

/// 根据 ids 查找图标库
pub async fn find_by_ids_icon(
  icon_ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<Vec<IconModel>> {
  
  let icon_models = icon_dao::find_by_ids_icon(
    icon_ids,
    options,
  ).await?;
  
  Ok(icon_models)
}

/// 根据 ids 查找图标库, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_icon(
  icon_ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<Vec<IconModel>> {
  
  let icon_models = icon_dao::find_by_ids_ok_icon(
    icon_ids,
    options,
  ).await?;
  
  Ok(icon_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_icon(
  icon_input: IconInput,
) -> Result<IconInput> {
  
  let icon_input = icon_dao::set_id_by_lbl_icon(
    icon_input,
  ).await?;
  
  Ok(icon_input)
}

/// 创建图标库
#[allow(dead_code)]
pub async fn creates_icon(
  icon_inputs: Vec<IconInput>,
  options: Option<Options>,
) -> Result<Vec<IconId>> {
  
  let icon_ids = icon_dao::creates_icon(
    icon_inputs,
    options,
  ).await?;
  
  Ok(icon_ids)
}

/// 根据 icon_id 修改图标库
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_icon(
  icon_id: IconId,
  mut icon_input: IconInput,
  options: Option<Options>,
) -> Result<IconId> {
  
  let icon_id = icon_dao::update_by_id_icon(
    icon_id,
    icon_input,
    options.clone(),
  ).await?;
  
  Ok(icon_id)
}

/// 校验图标库是否存在
#[allow(dead_code)]
pub async fn validate_option_icon(
  icon_model: Option<IconModel>,
) -> Result<IconModel> {
  
  let icon_model = icon_dao::validate_option_icon(icon_model).await?;
  
  Ok(icon_model)
}

/// 根据 icon_ids 删除图标库
#[allow(dead_code)]
pub async fn delete_by_ids_icon(
  icon_ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = icon_dao::delete_by_ids_icon(
    icon_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 icon_id 查找图标库是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_icon(
  icon_id: IconId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = icon_dao::get_is_enabled_by_id_icon(
    icon_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 icon_ids 启用或者禁用图标库
#[allow(dead_code)]
pub async fn enable_by_ids_icon(
  icon_ids: Vec<IconId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = icon_dao::enable_by_ids_icon(
    icon_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取图标库字段注释
pub async fn get_field_comments_icon(
  options: Option<Options>,
) -> Result<IconFieldComment> {
  
  let comments = icon_dao::get_field_comments_icon(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 icon_ids 还原图标库
#[allow(dead_code)]
pub async fn revert_by_ids_icon(
  icon_ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = icon_dao::revert_by_ids_icon(
    icon_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 icon_ids 彻底删除图标库
#[allow(dead_code)]
pub async fn force_delete_by_ids_icon(
  icon_ids: Vec<IconId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = icon_dao::force_delete_by_ids_icon(
    icon_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 图标库 order_by 字段的最大值
pub async fn find_last_order_by_icon(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = icon_dao::find_last_order_by_icon(
    options,
  ).await?;
  
  Ok(res)
}
