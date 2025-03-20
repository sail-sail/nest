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

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::dictbiz_detail_model::*;
use super::dictbiz_detail_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DictbizDetailSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找业务字典明细列表
pub async fn find_all(
  search: Option<DictbizDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictbizDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dictbiz_detail_models = dictbiz_detail_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dictbiz_detail_models)
}

/// 根据条件查找业务字典明细总数
pub async fn find_count(
  search: Option<DictbizDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dictbiz_detail_num = dictbiz_detail_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(dictbiz_detail_num)
}

/// 根据条件查找第一个业务字典明细
pub async fn find_one(
  search: Option<DictbizDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictbizDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dictbiz_detail_model = dictbiz_detail_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dictbiz_detail_model)
}

/// 根据 id 查找业务字典明细
pub async fn find_by_id(
  dictbiz_detail_id: DictbizDetailId,
  options: Option<Options>,
) -> Result<Option<DictbizDetailModel>> {
  
  let dictbiz_detail_model = dictbiz_detail_dao::find_by_id(
    dictbiz_detail_id,
    options,
  ).await?;
  
  Ok(dictbiz_detail_model)
}

/// 根据 dictbiz_detail_ids 查找业务字典明细
pub async fn find_by_ids(
  dictbiz_detail_ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<Vec<DictbizDetailModel>> {
  
  let dictbiz_detail_models = dictbiz_detail_dao::find_by_ids(
    dictbiz_detail_ids,
    options,
  ).await?;
  
  Ok(dictbiz_detail_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  dictbiz_detail_input: DictbizDetailInput,
) -> Result<DictbizDetailInput> {
  
  let dictbiz_detail_input = dictbiz_detail_dao::set_id_by_lbl(
    dictbiz_detail_input,
  ).await?;
  
  Ok(dictbiz_detail_input)
}

/// 创建业务字典明细
#[allow(dead_code)]
pub async fn creates(
  dictbiz_detail_inputs: Vec<DictbizDetailInput>,
  options: Option<Options>,
) -> Result<Vec<DictbizDetailId>> {
  
  let dictbiz_detail_ids = dictbiz_detail_dao::creates(
    dictbiz_detail_inputs,
    options,
  ).await?;
  
  Ok(dictbiz_detail_ids)
}

/// 业务字典明细根据 dictbiz_detail_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  dictbiz_detail_id: DictbizDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_detail_dao::update_tenant_by_id(
    dictbiz_detail_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dictbiz_detail_id 修改业务字典明细
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  dictbiz_detail_id: DictbizDetailId,
  mut dictbiz_detail_input: DictbizDetailInput,
  options: Option<Options>,
) -> Result<DictbizDetailId> {
  
  let dictbiz_detail_id = dictbiz_detail_dao::update_by_id(
    dictbiz_detail_id,
    dictbiz_detail_input,
    options.clone(),
  ).await?;
  
  Ok(dictbiz_detail_id)
}

/// 校验业务字典明细是否存在
#[allow(dead_code)]
pub async fn validate_option(
  dictbiz_detail_model: Option<DictbizDetailModel>,
) -> Result<DictbizDetailModel> {
  
  let dictbiz_detail_model = dictbiz_detail_dao::validate_option(dictbiz_detail_model).await?;
  
  Ok(dictbiz_detail_model)
}

/// 根据 dictbiz_detail_ids 删除业务字典明细
#[allow(dead_code)]
pub async fn delete_by_ids(
  dictbiz_detail_ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = dictbiz_detail_dao::find_all(
    Some(DictbizDetailSearch {
      ids: Some(dictbiz_detail_ids.clone()),
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
  
  let num = dictbiz_detail_dao::delete_by_ids(
    dictbiz_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dictbiz_detail_id 查找业务字典明细是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  dictbiz_detail_id: DictbizDetailId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dictbiz_detail_dao::get_is_enabled_by_id(
    dictbiz_detail_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 dictbiz_detail_ids 启用或者禁用业务字典明细
#[allow(dead_code)]
pub async fn enable_by_ids(
  dictbiz_detail_ids: Vec<DictbizDetailId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_detail_dao::enable_by_ids(
    dictbiz_detail_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务字典明细字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictbizDetailFieldComment> {
  
  let comments = dictbiz_detail_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dictbiz_detail_ids 还原业务字典明细
#[allow(dead_code)]
pub async fn revert_by_ids(
  dictbiz_detail_ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_detail_dao::revert_by_ids(
    dictbiz_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dictbiz_detail_ids 彻底删除业务字典明细
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  dictbiz_detail_ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_detail_dao::force_delete_by_ids(
    dictbiz_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务字典明细 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dictbiz_detail_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
