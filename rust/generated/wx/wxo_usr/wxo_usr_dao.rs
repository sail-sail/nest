#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use color_eyre::eyre::{Result, eyre};
#[allow(unused_imports)]
use tracing::{info, error};
#[allow(unused_imports)]
use crate::common::util::string::sql_like;
#[allow(unused_imports)]
use crate::common::gql::model::SortOrderEnum;

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
  CountModel,
  UniqueType,
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

use super::wxo_usr_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxoUsrSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 19 * 2);
  
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
    let ids: Option<Vec<WxoUsrId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          items.join(",")
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
        Some(item) => item.tenant_id.clone(),
        None => None,
      };
      let tenant_id = match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      tenant_id
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }
  // 昵称
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
    if let Some(lbl_like) = lbl_like {
      where_query.push_str(" and t.lbl like ?");
      args.push(format!("%{}%", sql_like(&lbl_like)).into());
    }
  }
  // 头像
  {
    let head_img = match search {
      Some(item) => item.head_img.clone(),
      None => None,
    };
    if let Some(head_img) = head_img {
      where_query.push_str(" and t.head_img=?");
      args.push(head_img.into());
    }
    let head_img_like = match search {
      Some(item) => item.head_img_like.clone(),
      None => None,
    };
    if let Some(head_img_like) = head_img_like {
      where_query.push_str(" and t.head_img like ?");
      args.push(format!("%{}%", sql_like(&head_img_like)).into());
    }
  }
  // 绑定用户
  {
    let usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.usr_id.clone(),
      None => None,
    };
    if let Some(usr_id) = usr_id {
      let arg = {
        if usr_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(usr_id.len());
          for item in usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let usr_id_is_null: bool = match search {
      Some(item) => item.usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if usr_id_is_null {
      where_query.push_str(" and t.usr_id is null");
    }
  }
  {
    let usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.usr_id_lbl.clone(),
      None => None,
    };
    if let Some(usr_id_lbl) = usr_id_lbl {
      let arg = {
        if usr_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(usr_id_lbl.len());
          for item in usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let usr_id_lbl_like = match search {
        Some(item) => item.usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(usr_id_lbl_like) = usr_id_lbl_like {
        if !usr_id_lbl_like.is_empty() {
          where_query.push_str(" and usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 开发者ID
  {
    let appid = match search {
      Some(item) => item.appid.clone(),
      None => None,
    };
    if let Some(appid) = appid {
      where_query.push_str(" and t.appid=?");
      args.push(appid.into());
    }
    let appid_like = match search {
      Some(item) => item.appid_like.clone(),
      None => None,
    };
    if let Some(appid_like) = appid_like {
      where_query.push_str(" and t.appid like ?");
      args.push(format!("%{}%", sql_like(&appid_like)).into());
    }
  }
  // 公众号用户唯一标识
  {
    let openid = match search {
      Some(item) => item.openid.clone(),
      None => None,
    };
    if let Some(openid) = openid {
      where_query.push_str(" and t.openid=?");
      args.push(openid.into());
    }
    let openid_like = match search {
      Some(item) => item.openid_like.clone(),
      None => None,
    };
    if let Some(openid_like) = openid_like {
      where_query.push_str(" and t.openid like ?");
      args.push(format!("%{}%", sql_like(&openid_like)).into());
    }
  }
  // 用户统一标识
  {
    let unionid = match search {
      Some(item) => item.unionid.clone(),
      None => None,
    };
    if let Some(unionid) = unionid {
      where_query.push_str(" and t.unionid=?");
      args.push(unionid.into());
    }
    let unionid_like = match search {
      Some(item) => item.unionid_like.clone(),
      None => None,
    };
    if let Some(unionid_like) = unionid_like {
      where_query.push_str(" and t.unionid like ?");
      args.push(format!("%{}%", sql_like(&unionid_like)).into());
    }
  }
  // 性别
  {
    let sex: Option<Vec<u32>> = match search {
      Some(item) => item.sex.clone(),
      None => None,
    };
    if let Some(sex) = sex {
      let arg = {
        if sex.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(sex.len());
          for item in sex {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.sex in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 省份
  {
    let province = match search {
      Some(item) => item.province.clone(),
      None => None,
    };
    if let Some(province) = province {
      where_query.push_str(" and t.province=?");
      args.push(province.into());
    }
    let province_like = match search {
      Some(item) => item.province_like.clone(),
      None => None,
    };
    if let Some(province_like) = province_like {
      where_query.push_str(" and t.province like ?");
      args.push(format!("%{}%", sql_like(&province_like)).into());
    }
  }
  // 城市
  {
    let city = match search {
      Some(item) => item.city.clone(),
      None => None,
    };
    if let Some(city) = city {
      where_query.push_str(" and t.city=?");
      args.push(city.into());
    }
    let city_like = match search {
      Some(item) => item.city_like.clone(),
      None => None,
    };
    if let Some(city_like) = city_like {
      where_query.push_str(" and t.city like ?");
      args.push(format!("%{}%", sql_like(&city_like)).into());
    }
  }
  // 国家
  {
    let country = match search {
      Some(item) => item.country.clone(),
      None => None,
    };
    if let Some(country) = country {
      where_query.push_str(" and t.country=?");
      args.push(country.into());
    }
    let country_like = match search {
      Some(item) => item.country_like.clone(),
      None => None,
    };
    if let Some(country_like) = country_like {
      where_query.push_str(" and t.country like ?");
      args.push(format!("%{}%", sql_like(&country_like)).into());
    }
  }
  // 特权
  {
    let privilege = match search {
      Some(item) => item.privilege.clone(),
      None => None,
    };
    if let Some(privilege) = privilege {
      where_query.push_str(" and t.privilege=?");
      args.push(privilege.into());
    }
    let privilege_like = match search {
      Some(item) => item.privilege_like.clone(),
      None => None,
    };
    if let Some(privilege_like) = privilege_like {
      where_query.push_str(" and t.privilege like ?");
      args.push(format!("%{}%", sql_like(&privilege_like)).into());
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
    if let Some(rem_like) = rem_like {
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
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(create_usr_id.len());
          for item in create_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
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
    let create_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.create_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(create_usr_id_lbl) = create_usr_id_lbl {
      let arg = {
        if create_usr_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(create_usr_id_lbl.len());
          for item in create_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
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
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(update_usr_id.len());
          for item in update_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
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
    let update_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.update_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(update_usr_id_lbl) = update_usr_id_lbl {
      let arg = {
        if update_usr_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(update_usr_id_lbl.len());
          for item in update_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
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
  search: Option<&WxoUsrSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"wx_wxo_usr t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_wxo_usr
/// 根据搜索条件和分页查找公众号用户列表
#[allow(unused_mut)]
pub async fn find_all_wxo_usr(
  search: Option<WxoUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  let table = "wx_wxo_usr";
  let method = "find_all_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(page) = &page {
      msg += &format!(" page: {:?}", &page);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 绑定用户
  if let Some(search) = &search {
    if search.usr_id.is_some() {
      let len = search.usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.usr_id.length > {ids_limit}"));
      }
    }
  }
  // 性别
  if let Some(search) = &search {
    if search.sex.is_some() {
      let len = search.sex.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.sex.length > {ids_limit}"));
      }
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() {
      let len = search.create_usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
      }
    }
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() {
      let len = search.update_usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
      }
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
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Desc,
    });
  }
  
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<WxoUsrModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let dict_vec = get_dict(&[
    "wx_usr_gender",
  ]).await?;
  let [
    sex_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 性别
    model.sex_lbl = {
      sex_dict
        .iter()
        .find(|item| item.val == model.sex.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.sex.to_string())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_wxo_usr
/// 根据条件查找公众号用户总数
pub async fn find_count_wxo_usr(
  search: Option<WxoUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_usr";
  let method = "find_count_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  // 绑定用户
  if let Some(search) = &search {
    if search.usr_id.is_some() {
      let len = search.usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.usr_id.length > {ids_limit}"));
      }
    }
  }
  // 性别
  if let Some(search) = &search {
    if search.sex.is_some() {
      let len = search.sex.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.sex.length > {ids_limit}"));
      }
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() {
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
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() {
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
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select count(1) total from(select 1 from {from_query} where {where_query} group by t.id) t"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = Some(options);
  
  let res: Option<CountModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default();
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}

// MARK: get_field_comments_wxo_usr
/// 获取公众号用户字段注释
pub async fn get_field_comments_wxo_usr(
  _options: Option<Options>,
) -> Result<WxoUsrFieldComment> {
  
  let field_comments = WxoUsrFieldComment {
    id: "ID".into(),
    lbl: "昵称".into(),
    head_img: "头像".into(),
    usr_id: "绑定用户".into(),
    usr_id_lbl: "绑定用户".into(),
    appid: "开发者ID".into(),
    openid: "公众号用户唯一标识".into(),
    unionid: "用户统一标识".into(),
    sex: "性别".into(),
    sex_lbl: "性别".into(),
    province: "省份".into(),
    city: "城市".into(),
    country: "国家".into(),
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

// MARK: find_one_ok_wxo_usr
/// 根据条件查找第一个公众号用户
#[allow(dead_code)]
pub async fn find_one_ok_wxo_usr(
  search: Option<WxoUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxoUsrModel> {
  
  let table = "wx_wxo_usr";
  let method = "find_one_ok_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let wxo_usr_model = validate_option_wxo_usr(
    find_one_wxo_usr(
      search,
      sort,
      options,
    ).await?,
  ).await?;
  
  Ok(wxo_usr_model)
}

// MARK: find_one_wxo_usr
/// 根据条件查找第一个公众号用户
#[allow(dead_code)]
pub async fn find_one_wxo_usr(
  search: Option<WxoUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoUsrModel>> {
  
  let table = "wx_wxo_usr";
  let method = "find_one_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(None);
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all_wxo_usr(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<WxoUsrModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_wxo_usr
/// 根据 id 查找公众号用户
#[allow(dead_code)]
pub async fn find_by_id_ok_wxo_usr(
  id: WxoUsrId,
  options: Option<Options>,
) -> Result<WxoUsrModel> {
  
  let table = "wx_wxo_usr";
  let method = "find_by_id_ok_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let wxo_usr_model = validate_option_wxo_usr(
    find_by_id_wxo_usr(
      id,
      options,
    ).await?,
  ).await?;
  
  Ok(wxo_usr_model)
}

// MARK: find_by_id_wxo_usr
/// 根据 id 查找公众号用户
pub async fn find_by_id_wxo_usr(
  id: WxoUsrId,
  options: Option<Options>,
) -> Result<Option<WxoUsrModel>> {
  
  let table = "wx_wxo_usr";
  let method = "find_by_id_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let search = WxoUsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let wxo_usr_model = find_one_wxo_usr(
    search,
    None,
    options,
  ).await?;
  
  Ok(wxo_usr_model)
}

// MARK: find_by_ids_wxo_usr
/// 根据 ids 查找公众号用户
#[allow(dead_code)]
pub async fn find_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  let table = "wx_wxo_usr";
  let method = "find_by_ids_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    return Err(eyre!("find_by_ids: ids.length > FIND_ALL_IDS_LIMIT"));
  }
  
  let search = WxoUsrSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let models = find_all_wxo_usr(
    search,
    None,
    None,
    options,
  ).await?;
  
  if models.len() != len {
    let err_msg = "此 公众号用户 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let models = ids
    .into_iter()
    .map(|id| {
      let model = models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 公众号用户 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<WxoUsrModel>>>()?;
  
  Ok(models)
}

// MARK: exists_wxo_usr
/// 根据搜索条件判断公众号用户是否存在
#[allow(dead_code)]
pub async fn exists_wxo_usr(
  search: Option<WxoUsrSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wx_wxo_usr";
  let method = "exists_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let total = find_count_wxo_usr(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

// MARK: exists_by_id_wxo_usr
/// 根据 id 判断公众号用户是否存在
#[allow(dead_code)]
pub async fn exists_by_id_wxo_usr(
  id: WxoUsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wx_wxo_usr";
  let method = "exists_by_id_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = WxoUsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists_wxo_usr(
    search,
    options,
  ).await?;
  
  Ok(res)
}

// MARK: find_by_unique_wxo_usr
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_wxo_usr(
  search: WxoUsrSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  let table = "wx_wxo_usr";
  let method = "find_by_unique_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {:?}", &search);
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  if let Some(id) = search.id {
    let model = find_by_id_wxo_usr(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<WxoUsrModel> = vec![];
  
  let mut models_tmp = {
    if
      search.openid.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxoUsrSearch {
      openid: search.openid.clone(),
      ..Default::default()
    };
    
    find_all_wxo_usr(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  Ok(models)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
pub fn equals_by_unique(
  input: &WxoUsrInput,
  model: &WxoUsrModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.openid.as_ref().is_some() && input.openid.as_ref().unwrap() == &model.openid
  {
    return true;
  }
  false
}

// MARK: check_by_unique_wxo_usr
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_wxo_usr(
  input: WxoUsrInput,
  model: WxoUsrModel,
  options: Option<Options>,
) -> Result<Option<WxoUsrId>> {
  
  let table = "wx_wxo_usr";
  let method = "check_by_unique_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    msg += &format!(" model: {:?}", &model);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    let id = update_by_id_wxo_usr(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "此 公众号用户 已经存在";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_wxo_usr
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_wxo_usr(
  input: WxoUsrInput,
) -> Result<WxoUsrInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "wx_usr_gender",
  ]).await?;
  
  // 性别
  if input.sex.is_none() {
    let sex_dict = &dict_vec[0];
    if let Some(sex_lbl) = input.sex_lbl.clone() {
      input.sex = sex_dict
        .iter()
        .find(|item| {
          item.lbl == sex_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 绑定用户
  if input.usr_id_lbl.is_some()
    && !input.usr_id_lbl.as_ref().unwrap().is_empty()
    && input.usr_id.is_none()
  {
    input.usr_id_lbl = input.usr_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        lbl: input.usr_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.usr_id = model.id.into();
    }
  } else if
    (input.usr_id_lbl.is_none() || input.usr_id_lbl.as_ref().unwrap().is_empty())
    && input.usr_id.is_some()
  {
    let usr_model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        id: input.usr_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(usr_model) = usr_model {
      input.usr_id_lbl = usr_model.lbl.into();
    }
  }
  
  // 性别
  if
    input.sex_lbl.is_some() && !input.sex_lbl.as_ref().unwrap().is_empty()
    && input.sex.is_none()
  {
    let sex_dict = &dict_vec[0];
    let dict_model = sex_dict.iter().find(|item| {
      item.lbl == input.sex_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.sex = val.parse::<u32>()?.into();
    }
  } else if
    (input.sex_lbl.is_none() || input.sex_lbl.as_ref().unwrap().is_empty())
    && input.sex.is_some()
  {
    let sex_dict = &dict_vec[0];
    let dict_model = sex_dict.iter().find(|item| {
      item.val == input.sex.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.sex_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_wxo_usr
/// 批量创建公众号用户并返回
#[allow(dead_code)]
pub async fn creates_return_wxo_usr(
  inputs: Vec<WxoUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrModel>> {
  
  let table = "wx_wxo_usr";
  let method = "creates_return_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {:?}", &inputs);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs.clone(),
    options.clone(),
  ).await?;
  
  let models_wxo_usr = find_by_ids_wxo_usr(
    ids,
    options,
  ).await?;
  
  Ok(models_wxo_usr)
}

// MARK: creates_wxo_usr
/// 批量创建公众号用户
pub async fn creates_wxo_usr(
  inputs: Vec<WxoUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrId>> {
  
  let table = "wx_wxo_usr";
  let method = "creates_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {:?}", &inputs);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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

/// 批量创建公众号用户
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<WxoUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxoUsrId>> {
  
  let table = "wx_wxo_usr";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<WxoUsrId> = vec![];
  let mut inputs2: Vec<WxoUsrInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_wxo_usr(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxoUsrId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_wxo_usr(
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
  let mut sql_fields = String::with_capacity(80 * 19 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 昵称
  sql_fields += ",lbl";
  // 头像
  sql_fields += ",head_img";
  // 绑定用户
  sql_fields += ",usr_id_lbl";
  // 绑定用户
  sql_fields += ",usr_id";
  // 开发者ID
  sql_fields += ",appid";
  // 公众号用户唯一标识
  sql_fields += ",openid";
  // 用户统一标识
  sql_fields += ",unionid";
  // 性别
  sql_fields += ",sex";
  // 省份
  sql_fields += ",province";
  // 城市
  sql_fields += ",city";
  // 国家
  sql_fields += ",country";
  // 特权
  sql_fields += ",privilege";
  // 备注
  sql_fields += ",rem";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 19 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: WxoUsrId = get_short_uuid().into();
    ids2.push(id.clone());
    
    inputs2_ids.push(id.clone());
    
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
        let mut usr_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
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
      } else if input.create_usr_id.clone().unwrap().as_str() == "-" {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id.clone();
        let mut usr_lbl = String::new();
        let usr_model = find_by_id_usr(
          usr_id.clone().unwrap(),
          options.clone(),
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
    // 昵称
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
    } else {
      sql_values += ",default";
    }
    // 头像
    if let Some(head_img) = input.head_img {
      sql_values += ",?";
      args.push(head_img.into());
    } else {
      sql_values += ",default";
    }
    // 绑定用户
    if let Some(usr_id_lbl) = input.usr_id_lbl {
      if !usr_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(usr_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 绑定用户
    if let Some(usr_id) = input.usr_id {
      sql_values += ",?";
      args.push(usr_id.into());
    } else {
      sql_values += ",default";
    }
    // 开发者ID
    if let Some(appid) = input.appid {
      sql_values += ",?";
      args.push(appid.into());
    } else {
      sql_values += ",default";
    }
    // 公众号用户唯一标识
    if let Some(openid) = input.openid {
      sql_values += ",?";
      args.push(openid.into());
    } else {
      sql_values += ",default";
    }
    // 用户统一标识
    if let Some(unionid) = input.unionid {
      sql_values += ",?";
      args.push(unionid.into());
    } else {
      sql_values += ",default";
    }
    // 性别
    if let Some(sex) = input.sex {
      sql_values += ",?";
      args.push(sex.into());
    } else {
      sql_values += ",default";
    }
    // 省份
    if let Some(province) = input.province {
      sql_values += ",?";
      args.push(province.into());
    } else {
      sql_values += ",default";
    }
    // 城市
    if let Some(city) = input.city {
      sql_values += ",?";
      args.push(city.into());
    } else {
      sql_values += ",default";
    }
    // 国家
    if let Some(country) = input.country {
      sql_values += ",?";
      args.push(country.into());
    } else {
      sql_values += ",default";
    }
    // 特权
    if let Some(privilege) = input.privilege {
      sql_values += ",?";
      args.push(privilege.into());
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
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let options = Some(options);
  
  let affected_rows = execute(
    sql,
    args,
    options.clone(),
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_wxo_usr
/// 创建公众号用户并返回
#[allow(dead_code)]
pub async fn create_return_wxo_usr(
  #[allow(unused_mut)]
  mut input: WxoUsrInput,
  options: Option<Options>,
) -> Result<WxoUsrModel> {
  
  let id = create_wxo_usr(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_wxo_usr = find_by_id_wxo_usr(
    id,
    options,
  ).await?;
  
  if model_wxo_usr.is_none() {
    let err_msg = "create_return_wxo_usr: model_wxo_usr.is_none()";
    return Err(eyre!(
      ServiceException {
        code: String::new(),
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_wxo_usr = model_wxo_usr.unwrap();
  
  Ok(model_wxo_usr)
}

// MARK: create_wxo_usr
/// 创建公众号用户
#[allow(dead_code)]
pub async fn create_wxo_usr(
  #[allow(unused_mut)]
  mut input: WxoUsrInput,
  options: Option<Options>,
) -> Result<WxoUsrId> {
  
  let table = "wx_wxo_usr";
  let method = "create_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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

// MARK: update_tenant_by_id_wxo_usr
/// 公众号用户根据id修改租户id
pub async fn update_tenant_by_id_wxo_usr(
  id: WxoUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "wx_wxo_usr";
  let method = "update_tenant_by_id_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" tenant_id: {:?}", &tenant_id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    Some(options.clone()),
  ).await?;
  
  Ok(num)
}

// MARK: update_by_id_wxo_usr
/// 根据 id 修改公众号用户
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_wxo_usr(
  id: WxoUsrId,
  mut input: WxoUsrInput,
  options: Option<Options>,
) -> Result<WxoUsrId> {
  
  let table = "wx_wxo_usr";
  let method = "update_by_id_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let old_model = find_by_id_wxo_usr(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let err_msg = "编辑失败, 此 公众号用户 已被删除";
    return Err(eyre!(err_msg));
  }
  let old_model = old_model.unwrap();
  
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
    
    let models = find_by_unique_wxo_usr(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxoUsrModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "此 公众号用户 已经存在";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 19 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 昵称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 头像
  if let Some(head_img) = input.head_img {
    field_num += 1;
    sql_fields += "head_img=?,";
    args.push(head_img.into());
  }
  // 绑定用户
  if let Some(usr_id_lbl) = input.usr_id_lbl {
    if !usr_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "usr_id_lbl=?,";
      args.push(usr_id_lbl.into());
    }
  }
  // 绑定用户
  if let Some(usr_id) = input.usr_id {
    field_num += 1;
    sql_fields += "usr_id=?,";
    args.push(usr_id.into());
  }
  // 开发者ID
  if let Some(appid) = input.appid {
    field_num += 1;
    sql_fields += "appid=?,";
    args.push(appid.into());
  }
  // 公众号用户唯一标识
  if let Some(openid) = input.openid {
    field_num += 1;
    sql_fields += "openid=?,";
    args.push(openid.into());
  }
  // 用户统一标识
  if let Some(unionid) = input.unionid {
    field_num += 1;
    sql_fields += "unionid=?,";
    args.push(unionid.into());
  }
  // 性别
  if let Some(sex) = input.sex {
    field_num += 1;
    sql_fields += "sex=?,";
    args.push(sex.into());
  }
  // 省份
  if let Some(province) = input.province {
    field_num += 1;
    sql_fields += "province=?,";
    args.push(province.into());
  }
  // 城市
  if let Some(city) = input.city {
    field_num += 1;
    sql_fields += "city=?,";
    args.push(city.into());
  }
  // 国家
  if let Some(country) = input.country {
    field_num += 1;
    sql_fields += "country=?,";
    args.push(country.into());
  }
  // 特权
  if let Some(privilege) = input.privilege {
    field_num += 1;
    sql_fields += "privilege=?,";
    args.push(privilege.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
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
      } else if input.update_usr_id.clone().unwrap().as_str() != "-" {
        let mut usr_id = input.update_usr_id.clone();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
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
      if input.update_usr_id.is_some() && input.update_usr_id.clone().unwrap().as_str() != "-" {
        let usr_id = input.update_usr_id.clone();
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
    args.push(id.clone().into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  if field_num > 0 {
    let options = Options::from(options);
    let options = options.set_del_cache_key1s(get_cache_tables());
    if let Some(del_cache_key1s) = options.get_del_cache_key1s() {
      del_caches(
        del_cache_key1s
          .iter()
          .map(|item| item.as_str())
          .collect::<Vec<&str>>()
          .as_slice()
      ).await?;
    }
  }
  
  Ok(id)
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = "wx_wxo_usr";
  vec![
    table,
  ]
}

// MARK: del_cache_wxo_usr
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_wxo_usr() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_wxo_usr
/// 根据 ids 删除公众号用户
#[allow(unused_variables)]
pub async fn delete_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_usr";
  let method = "delete_by_ids_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id_wxo_usr(
      id.clone(),
      options.clone(),
    ).await?;
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
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
    let mut usr_lbl = String::new();
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.clone().unwrap(),
        options.clone(),
      ).await?;
      if let Some(usr_model) = usr_model {
        usr_lbl = usr_model.lbl;
      } else {
        usr_id = None;
      }
    }
    
    if !is_silent_mode && !is_creating {
      if let Some(usr_id) = usr_id {
        sql_fields.push_str("delete_usr_id=?,");
        args.push(usr_id.into());
      }
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
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_wxo_usr
/// 根据 ids 还原公众号用户
pub async fn revert_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_usr";
  let method = "revert_by_ids_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  let options = options.set_del_cache_key1s(get_cache_tables());
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_wxo_usr(
      WxoUsrSearch {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_wxo_usr(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: WxoUsrInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_wxo_usr(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<WxoUsrModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "此 公众号用户 已经存在";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  Ok(num)
}

// MARK: force_delete_by_ids_wxo_usr
/// 根据 ids 彻底删除公众号用户
#[allow(unused_variables)]
pub async fn force_delete_by_ids_wxo_usr(
  ids: Vec<WxoUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_usr";
  let method = "force_delete_by_ids_wxo_usr";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_all_wxo_usr(
      WxoUsrSearch {
        id: id.clone().into(),
        is_deleted: 1.into(),
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone(),
    ).await?.into_iter().next();
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
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
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: validate_option_wxo_usr
/// 校验公众号用户是否存在
#[allow(dead_code)]
pub async fn validate_option_wxo_usr(
  model: Option<WxoUsrModel>,
) -> Result<WxoUsrModel> {
  if model.is_none() {
    let err_msg = "公众号用户不存在";
    error!(
      "{req_id} {err_msg}",
      req_id = get_req_id(),
    );
    return Err(eyre!(
      ServiceException {
        code: String::new(),
        message: err_msg.to_owned(),
        rollback: true,
        trace: true,
      },
    ));
  }
  let model = model.unwrap();
  Ok(model)
}
