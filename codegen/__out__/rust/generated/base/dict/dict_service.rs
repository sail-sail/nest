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

use super::dict_model::*;
use super::dict_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DictSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找系统字典列表
pub async fn find_all_dict(
  search: Option<DictSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dict_models = dict_dao::find_all_dict(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dict_models)
}

/// 根据条件查找系统字典总数
pub async fn find_count_dict(
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dict_num = dict_dao::find_count_dict(
    Some(search),
    options,
  ).await?;
  
  Ok(dict_num)
}

/// 根据条件查找第一个系统字典
pub async fn find_one_dict(
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dict_model = dict_dao::find_one_dict(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dict_model)
}

/// 根据条件查找第一个系统字典, 如果不存在则抛错
pub async fn find_one_ok_dict(
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DictModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dict_model = dict_dao::find_one_ok_dict(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dict_model)
}

/// 根据 id 查找系统字典
pub async fn find_by_id_dict(
  dict_id: DictId,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let dict_model = dict_dao::find_by_id_dict(
    dict_id,
    options,
  ).await?;
  
  Ok(dict_model)
}

/// 根据 id 查找系统字典, 如果不存在则抛错
pub async fn find_by_id_ok_dict(
  dict_id: DictId,
  options: Option<Options>,
) -> Result<DictModel> {
  
  let dict_model = dict_dao::find_by_id_ok_dict(
    dict_id,
    options,
  ).await?;
  
  Ok(dict_model)
}

/// 根据 ids 查找系统字典
pub async fn find_by_ids_dict(
  dict_ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let dict_models = dict_dao::find_by_ids_dict(
    dict_ids,
    options,
  ).await?;
  
  Ok(dict_models)
}

/// 根据 ids 查找系统字典, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_dict(
  dict_ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let dict_models = dict_dao::find_by_ids_ok_dict(
    dict_ids,
    options,
  ).await?;
  
  Ok(dict_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_dict(
  dict_input: DictInput,
) -> Result<DictInput> {
  
  let dict_input = dict_dao::set_id_by_lbl_dict(
    dict_input,
  ).await?;
  
  Ok(dict_input)
}

/// 创建系统字典
#[allow(dead_code)]
pub async fn creates_dict(
  dict_inputs: Vec<DictInput>,
  options: Option<Options>,
) -> Result<Vec<DictId>> {
  
  let dict_ids = dict_dao::creates_dict(
    dict_inputs,
    options,
  ).await?;
  
  Ok(dict_ids)
}

/// 根据 dict_id 修改系统字典
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_dict(
  dict_id: DictId,
  mut dict_input: DictInput,
  options: Option<Options>,
) -> Result<DictId> {
  
  let old_model = validate_option_dict(
    dict_dao::find_by_id_dict(
      dict_id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 编码
    dict_input.code = None;
    // 数据类型
    dict_input.r#type = None;
    dict_input.type_lbl = None;
    // 启用
    dict_input.is_enabled = None;
    dict_input.is_enabled_lbl = None;
  }
  
  let dict_id = dict_dao::update_by_id_dict(
    dict_id,
    dict_input,
    options.clone(),
  ).await?;
  
  Ok(dict_id)
}

/// 校验系统字典是否存在
#[allow(dead_code)]
pub async fn validate_option_dict(
  dict_model: Option<DictModel>,
) -> Result<DictModel> {
  
  let dict_model = dict_dao::validate_option_dict(dict_model).await?;
  
  Ok(dict_model)
}

/// 根据 dict_ids 删除系统字典
#[allow(dead_code)]
pub async fn delete_by_ids_dict(
  dict_ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = dict_dao::find_all_dict(
    Some(DictSearch {
      ids: Some(dict_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = dict_dao::delete_by_ids_dict(
    dict_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dict_id 查找系统字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_dict(
  dict_id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dict_dao::get_is_enabled_by_id_dict(
    dict_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 dict_ids 启用或者禁用系统字典
#[allow(dead_code)]
pub async fn enable_by_ids_dict(
  dict_ids: Vec<DictId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::enable_by_ids_dict(
    dict_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统字典字段注释
pub async fn get_field_comments_dict(
  options: Option<Options>,
) -> Result<DictFieldComment> {
  
  let comments = dict_dao::get_field_comments_dict(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dict_ids 还原系统字典
#[allow(dead_code)]
pub async fn revert_by_ids_dict(
  dict_ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::revert_by_ids_dict(
    dict_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dict_ids 彻底删除系统字典
#[allow(dead_code)]
pub async fn force_delete_by_ids_dict(
  dict_ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::force_delete_by_ids_dict(
    dict_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统字典 order_by 字段的最大值
pub async fn find_last_order_by_dict(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dict_dao::find_last_order_by_dict(
    options,
  ).await?;
  
  Ok(res)
}
