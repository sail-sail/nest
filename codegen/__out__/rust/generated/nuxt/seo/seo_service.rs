
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

use super::seo_model::*;
use super::seo_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut SeoSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找SEO优化列表
pub async fn find_all_seo(
  search: Option<SeoSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let seo_models = seo_dao::find_all_seo(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(seo_models)
}

/// 根据条件查找SEO优化总数
pub async fn find_count_seo(
  search: Option<SeoSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let seo_num = seo_dao::find_count_seo(
    Some(search),
    options,
  ).await?;
  
  Ok(seo_num)
}

/// 根据条件查找第一个SEO优化
pub async fn find_one_seo(
  search: Option<SeoSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let seo_model = seo_dao::find_one_seo(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(seo_model)
}

/// 根据条件查找第一个SEO优化, 如果不存在则抛错
pub async fn find_one_ok_seo(
  search: Option<SeoSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let seo_model = seo_dao::find_one_ok_seo(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(seo_model)
}

/// 根据 id 查找SEO优化
pub async fn find_by_id_seo(
  seo_id: SeoId,
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  let seo_model = seo_dao::find_by_id_seo(
    seo_id,
    options,
  ).await?;
  
  Ok(seo_model)
}

/// 根据 id 查找SEO优化, 如果不存在则抛错
pub async fn find_by_id_ok_seo(
  seo_id: SeoId,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  let seo_model = seo_dao::find_by_id_ok_seo(
    seo_id,
    options,
  ).await?;
  
  Ok(seo_model)
}

/// 根据 ids 查找SEO优化
pub async fn find_by_ids_seo(
  seo_ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let seo_models = seo_dao::find_by_ids_seo(
    seo_ids,
    options,
  ).await?;
  
  Ok(seo_models)
}

/// 根据 ids 查找SEO优化, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_seo(
  seo_ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let seo_models = seo_dao::find_by_ids_ok_seo(
    seo_ids,
    options,
  ).await?;
  
  Ok(seo_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_seo(
  seo_input: SeoInput,
) -> Result<SeoInput> {
  
  let seo_input = seo_dao::set_id_by_lbl_seo(
    seo_input,
  ).await?;
  
  Ok(seo_input)
}

/// 创建SEO优化
#[allow(dead_code)]
pub async fn creates_seo(
  seo_inputs: Vec<SeoInput>,
  options: Option<Options>,
) -> Result<Vec<SeoId>> {
  
  let seo_ids = seo_dao::creates_seo(
    seo_inputs,
    options,
  ).await?;
  
  Ok(seo_ids)
}

/// SEO优化根据 seo_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_seo(
  seo_id: SeoId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = seo_dao::update_tenant_by_id_seo(
    seo_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 seo_id 修改SEO优化
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_seo(
  seo_id: SeoId,
  mut seo_input: SeoInput,
  options: Option<Options>,
) -> Result<SeoId> {
  
  let is_locked = seo_dao::get_is_locked_by_id_seo(
    seo_id,
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 SEO优化";
    return Err(eyre!(err_msg));
  }
  
  let seo_id = seo_dao::update_by_id_seo(
    seo_id,
    seo_input,
    options,
  ).await?;
  
  Ok(seo_id)
}

/// 校验SEO优化是否存在
#[allow(dead_code)]
pub async fn validate_option_seo(
  seo_model: Option<SeoModel>,
) -> Result<SeoModel> {
  
  let seo_model = seo_dao::validate_option_seo(seo_model).await?;
  
  Ok(seo_model)
}

/// 根据 seo_ids 删除SEO优化
#[allow(dead_code)]
pub async fn delete_by_ids_seo(
  seo_ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = seo_dao::find_all_seo(
    Some(SeoSearch {
      ids: Some(seo_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 SEO优化";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = seo_dao::delete_by_ids_seo(
    seo_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 seo_id 设置默认SEO优化
#[allow(dead_code)]
pub async fn default_by_id_seo(
  seo_id: SeoId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = seo_dao::default_by_id_seo(
    seo_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 seo_id 查找SEO优化是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_seo(
  seo_id: SeoId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = seo_dao::get_is_locked_by_id_seo(
    seo_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 seo_ids 锁定或者解锁SEO优化
#[allow(dead_code)]
pub async fn lock_by_ids_seo(
  seo_ids: Vec<SeoId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = seo_dao::lock_by_ids_seo(
    seo_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取SEO优化字段注释
pub async fn get_field_comments_seo(
  options: Option<Options>,
) -> Result<SeoFieldComment> {
  
  let comments = seo_dao::get_field_comments_seo(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 seo_ids 还原SEO优化
#[allow(dead_code)]
pub async fn revert_by_ids_seo(
  seo_ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = seo_dao::revert_by_ids_seo(
    seo_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 seo_ids 彻底删除SEO优化
#[allow(dead_code)]
pub async fn force_delete_by_ids_seo(
  seo_ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = seo_dao::force_delete_by_ids_seo(
    seo_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 SEO优化 order_by 字段的最大值
pub async fn find_last_order_by_seo(
  search: Option<SeoSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = seo_dao::find_last_order_by_seo(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
