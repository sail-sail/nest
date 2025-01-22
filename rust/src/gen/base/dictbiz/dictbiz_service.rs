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

use super::dictbiz_model::*;
use super::dictbiz_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DictbizSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找业务字典列表
pub async fn find_all(
  search: Option<DictbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = dictbiz_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找业务字典总数
pub async fn find_count(
  search: Option<DictbizSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = dictbiz_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个业务字典
pub async fn find_one(
  search: Option<DictbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = dictbiz_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务字典
pub async fn find_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let model = dictbiz_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: DictbizInput,
) -> Result<DictbizInput> {
  
  let input = dictbiz_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建业务字典
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DictbizInput>,
  options: Option<Options>,
) -> Result<Vec<DictbizId>> {
  
  let dictbiz_ids = dictbiz_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(dictbiz_ids)
}

/// 业务字典根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: DictbizId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改业务字典
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: DictbizId,
  mut input: DictbizInput,
  options: Option<Options>,
) -> Result<DictbizId> {
  
  let dictbiz_id = dictbiz_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(dictbiz_id)
}

/// 根据 ids 删除业务字典
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = dictbiz_dao::find_all(
    Some(DictbizSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = dictbiz_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dictbiz_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用业务字典
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DictbizId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务字典字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictbizFieldComment> {
  
  let comments = dictbiz_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原业务字典
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除业务字典
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务字典 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dictbiz_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
