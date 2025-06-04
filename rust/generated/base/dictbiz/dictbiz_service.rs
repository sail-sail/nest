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

use crate::base::tenant::tenant_model::TenantId;

use super::dictbiz_model::*;
use super::dictbiz_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DictbizSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找业务字典列表
pub async fn find_all_dictbiz(
  search: Option<DictbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dictbiz_models = dictbiz_dao::find_all_dictbiz(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dictbiz_models)
}

/// 根据条件查找业务字典总数
pub async fn find_count_dictbiz(
  search: Option<DictbizSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dictbiz_num = dictbiz_dao::find_count_dictbiz(
    Some(search),
    options,
  ).await?;
  
  Ok(dictbiz_num)
}

/// 根据条件查找第一个业务字典
pub async fn find_one_dictbiz(
  search: Option<DictbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dictbiz_model = dictbiz_dao::find_one_dictbiz(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dictbiz_model)
}

/// 根据条件查找第一个业务字典, 如果不存在则抛错
pub async fn find_one_ok_dictbiz(
  search: Option<DictbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DictbizModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dictbiz_model = dictbiz_dao::find_one_ok_dictbiz(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dictbiz_model)
}

/// 根据 id 查找业务字典
pub async fn find_by_id_dictbiz(
  dictbiz_id: DictbizId,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let dictbiz_model = dictbiz_dao::find_by_id_dictbiz(
    dictbiz_id,
    options,
  ).await?;
  
  Ok(dictbiz_model)
}

/// 根据 id 查找业务字典, 如果不存在则抛错
pub async fn find_by_id_ok_dictbiz(
  dictbiz_id: DictbizId,
  options: Option<Options>,
) -> Result<DictbizModel> {
  
  let dictbiz_model = dictbiz_dao::find_by_id_ok_dictbiz(
    dictbiz_id,
    options,
  ).await?;
  
  Ok(dictbiz_model)
}

/// 根据 ids 查找业务字典
pub async fn find_by_ids_dictbiz(
  dictbiz_ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  let dictbiz_models = dictbiz_dao::find_by_ids_dictbiz(
    dictbiz_ids,
    options,
  ).await?;
  
  Ok(dictbiz_models)
}

/// 根据 ids 查找业务字典, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_dictbiz(
  dictbiz_ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  let dictbiz_models = dictbiz_dao::find_by_ids_ok_dictbiz(
    dictbiz_ids,
    options,
  ).await?;
  
  Ok(dictbiz_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_dictbiz(
  dictbiz_input: DictbizInput,
) -> Result<DictbizInput> {
  
  let dictbiz_input = dictbiz_dao::set_id_by_lbl_dictbiz(
    dictbiz_input,
  ).await?;
  
  Ok(dictbiz_input)
}

/// 创建业务字典
#[allow(dead_code)]
pub async fn creates_dictbiz(
  dictbiz_inputs: Vec<DictbizInput>,
  options: Option<Options>,
) -> Result<Vec<DictbizId>> {
  
  let dictbiz_ids = dictbiz_dao::creates_dictbiz(
    dictbiz_inputs,
    options,
  ).await?;
  
  Ok(dictbiz_ids)
}

/// 业务字典根据 dictbiz_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_dictbiz(
  dictbiz_id: DictbizId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::update_tenant_by_id_dictbiz(
    dictbiz_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dictbiz_id 修改业务字典
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_dictbiz(
  dictbiz_id: DictbizId,
  mut dictbiz_input: DictbizInput,
  options: Option<Options>,
) -> Result<DictbizId> {
  
  let dictbiz_id = dictbiz_dao::update_by_id_dictbiz(
    dictbiz_id,
    dictbiz_input,
    options.clone(),
  ).await?;
  
  Ok(dictbiz_id)
}

/// 校验业务字典是否存在
#[allow(dead_code)]
pub async fn validate_option_dictbiz(
  dictbiz_model: Option<DictbizModel>,
) -> Result<DictbizModel> {
  
  let dictbiz_model = dictbiz_dao::validate_option_dictbiz(dictbiz_model).await?;
  
  Ok(dictbiz_model)
}

/// 根据 dictbiz_ids 删除业务字典
#[allow(dead_code)]
pub async fn delete_by_ids_dictbiz(
  dictbiz_ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = dictbiz_dao::find_all_dictbiz(
    Some(DictbizSearch {
      ids: Some(dictbiz_ids.clone()),
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
  
  let num = dictbiz_dao::delete_by_ids_dictbiz(
    dictbiz_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dictbiz_id 查找业务字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_dictbiz(
  dictbiz_id: DictbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dictbiz_dao::get_is_enabled_by_id_dictbiz(
    dictbiz_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 dictbiz_ids 启用或者禁用业务字典
#[allow(dead_code)]
pub async fn enable_by_ids_dictbiz(
  dictbiz_ids: Vec<DictbizId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::enable_by_ids_dictbiz(
    dictbiz_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务字典字段注释
pub async fn get_field_comments_dictbiz(
  options: Option<Options>,
) -> Result<DictbizFieldComment> {
  
  let comments = dictbiz_dao::get_field_comments_dictbiz(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dictbiz_ids 还原业务字典
#[allow(dead_code)]
pub async fn revert_by_ids_dictbiz(
  dictbiz_ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::revert_by_ids_dictbiz(
    dictbiz_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dictbiz_ids 彻底删除业务字典
#[allow(dead_code)]
pub async fn force_delete_by_ids_dictbiz(
  dictbiz_ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::force_delete_by_ids_dictbiz(
    dictbiz_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务字典 order_by 字段的最大值
pub async fn find_last_order_by_dictbiz(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dictbiz_dao::find_last_order_by_dictbiz(
    options,
  ).await?;
  
  Ok(res)
}
