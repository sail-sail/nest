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

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao::ns;

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::data_permit_model::*;
use super::data_permit_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DataPermitSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找数据权限列表
pub async fn find_all(
  search: Option<DataPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = data_permit_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找数据权限总数
pub async fn find_count(
  search: Option<DataPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = data_permit_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个数据权限
pub async fn find_one(
  search: Option<DataPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = data_permit_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找数据权限
pub async fn find_by_id(
  id: DataPermitId,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let model = data_permit_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: DataPermitInput,
) -> Result<DataPermitInput> {
  
  let input = data_permit_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建数据权限
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DataPermitInput>,
  options: Option<Options>,
) -> Result<Vec<DataPermitId>> {
  
  let data_permit_ids = data_permit_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(data_permit_ids)
}

/// 数据权限根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: DataPermitId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改数据权限
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: DataPermitId,
  mut input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
  // 不能修改系统记录的系统字段
  let model = data_permit_dao::find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if let Some(model) = model {
    if model.is_sys == 1 {
      // 菜单
      input.menu_id = None;
      input.menu_id_lbl = None;
      // 范围
      input.scope = None;
      input.scope_lbl = None;
    }
  }
  
  let data_permit_id = data_permit_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(data_permit_id)
}

/// 根据 ids 删除数据权限
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = data_permit_dao::find_all(
    Some(DataPermitSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_sys == 1 {
      let err_msg = ns("不能删除系统记录".to_owned(), None).await?;
      return Err(eyre!(err_msg));
    }
  }
  
  let num = data_permit_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取数据权限字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DataPermitFieldComment> {
  
  let comments = data_permit_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据权限
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据权限
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = data_permit_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
