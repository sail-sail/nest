
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

#[allow(unused_imports)]
use smol_str::SmolStr;

use color_eyre::eyre::{Result, eyre};
#[allow(unused_imports)]
use tracing::{info, error};

use crate::common::cache::cache_dao;
#[allow(unused_imports)]
use crate::common::util::string::sql_like;
#[allow(unused_imports)]
use crate::common::gql::model::SortOrderEnum;

use crate::common::util::dao::{
  many2many_update,
  ManyOpts,
};

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_id,
  get_auth_tenant_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
  QueryArgs,
  Options,
  FIND_ALL_IDS_LIMIT,
  MAX_SAFE_INTEGER,
  get_find_all_result_limit,
  CountModel,
  UniqueType,
  OrderByModel,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
};
use crate::common::exceptions::service_exception::ServiceException;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::common::dict_detail::dict_detail_dao::get_dict;

use super::seo_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::domain::domain_model::DomainId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&SeoSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 18 * 2);
  
  where_query.push_str(" t.is_deleted=?");
  args.push(is_deleted.into());
  {
    let id = match search {
      Some(item) => item.id.as_ref(),
      None => None,
    };
    if let Some(id) = id {
      where_query.push_str(" and t.id=?");
      args.push(id.into());
    }
  }
  {
    let ids: Option<Vec<SeoId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let tenant_id = {
      let tenant_id = match search {
        Some(item) => item.tenant_id,
        None => None,
      };
      match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "" => None,
          _ => item.into(),
        },
      }
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }
  // 所属域名
  {
    let domain_ids: Option<Vec<DomainId>> = match search {
      Some(item) => item.domain_ids.clone(),
      None => None,
    };
    if let Some(domain_ids) = domain_ids {
      let arg = {
        if domain_ids.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(domain_ids.len());
          for item in domain_ids {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and base_domain.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let domain_ids_is_null: bool = match search {
      Some(item) => item.domain_ids_is_null.unwrap_or(false),
      None => false,
    };
    if domain_ids_is_null {
      where_query.push_str(" and t.domain_ids is null");
    }
  }
  {
    let domain_ids_lbl_like = match search {
      Some(item) => item.domain_ids_lbl_like.clone(),
      None => None,
    };
    if let Some(domain_ids_lbl_like) = domain_ids_lbl_like && !domain_ids_lbl_like.is_empty() {
      where_query.push_str(" and base_domain.lbl like ?");
      args.push(format!("%{}%", sql_like(&domain_ids_lbl_like)).into());
    }
  }
  // 图标
  {
    let ico = match search {
      Some(item) => item.ico.clone(),
      None => None,
    };
    if let Some(ico) = ico {
      where_query.push_str(" and t.ico=?");
      args.push(ico.into());
    }
    let ico_like = match search {
      Some(item) => item.ico_like.clone(),
      None => None,
    };
    if let Some(ico_like) = ico_like && !ico_like.is_empty() {
      where_query.push_str(" and t.ico like ?");
      args.push(format!("%{}%", sql_like(&ico_like)).into());
    }
  }
  // 标题
  {
    let lbl = match search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl) = lbl {
      where_query.push_str(" and t.lbl=?");
      args.push(lbl.into());
    }
    let lbl_like = match search {
      Some(item) => item.lbl_like.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like && !lbl_like.is_empty() {
      where_query.push_str(" and t.lbl like ?");
      args.push(format!("%{}%", sql_like(&lbl_like)).into());
    }
  }
  // 描述
  {
    let description = match search {
      Some(item) => item.description.clone(),
      None => None,
    };
    if let Some(description) = description {
      where_query.push_str(" and t.description=?");
      args.push(description.into());
    }
    let description_like = match search {
      Some(item) => item.description_like.clone(),
      None => None,
    };
    if let Some(description_like) = description_like && !description_like.is_empty() {
      where_query.push_str(" and t.description like ?");
      args.push(format!("%{}%", sql_like(&description_like)).into());
    }
  }
  // 关键词
  {
    let keywords = match search {
      Some(item) => item.keywords.clone(),
      None => None,
    };
    if let Some(keywords) = keywords {
      where_query.push_str(" and t.keywords=?");
      args.push(keywords.into());
    }
    let keywords_like = match search {
      Some(item) => item.keywords_like.clone(),
      None => None,
    };
    if let Some(keywords_like) = keywords_like && !keywords_like.is_empty() {
      where_query.push_str(" and t.keywords like ?");
      args.push(format!("%{}%", sql_like(&keywords_like)).into());
    }
  }
  // 分享图片
  {
    let og_image = match search {
      Some(item) => item.og_image.clone(),
      None => None,
    };
    if let Some(og_image) = og_image {
      where_query.push_str(" and t.og_image=?");
      args.push(og_image.into());
    }
    let og_image_like = match search {
      Some(item) => item.og_image_like.clone(),
      None => None,
    };
    if let Some(og_image_like) = og_image_like && !og_image_like.is_empty() {
      where_query.push_str(" and t.og_image like ?");
      args.push(format!("%{}%", sql_like(&og_image_like)).into());
    }
  }
  // 分享标题
  {
    let og_title = match search {
      Some(item) => item.og_title.clone(),
      None => None,
    };
    if let Some(og_title) = og_title {
      where_query.push_str(" and t.og_title=?");
      args.push(og_title.into());
    }
    let og_title_like = match search {
      Some(item) => item.og_title_like.clone(),
      None => None,
    };
    if let Some(og_title_like) = og_title_like && !og_title_like.is_empty() {
      where_query.push_str(" and t.og_title like ?");
      args.push(format!("%{}%", sql_like(&og_title_like)).into());
    }
  }
  // 分享描述
  {
    let og_description = match search {
      Some(item) => item.og_description.clone(),
      None => None,
    };
    if let Some(og_description) = og_description {
      where_query.push_str(" and t.og_description=?");
      args.push(og_description.into());
    }
    let og_description_like = match search {
      Some(item) => item.og_description_like.clone(),
      None => None,
    };
    if let Some(og_description_like) = og_description_like && !og_description_like.is_empty() {
      where_query.push_str(" and t.og_description like ?");
      args.push(format!("%{}%", sql_like(&og_description_like)).into());
    }
  }
  // 锁定
  {
    let is_locked: Option<Vec<u8>> = match search {
      Some(item) => item.is_locked.clone(),
      None => None,
    };
    if let Some(is_locked) = is_locked {
      let arg = {
        if is_locked.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(is_locked.len());
          for item in is_locked {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.is_locked in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 排序
  {
    let mut order_by = match search {
      Some(item) => item.order_by.unwrap_or_default(),
      None => Default::default(),
    };
    let order_by_gt = order_by[0].take();
    let order_by_lt = order_by[1].take();
    if let Some(order_by_gt) = order_by_gt {
      where_query.push_str(" and t.order_by >= ?");
      args.push(order_by_gt.into());
    }
    if let Some(order_by_lt) = order_by_lt {
      where_query.push_str(" and t.order_by <= ?");
      args.push(order_by_lt.into());
    }
  }
  // 备注
  {
    let rem = match search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query.push_str(" and t.rem=?");
      args.push(rem.into());
    }
    let rem_like = match search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like && !rem_like.is_empty() {
      where_query.push_str(" and t.rem like ?");
      args.push(format!("%{}%", sql_like(&rem_like)).into());
    }
  }
  // 创建人
  {
    let create_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.create_usr_id.clone(),
      None => None,
    };
    if let Some(create_usr_id) = create_usr_id {
      let arg = {
        if create_usr_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(create_usr_id.len());
          for item in create_usr_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.create_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let create_usr_id_is_null: bool = match search {
      Some(item) => item.create_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if create_usr_id_is_null {
      where_query.push_str(" and t.create_usr_id is null");
    }
  }
  {
    let create_usr_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.create_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(create_usr_id_lbl) = create_usr_id_lbl {
      let arg = {
        if create_usr_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(create_usr_id_lbl.len());
          for item in create_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.create_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let create_usr_id_lbl_like = match search {
        Some(item) => item.create_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(create_usr_id_lbl_like) = create_usr_id_lbl_like {
        if !create_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and create_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&create_usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 创建时间
  {
    let mut create_time = match search {
      Some(item) => item.create_time.unwrap_or_default(),
      None => Default::default(),
    };
    let create_time_gt = create_time[0].take();
    let create_time_lt = create_time[1].take();
    if let Some(create_time_gt) = create_time_gt {
      where_query.push_str(" and t.create_time >= ?");
      args.push(create_time_gt.into());
    }
    if let Some(create_time_lt) = create_time_lt {
      where_query.push_str(" and t.create_time <= ?");
      args.push(create_time_lt.into());
    }
  }
  // 更新人
  {
    let update_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.update_usr_id.clone(),
      None => None,
    };
    if let Some(update_usr_id) = update_usr_id {
      let arg = {
        if update_usr_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(update_usr_id.len());
          for item in update_usr_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.update_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let update_usr_id_is_null: bool = match search {
      Some(item) => item.update_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if update_usr_id_is_null {
      where_query.push_str(" and t.update_usr_id is null");
    }
  }
  {
    let update_usr_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.update_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(update_usr_id_lbl) = update_usr_id_lbl {
      let arg = {
        if update_usr_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(update_usr_id_lbl.len());
          for item in update_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.update_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let update_usr_id_lbl_like = match search {
        Some(item) => item.update_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(update_usr_id_lbl_like) = update_usr_id_lbl_like {
        if !update_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and update_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&update_usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 更新时间
  {
    let mut update_time = match search {
      Some(item) => item.update_time.unwrap_or_default(),
      None => Default::default(),
    };
    let update_time_gt = update_time[0].take();
    let update_time_lt = update_time[1].take();
    if let Some(update_time_gt) = update_time_gt {
      where_query.push_str(" and t.update_time >= ?");
      args.push(update_time_gt.into());
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query.push_str(" and t.update_time <= ?");
      args.push(update_time_lt.into());
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&SeoSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let from_query = r#"nuxt_seo t
  left join nuxt_seo_domain on nuxt_seo_domain.seo_id=t.id and nuxt_seo_domain.is_deleted=?
  left join base_domain on nuxt_seo_domain.domain_id=base_domain.id and base_domain.is_deleted=?
  left join (select json_objectagg(nuxt_seo_domain.order_by,base_domain.id) domain_ids,
  json_objectagg(nuxt_seo_domain.order_by,base_domain.lbl) domain_ids_lbl,
  nuxt_seo.id seo_id from nuxt_seo_domain
  inner join base_domain on base_domain.id=nuxt_seo_domain.domain_id
  inner join nuxt_seo on nuxt_seo.id=nuxt_seo_domain.seo_id where nuxt_seo_domain.is_deleted=?
  group by seo_id) _domain on _domain.seo_id=t.id"#.to_owned();
  for _ in 0..3 {
    args.push(is_deleted.into());
  }
  Ok(from_query)
}

// MARK: find_all_seo
/// 根据搜索条件和分页查找SEO优化列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_seo(
  search: Option<SeoSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let table = get_table_name_seo();
  let method = "find_all_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(page) = &page {
      msg += &format!(" page: {page:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids_limit = options
    .as_ref()
    .and_then(|x| x.get_ids_limit())
    .unwrap_or(FIND_ALL_IDS_LIMIT);
  
  if let Some(search) = &search {
    if let Some(id) = &search.id && id.is_empty() {
      return Ok(vec![]);
    }
    if let Some(ids) = &search.ids && ids.is_empty() {
      return Ok(vec![]);
    }
  }
  // 所属域名
  if let Some(search) = &search && let Some(domain_ids) = &search.domain_ids {
    let len = domain_ids.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.domain_ids.length > {ids_limit}"));
    }
  }
  // 锁定
  if let Some(search) = &search && let Some(is_locked) = &search.is_locked {
    let len = is_locked.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_locked.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && let Some(create_usr_id) = &search.create_usr_id {
    let len = create_usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && let Some(update_usr_id) = &search.update_usr_id {
    let len = update_usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  #[allow(unused_variables)]
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  
  if !sort.iter().any(|item| item.prop == "order_by") {
    sort.push(SortInput {
      prop: "order_by".into(),
      order: SortOrderEnum::Asc,
    });
  }
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Asc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let is_result_limit = page.as_ref()
    .and_then(|item| item.is_result_limit)
    .unwrap_or(true);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,max(domain_ids) domain_ids
  ,max(domain_ids_lbl) domain_ids_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let cache_key1 = format!("dao.sql.{table}");
  let cache_key2 = crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes());
  
  let res = {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: Vec<SeoModel>;
      let res = serde_json::from_str::<Vec<SeoModel>>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = vec![];
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  };
  
  let mut res: Vec<SeoModel> = if let Some(res) = res {
    res
  } else {
    let res = query(
      sql,
      args,
      options,
    ).await?;
    let str = serde_json::to_string(&res)?;
    cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    res
  };
  
  let len = res.len();
  let result_limit_num = get_find_all_result_limit();
  
  if is_result_limit && len > result_limit_num {
    return Err(eyre!(
      ServiceException {
        message: format!("{table}.{method}: result length {len} > {result_limit_num}").into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let dict_vec = get_dict(&[
    "is_locked",
  ]).await?;
  let [
    is_locked_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 锁定
    model.is_locked_lbl = {
      is_locked_dict
        .iter()
        .find(|item| item.val == model.is_locked.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_locked.to_string().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_seo
/// 根据条件查找SEO优化总数
pub async fn find_count_seo(
  search: Option<SeoSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_seo();
  let method = "find_count_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
  }
  // 所属域名
  if let Some(search) = &search && search.domain_ids.is_some() {
    let len = search.domain_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.domain_ids.length > {ids_limit}"));
    }
  }
  // 锁定
  if let Some(search) = &search && search.is_locked.is_some() {
    let len = search.is_locked.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_locked.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && search.create_usr_id.is_some() {
    let len = search.create_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && search.update_usr_id.is_some() {
    let len = search.update_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select count(1) total from(select 1 from {from_query} where {where_query} group by t.id) t"#);
  
  let args = args.into();
  
  let cache_key1 = format!("dao.sql.{table}");
  let cache_key2 = crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes());
  
  let total = {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: u64;
      let res = serde_json::from_str::<u64>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = 0;
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  };
  
  let total: u64 = if let Some(total) = total {
    total
  } else {
    let options = Options::from(options)
      .set_is_debug(Some(false));
    let options = Some(options);
    
    let res: Option<CountModel> = query_one(
      sql,
      args,
      options,
    ).await?;
    let total = res
      .map(|item| item.total)
      .unwrap_or_default();
    let str = serde_json::to_string(&total)?;
    cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    total
  };
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}

// MARK: get_field_comments_seo
/// 获取SEO优化字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_seo(
  _options: Option<Options>,
) -> Result<SeoFieldComment> {
  
  let mut field_comments = SeoFieldComment {
    id: "ID".into(),
    domain_ids: "所属域名".into(),
    domain_ids_lbl: "所属域名".into(),
    ico: "图标".into(),
    lbl: "标题".into(),
    description: "描述".into(),
    keywords: "关键词".into(),
    og_image: "分享图片".into(),
    og_title: "分享标题".into(),
    og_description: "分享描述".into(),
    is_locked: "锁定".into(),
    is_locked_lbl: "锁定".into(),
    order_by: "排序".into(),
    rem: "备注".into(),
    create_usr_id: "创建人".into(),
    create_usr_id_lbl: "创建人".into(),
    create_time: "创建时间".into(),
    create_time_lbl: "创建时间".into(),
    update_usr_id: "更新人".into(),
    update_usr_id_lbl: "更新人".into(),
    update_time: "更新时间".into(),
    update_time_lbl: "更新时间".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_seo
/// 根据条件查找第一个SEO优化, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_seo(
  search: Option<SeoSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  let table = get_table_name_seo();
  let method = "find_one_ok_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let seo_model = find_one_seo(
    search,
    sort,
    options,
  ).await?;
  
  let Some(seo_model) = seo_model else {
    let err_msg = "此 SEO优化 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(seo_model)
}

// MARK: find_one_seo
/// 根据条件查找第一个SEO优化
#[allow(dead_code)]
pub async fn find_one_seo(
  search: Option<SeoSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  let table = get_table_name_seo();
  let method = "find_one_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search && search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let page = Some(PageInput {
    pg_offset: Some(0),
    pg_size: Some(1),
    is_result_limit: Some(true),
  });
  
  let res = find_all_seo(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<SeoModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_seo
/// 根据 id 查找SEO优化, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  let table = get_table_name_seo();
  let method = "find_by_id_ok_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let seo_model = find_by_id_seo(
    id,
    options,
  ).await?;
  
  let Some(seo_model) = seo_model else {
    let err_msg = SmolStr::new("此 SEO优化 已被删除");
    error!(
      "{req_id} {err_msg} id: {id:?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: err_msg,
      trace: true,
      ..Default::default()
    }));
  };
  
  Ok(seo_model)
}

// MARK: find_by_id_seo
/// 根据 id 查找SEO优化
pub async fn find_by_id_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  let table = get_table_name_seo();
  let method = "find_by_id_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if id.is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = SeoSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let seo_model = find_one_seo(
    search,
    None,
    options,
  ).await?;
  
  Ok(seo_model)
}

// MARK: find_by_ids_ok_seo
/// 根据 ids 查找SEO优化, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let table = get_table_name_seo();
  let method = "find_by_ids_ok_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let len = ids.len();
  
  if len > FIND_ALL_IDS_LIMIT {
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let seo_models = find_by_ids_seo(
    ids.clone(),
    options,
  ).await?;
  
  if seo_models.len() != len {
    let err_msg = SmolStr::new("此 SEO优化 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let seo_models = ids
    .into_iter()
    .map(|id| {
      let model = seo_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 SEO优化 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<SeoModel>>>()?;
  
  Ok(seo_models)
}

// MARK: find_by_ids_seo
/// 根据 ids 查找SEO优化
#[allow(dead_code)]
pub async fn find_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let table = get_table_name_seo();
  let method = "find_by_ids_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let len = ids.len();
  
  if len > FIND_ALL_IDS_LIMIT {
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let search = SeoSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let seo_models = find_all_seo(
    search,
    None,
    None,
    options,
  ).await?;
  
  let seo_models = ids
    .into_iter()
    .filter_map(|id| {
      seo_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<SeoModel>>();
  
  Ok(seo_models)
}

// MARK: exists_seo
/// 根据搜索条件判断SEO优化是否存在
#[allow(dead_code)]
pub async fn exists_seo(
  search: Option<SeoSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_seo();
  let method = "exists_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
  }
  // 所属域名
  if let Some(search) = &search && search.domain_ids.is_some() {
    let len = search.domain_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.domain_ids.length > {ids_limit}"));
    }
  }
  // 锁定
  if let Some(search) = &search && search.is_locked.is_some() {
    let len = search.is_locked.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_locked.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && search.create_usr_id.is_some() {
    let len = search.create_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && search.update_usr_id.is_some() {
    let len = search.update_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select exists(select 1 from {from_query} where {where_query} group by t.id)"#);
  
  let args = args.into();
  
  let cache_key1 = format!("dao.sql.{table}");
  let cache_key2 = crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes());
  
  let exists_res = {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: bool;
      let res = serde_json::from_str::<bool>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = false;
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  };
  
  let exists_res: bool = if let Some(exists_res) = exists_res {
    exists_res
  } else {
    let options = Options::from(options)
      .set_is_debug(Some(false));
    let options = Some(options);
    
    let res: Option<(bool,)> = query_one(
      sql,
      args,
      options,
    ).await?;
    let exists_res = res
      .map(|item| item.0)
      .unwrap_or_default();
    let str = serde_json::to_string(&exists_res)?;
    cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    exists_res
  };
  
  Ok(exists_res)
}

// MARK: exists_by_id_seo
/// 根据 id 判断SEO优化是否存在
#[allow(dead_code)]
pub async fn exists_by_id_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_seo();
  let method = "exists_by_id_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = SeoSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_seo(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_seo
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_seo(
  search: SeoSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let table = get_table_name_seo();
  let method = "find_by_unique_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {search:?}");
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if let Some(id) = search.id {
    let model = find_by_id_seo(
      id,
      options,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code, unused_variables)]
pub fn equals_by_unique(
  input: &SeoInput,
  model: &SeoModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_seo
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_seo(
  input: SeoInput,
  model: SeoModel,
  options: Option<Options>,
) -> Result<Option<SeoId>> {
  
  let table = get_table_name_seo();
  let method = "check_by_unique_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    msg += &format!(" model: {model:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let is_equals = equals_by_unique(
    &input,
    &model,
    options.as_ref(),
  );
  if !is_equals {
    return Ok(None);
  }
  
  let unique_type = options
    .as_ref()
    .and_then(|item| item.get_unique_type())
    .unwrap_or_default();
  
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let id = update_by_id_seo(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "SEO优化 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_seo
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_seo(
  input: SeoInput,
) -> Result<SeoInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "is_locked",
  ]).await?;
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[0];
    if let Some(is_locked_lbl) = input.is_locked_lbl.clone() {
      input.is_locked = is_locked_dict
        .iter()
        .find(|item| {
          item.lbl == is_locked_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 所属域名
  if input.domain_ids_lbl.is_some() && input.domain_ids.is_none() {
    input.domain_ids_lbl = input.domain_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| SmolStr::new(item.trim()))
        .filter(|item| !item.is_empty())
        .collect::<Vec<SmolStr>>()
    );
    input.domain_ids_lbl = input.domain_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<SmolStr>>()
    });
    let mut models = vec![];
    for lbl in input.domain_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::domain::domain_dao::find_one_domain(
        crate::base::domain::domain_model::DomainSearch {
          lbl: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        Some(Options::new().set_is_debug(Some(false))),
      ).await?;
      if let Some(model) = model {
        models.push(model);
      }
    }
    input.domain_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DomainId>>()
      .into();
  }
  
  // 锁定
  if
    input.is_locked_lbl.is_some() && !input.is_locked_lbl.as_ref().unwrap().is_empty()
    && input.is_locked.is_none()
  {
    let is_locked_dict = &dict_vec[0];
    let dict_model = is_locked_dict.iter().find(|item| {
      item.lbl == input.is_locked_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.is_locked = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_locked_lbl.is_none() || input.is_locked_lbl.as_ref().unwrap().is_empty())
    && input.is_locked.is_some()
  {
    let is_locked_dict = &dict_vec[0];
    let dict_model = is_locked_dict.iter().find(|item| {
      item.val == input.is_locked.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.is_locked_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_seo
/// 批量创建SEO优化并返回
#[allow(dead_code)]
pub async fn creates_return_seo(
  inputs: Vec<SeoInput>,
  options: Option<Options>,
) -> Result<Vec<SeoModel>> {
  
  let table = get_table_name_seo();
  let method = "creates_return_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs.clone(),
    options,
  ).await?;
  
  let models_seo = find_by_ids_seo(
    ids,
    options,
  ).await?;
  
  Ok(models_seo)
}

// MARK: creates_seo
/// 批量创建SEO优化
pub async fn creates_seo(
  inputs: Vec<SeoInput>,
  options: Option<Options>,
) -> Result<Vec<SeoId>> {
  
  let table = get_table_name_seo();
  let method = "creates_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 批量创建SEO优化
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<SeoInput>,
  options: Option<Options>,
) -> Result<Vec<SeoId>> {
  
  let table = get_table_name_seo();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<SeoId> = vec![];
  let mut inputs2: Vec<SeoInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_seo(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<SeoId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_seo(
          input.clone(),
          old_model,
          Some(options),
        ).await?;
        
        if id.is_some() {
          break;
        }
      }
      if let Some(id) = id {
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
  }
  
  if inputs2.is_empty() {
    return Ok(ids2);
  }
    
  let mut args = QueryArgs::new();
  let mut sql_fields = String::with_capacity(80 * 18 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 图标
  sql_fields += ",ico";
  // 标题
  sql_fields += ",lbl";
  // 描述
  sql_fields += ",description";
  // 关键词
  sql_fields += ",keywords";
  // 分享图片
  sql_fields += ",og_image";
  // 分享标题
  sql_fields += ",og_title";
  // 分享描述
  sql_fields += ",og_description";
  // 锁定
  sql_fields += ",is_locked";
  // 排序
  sql_fields += ",order_by";
  // 备注
  sql_fields += ",rem";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 18 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: SeoId = get_short_uuid().into();
    ids2.push(id);
    
    inputs2_ids.push(id);
    
    sql_values += "(?";
    args.push(id.into());
    
    if !is_silent_mode {
      if let Some(create_time) = input.create_time {
        sql_values += ",?";
        args.push(create_time.into());
      } else if input.create_time_save_null == Some(true) {
        sql_values += ",null";
      } else {
        sql_values += ",?";
        args.push(get_now().into());
      }
    } else if let Some(create_time) = input.create_time {
      sql_values += ",?";
      args.push(create_time.into());
    } else {
      sql_values += ",null";
    }
    
    if let Some(update_time) = input.update_time {
      sql_values += ",?";
      args.push(update_time.into());
    } else {
      sql_values += ",null";
    }
    
    if !is_silent_mode {
      if input.create_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_lbl = SmolStr::new("");
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options,
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      } else if input.create_usr_id.is_none_or(|s| s.is_empty()) {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id;
        let mut usr_lbl = SmolStr::new("");
        let usr_model = find_by_id_usr(
          usr_id.unwrap(),
          options,
        ).await?;
        if let Some(usr_model) = usr_model {
          usr_lbl = usr_model.lbl;
        } else {
          usr_id = None;
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      }
    } else {
      if let Some(create_usr_id) = input.create_usr_id {
        sql_values += ",?";
        args.push(create_usr_id.into());
      } else {
        sql_values += ",default";
      }
      if let Some(create_usr_id_lbl) = input.create_usr_id_lbl {
        sql_values += ",?";
        args.push(create_usr_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    }
    
    if let Some(update_usr_id) = input.update_usr_id {
      sql_values += ",?";
      args.push(update_usr_id.into());
    } else {
      sql_values += ",default";
    }
    
    if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
      sql_values += ",?";
      args.push(update_usr_id_lbl.into());
    } else {
      sql_values += ",default";
    }
    
    if let Some(tenant_id) = input.tenant_id {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else if let Some(tenant_id) = get_auth_tenant_id() {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else {
      sql_values += ",default";
    }
    // 图标
    if let Some(ico) = input.ico {
      sql_values += ",?";
      args.push(ico.into());
    } else {
      sql_values += ",default";
    }
    // 标题
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
    } else {
      sql_values += ",default";
    }
    // 描述
    if let Some(description) = input.description {
      sql_values += ",?";
      args.push(description.into());
    } else {
      sql_values += ",default";
    }
    // 关键词
    if let Some(keywords) = input.keywords {
      sql_values += ",?";
      args.push(keywords.into());
    } else {
      sql_values += ",default";
    }
    // 分享图片
    if let Some(og_image) = input.og_image {
      sql_values += ",?";
      args.push(og_image.into());
    } else {
      sql_values += ",default";
    }
    // 分享标题
    if let Some(og_title) = input.og_title {
      sql_values += ",?";
      args.push(og_title.into());
    } else {
      sql_values += ",default";
    }
    // 分享描述
    if let Some(og_description) = input.og_description {
      sql_values += ",?";
      args.push(og_description.into());
    } else {
      sql_values += ",default";
    }
    // 锁定
    if let Some(is_locked) = input.is_locked {
      sql_values += ",?";
      args.push(is_locked.into());
    } else {
      sql_values += ",default";
    }
    // 排序
    if let Some(order_by) = input.order_by {
      sql_values += ",?";
      args.push(order_by.into());
    } else {
      sql_values += ",default";
    }
    // 备注
    if let Some(rem) = input.rem {
      sql_values += ",?";
      args.push(rem.into());
    } else {
      sql_values += ",default";
    }
    
    sql_values.push(')');
    if i < inputs2_len - 1 {
      sql_values.push(',');
    }
    
  }
  
  let sql = format!("insert into {table} ({sql_fields}) values {sql_values}");
  
  let args: Vec<_> = args.into();
  
  del_cache_seo().await?;
  
  let affected_rows = execute(
    sql,
    args,
    options,
  ).await?;
  
  del_cache_seo().await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  for (i, input) in inputs2
    .into_iter()
    .enumerate()
  {
    let id = inputs2_ids.get(i).unwrap().clone();
    
    // 所属域名
    if let Some(domain_ids) = input.domain_ids {
      many2many_update(
        id.into(),
        domain_ids
          .into_iter()
          .map(|item| item.into())
          .collect(),
        ManyOpts {
          r#mod: "nuxt",
          table: "seo_domain",
          column1: "seo_id",
          column2: "domain_id",
        },
      ).await?;
    }
  }
  
  Ok(ids2)
}

// MARK: create_return_seo
/// 创建SEO优化并返回
#[allow(dead_code)]
pub async fn create_return_seo(
  #[allow(unused_mut)]
  mut input: SeoInput,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  let id = create_seo(
    input.clone(),
    options,
  ).await?;
  
  let model_seo = find_by_id_seo(
    id,
    options,
  ).await?;
  
  let model_seo = match model_seo {
    Some(model) => model,
    None => {
      let err_msg = "create_return_seo: model_seo.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_seo)
}

// MARK: create_seo
/// 创建SEO优化
#[allow(dead_code)]
pub async fn create_seo(
  #[allow(unused_mut)]
  mut input: SeoInput,
  options: Option<Options>,
) -> Result<SeoId> {
  
  let table = get_table_name_seo();
  let method = "create_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    vec![input],
    options,
  ).await?;
  
  if ids.is_empty() {
    return Err(eyre!("_creates: Create failed in dao: {table}"));
  }
  let id = ids[0].clone();
  
  Ok(id)
}

// MARK: update_tenant_by_id_seo
/// SEO优化根据id修改租户id
pub async fn update_tenant_by_id_seo(
  id: SeoId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_seo();
  let method = "update_tenant_by_id_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    msg += &format!(" tenant_id: {tenant_id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

// MARK: update_by_id_seo
/// 根据 id 修改SEO优化
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_seo(
  id: SeoId,
  mut input: SeoInput,
  options: Option<Options>,
) -> Result<SeoId> {
  
  let table = get_table_name_seo();
  let method = "update_by_id_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let old_model = find_by_id_seo(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 SEO优化 已被删除";
      return Err(eyre!(err_msg));
    }
  };
  
  if !is_silent_mode {
    info!(
      "{} {}.{}: {}",
      get_req_id(),
      table,
      method,
      serde_json::to_string(&old_model)?,
    );
  }
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique_seo(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<SeoModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "SEO优化 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 18 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 图标
  if let Some(ico) = input.ico.clone() {
    field_num += 1;
    sql_fields += "ico=?,";
    args.push(ico.into());
  }
  // 标题
  if let Some(lbl) = input.lbl.clone() {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 描述
  if let Some(description) = input.description.clone() {
    field_num += 1;
    sql_fields += "description=?,";
    args.push(description.into());
  }
  // 关键词
  if let Some(keywords) = input.keywords.clone() {
    field_num += 1;
    sql_fields += "keywords=?,";
    args.push(keywords.into());
  }
  // 分享图片
  if let Some(og_image) = input.og_image.clone() {
    field_num += 1;
    sql_fields += "og_image=?,";
    args.push(og_image.into());
  }
  // 分享标题
  if let Some(og_title) = input.og_title.clone() {
    field_num += 1;
    sql_fields += "og_title=?,";
    args.push(og_title.into());
  }
  // 分享描述
  if let Some(og_description) = input.og_description.clone() {
    field_num += 1;
    sql_fields += "og_description=?,";
    args.push(og_description.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    field_num += 1;
    sql_fields += "is_locked=?,";
    args.push(is_locked.into());
  }
  // 排序
  if let Some(order_by) = input.order_by {
    field_num += 1;
    sql_fields += "order_by=?,";
    args.push(order_by.into());
  }
  // 备注
  if let Some(rem) = input.rem.clone() {
    field_num += 1;
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  
  // 所属域名
  if input.domain_ids.is_some() {
    field_num += 1;
  }
  
  if field_num > 0 {
    del_cache_seo().await?;
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = SmolStr::new("");
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options,
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
        if !usr_id_lbl.is_empty() {
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      } else if input.update_usr_id.is_some_and(
        |s| !s.is_empty()
      ) {
        let mut usr_id = input.update_usr_id;
        let mut usr_id_lbl = SmolStr::new("");
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options,
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      }
    } else {
      if input.update_usr_id.is_some_and(
        |s| !s.is_empty()
      ) {
        let usr_id = input.update_usr_id;
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
      }
      if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
        sql_fields += "update_usr_id=?,";
        args.push(update_usr_id_lbl.into());
      }
    }
    if !is_silent_mode && !is_creating {
      if let Some(update_time) = input.update_time {
        sql_fields += "update_time=?,";
        args.push(update_time.into());
      } else {
        sql_fields += "update_time=?,";
        args.push(get_now().into());
      }
    } else if let Some(update_time) = input.update_time {
      sql_fields += "update_time=?,";
      args.push(update_time.into());
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
    del_cache_seo().await?;
    
  }
  
  // 所属域名
  if let Some(domain_ids) = input.domain_ids {
    many2many_update(
      id.into(),
      domain_ids
        .into_iter()
        .map(|item| item.into())
        .collect(),
      ManyOpts {
        r#mod: "nuxt",
        table: "seo_domain",
        column1: "seo_id",
        column2: "domain_id",
      },
    ).await?;
  }
  
  // 图标
  if let Some(ico) = input.ico.as_ref() && ico != &old_model.ico {
    crate::common::oss::oss_dao::delete_object(
      old_model.ico.as_str(),
    ).await?;
  }
  
  // 分享图片
  if let Some(og_image) = input.og_image.as_ref() && og_image != &old_model.og_image {
    crate::common::oss::oss_dao::delete_object(
      old_model.og_image.as_str(),
    ).await?;
  }
  
  Ok(id)
}

// MARK: update_by_id_return_seo
/// 根据 id 更新SEO优化, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_seo(
  id: SeoId,
  input: SeoInput,
  options: Option<Options>,
) -> Result<SeoModel> {
  
  update_by_id_seo(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_seo(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "SEO优化 update_by_id_return_seo id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_seo();
  vec![
    table,
    "base_domain",
  ]
}

// MARK: del_cache_seo
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_seo() -> Result<()> {
  
  let cache_key1s = get_cache_tables();
  
  let cache_key1s = cache_key1s
    .into_iter()
    .map(|x|
      SmolStr::new(format!("dao.sql.{x}"))
    )
    .collect::<Vec<SmolStr>>();
  
  let cache_key1s_str = cache_key1s
    .iter()
    .map(|item| item.as_str())
    .collect::<Vec<&str>>();
  
  del_caches(
    cache_key1s_str.as_slice(),
  ).await?;
  
  Ok(())
}

// MARK: delete_by_ids_seo
/// 根据 ids 删除SEO优化
#[allow(unused_variables)]
pub async fn delete_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_seo();
  let method = "delete_by_ids_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  if ids.len() as u64 > MAX_SAFE_INTEGER {
    return Err(eyre!("ids.len(): {} > MAX_SAFE_INTEGER", ids.len()));
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  del_cache_seo().await?;
  
  let old_models = find_by_ids_ok_seo(
    ids.clone(),
    options,
  ).await?;
  
  let mut num = 0;
  for old_model in old_models {
    
    let id = old_model.id;
    
    if !is_silent_mode {
      info!(
        "{} {}.{}: {}",
        get_req_id(),
        table,
        method,
        serde_json::to_string(&old_model)?,
      );
    }
    
    let mut args = QueryArgs::new();
    
    let mut sql_fields = String::with_capacity(30);
    sql_fields.push_str("is_deleted=1,");
    let mut usr_id = get_auth_id();
    let mut usr_lbl = SmolStr::new("");
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.unwrap(),
        options,
      ).await?;
      if let Some(usr_model) = usr_model {
        usr_lbl = usr_model.lbl;
      } else {
        usr_id = None;
      }
    }
    
    if !is_silent_mode && !is_creating && let Some(usr_id) = usr_id {
      sql_fields.push_str("delete_usr_id=?,");
      args.push(usr_id.into());
    }
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_usr_id_lbl=?,");
      args.push(usr_lbl.into());
    }
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_time=?,");
      args.push(get_now().into());
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql = format!("update {table} set {sql_fields} where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    {
      let domain_ids = old_model.domain_ids.clone();
      if !domain_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update nuxt_seo_domain set is_deleted=1 where seo_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(domain_ids.len());
          for item in domain_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" domain_id in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=0");
        let sql = sql;
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options,
        ).await?;
      }
    }
  }
  
  del_cache_seo().await?;
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  del_cache_seo().await?;
  
  Ok(num)
}

// MARK: get_is_locked_by_id_seo
/// 根据 id 查找SEO优化是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id_seo(
  id: SeoId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_seo(
    id,
    options,
  ).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

// MARK: lock_by_ids_seo
/// 根据 ids 锁定或者解锁SEO优化
pub async fn lock_by_ids_seo(
  ids: Vec<SeoId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_seo();
  let method = "lock_by_ids_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    msg += &format!(" is_locked: {is_locked:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  del_cache_seo().await?;
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_locked=? where id=? limit 1");
    
    args.push(is_locked.into());
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  del_cache_seo().await?;
  
  Ok(num)
}

// MARK: revert_by_ids_seo
/// 根据 ids 还原SEO优化
pub async fn revert_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_seo();
  let method = "revert_by_ids_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  del_cache_seo().await?;
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_seo(
      SeoSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_seo(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: SeoInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_seo(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<SeoModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "SEO优化 重复";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    {
      let domain_ids = old_model.domain_ids.clone();
      if !domain_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update nuxt_seo_domain set is_deleted=0 where seo_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(domain_ids.len());
          for item in domain_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" domain_id in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=1");
        let sql = sql;
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options,
        ).await?;
      }
    }
    
  }
  
  del_cache_seo().await?;
  
  Ok(num)
}

// MARK: force_delete_by_ids_seo
/// 根据 ids 彻底删除SEO优化
#[allow(unused_variables)]
pub async fn force_delete_by_ids_seo(
  ids: Vec<SeoId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_seo();
  let method = "force_delete_by_ids_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  del_cache_seo().await?;
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_one_seo(
      Some(SeoSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }),
      None,
      options,
    ).await?;
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    if !is_silent_mode {
      info!(
        "{} {}.{}: {}",
        get_req_id(),
        table,
        method,
        serde_json::to_string(&old_model)?,
      );
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!("delete from {table} where id=? and is_deleted=1 limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    {
      let domain_ids = old_model.domain_ids.clone();
      if !domain_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from nuxt_seo_domain where seo_id=? and".to_owned();
        args.push(id.into());
        let mut items = Vec::with_capacity(domain_ids.len());
        for item in domain_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" domain_id in (");
        sql.push_str(&items.join(","));
        sql.push(')');
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options,
        ).await?;
      }
    }
    
    // 图标
    crate::common::oss::oss_dao::delete_object(
      old_model.ico.as_str(),
    ).await?;
    
    // 分享图片
    crate::common::oss::oss_dao::delete_object(
      old_model.og_image.as_str(),
    ).await?;
  }
  
  del_cache_seo().await?;
  
  Ok(num)
}

// MARK: find_last_order_by_seo
/// 查找 SEO优化 order_by 字段的最大值
pub async fn find_last_order_by_seo(
  search: Option<SeoSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_seo();
  let method = "find_last_order_by_seo";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let msg = format!("{table}.{method}:");
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select f.order_by from (select t.order_by
  from {from_query} where {where_query} group by t.id order by t.order_by desc limit 1) f"#);
  
  let args: Vec<_> = args.into();
  
  let cache_key1 = format!("dao.sql.{table}");
  let cache_key2 = crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes());
  
  let order_by = {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: u32;
      let res = serde_json::from_str::<u32>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = 0;
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  };
  
  let order_by: u32 = if let Some(order_by) = order_by {
    order_by
  } else {
    let model = query_one::<OrderByModel>(
      sql,
      args,
      options,
    ).await?;
    let order_by = {
      if let Some(model) = model {
        model.order_by
      } else {
        0
      }
    };
    let str = serde_json::to_string(&order_by)?;
    cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    order_by
  };
  
  Ok(order_by)
}

// MARK: validate_option_seo
/// 校验SEO优化是否存在
#[allow(dead_code)]
pub async fn validate_option_seo(
  model: Option<SeoModel>,
) -> Result<SeoModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("SEO优化不存在");
      error!(
        "{req_id} {err_msg}",
        req_id = get_req_id(),
      );
      return Err(eyre!(
        ServiceException {
          message: err_msg,
          trace: true,
          ..Default::default()
        },
      ));
    },
  };
  
  Ok(model)
}
