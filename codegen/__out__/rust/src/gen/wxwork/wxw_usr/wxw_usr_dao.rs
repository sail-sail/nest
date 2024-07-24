#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use anyhow::{Result,anyhow};
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

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::wxw_usr_model::*;

use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::base::usr::usr_model::UsrId;

use crate::gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxwUsrSearch>,
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
    let ids: Option<Vec<WxwUsrId>> = match search {
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
  // 姓名
  {
    let lbl = match search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl) = lbl {
      where_query.push_str(" and t.lbl = ?");
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
  // 用户ID
  {
    let userid = match search {
      Some(item) => item.userid.clone(),
      None => None,
    };
    if let Some(userid) = userid {
      where_query.push_str(" and t.userid = ?");
      args.push(userid.into());
    }
    let userid_like = match search {
      Some(item) => item.userid_like.clone(),
      None => None,
    };
    if let Some(userid_like) = userid_like {
      where_query.push_str(" and t.userid like ?");
      args.push(format!("%{}%", sql_like(&userid_like)).into());
    }
  }
  // 手机号
  {
    let mobile = match search {
      Some(item) => item.mobile.clone(),
      None => None,
    };
    if let Some(mobile) = mobile {
      where_query.push_str(" and t.mobile = ?");
      args.push(mobile.into());
    }
    let mobile_like = match search {
      Some(item) => item.mobile_like.clone(),
      None => None,
    };
    if let Some(mobile_like) = mobile_like {
      where_query.push_str(" and t.mobile like ?");
      args.push(format!("%{}%", sql_like(&mobile_like)).into());
    }
  }
  // 性别
  {
    let gender = match search {
      Some(item) => item.gender.clone(),
      None => None,
    };
    if let Some(gender) = gender {
      where_query.push_str(" and t.gender = ?");
      args.push(gender.into());
    }
    let gender_like = match search {
      Some(item) => item.gender_like.clone(),
      None => None,
    };
    if let Some(gender_like) = gender_like {
      where_query.push_str(" and t.gender like ?");
      args.push(format!("%{}%", sql_like(&gender_like)).into());
    }
  }
  // 邮箱
  {
    let email = match search {
      Some(item) => item.email.clone(),
      None => None,
    };
    if let Some(email) = email {
      where_query.push_str(" and t.email = ?");
      args.push(email.into());
    }
    let email_like = match search {
      Some(item) => item.email_like.clone(),
      None => None,
    };
    if let Some(email_like) = email_like {
      where_query.push_str(" and t.email like ?");
      args.push(format!("%{}%", sql_like(&email_like)).into());
    }
  }
  // 企业邮箱
  {
    let biz_email = match search {
      Some(item) => item.biz_email.clone(),
      None => None,
    };
    if let Some(biz_email) = biz_email {
      where_query.push_str(" and t.biz_email = ?");
      args.push(biz_email.into());
    }
    let biz_email_like = match search {
      Some(item) => item.biz_email_like.clone(),
      None => None,
    };
    if let Some(biz_email_like) = biz_email_like {
      where_query.push_str(" and t.biz_email like ?");
      args.push(format!("%{}%", sql_like(&biz_email_like)).into());
    }
  }
  // 直属上级
  {
    let direct_leader = match search {
      Some(item) => item.direct_leader.clone(),
      None => None,
    };
    if let Some(direct_leader) = direct_leader {
      where_query.push_str(" and t.direct_leader = ?");
      args.push(direct_leader.into());
    }
    let direct_leader_like = match search {
      Some(item) => item.direct_leader_like.clone(),
      None => None,
    };
    if let Some(direct_leader_like) = direct_leader_like {
      where_query.push_str(" and t.direct_leader like ?");
      args.push(format!("%{}%", sql_like(&direct_leader_like)).into());
    }
  }
  // 职位
  {
    let position = match search {
      Some(item) => item.position.clone(),
      None => None,
    };
    if let Some(position) = position {
      where_query.push_str(" and t.position = ?");
      args.push(position.into());
    }
    let position_like = match search {
      Some(item) => item.position_like.clone(),
      None => None,
    };
    if let Some(position_like) = position_like {
      where_query.push_str(" and t.position like ?");
      args.push(format!("%{}%", sql_like(&position_like)).into());
    }
  }
  // 头像
  {
    let avatar = match search {
      Some(item) => item.avatar.clone(),
      None => None,
    };
    if let Some(avatar) = avatar {
      where_query.push_str(" and t.avatar = ?");
      args.push(avatar.into());
    }
    let avatar_like = match search {
      Some(item) => item.avatar_like.clone(),
      None => None,
    };
    if let Some(avatar_like) = avatar_like {
      where_query.push_str(" and t.avatar like ?");
      args.push(format!("%{}%", sql_like(&avatar_like)).into());
    }
  }
  // 头像缩略图
  {
    let thumb_avatar = match search {
      Some(item) => item.thumb_avatar.clone(),
      None => None,
    };
    if let Some(thumb_avatar) = thumb_avatar {
      where_query.push_str(" and t.thumb_avatar = ?");
      args.push(thumb_avatar.into());
    }
    let thumb_avatar_like = match search {
      Some(item) => item.thumb_avatar_like.clone(),
      None => None,
    };
    if let Some(thumb_avatar_like) = thumb_avatar_like {
      where_query.push_str(" and t.thumb_avatar like ?");
      args.push(format!("%{}%", sql_like(&thumb_avatar_like)).into());
    }
  }
  // 个人二维码
  {
    let qr_code = match search {
      Some(item) => item.qr_code.clone(),
      None => None,
    };
    if let Some(qr_code) = qr_code {
      where_query.push_str(" and t.qr_code = ?");
      args.push(qr_code.into());
    }
    let qr_code_like = match search {
      Some(item) => item.qr_code_like.clone(),
      None => None,
    };
    if let Some(qr_code_like) = qr_code_like {
      where_query.push_str(" and t.qr_code like ?");
      args.push(format!("%{}%", sql_like(&qr_code_like)).into());
    }
  }
  // 备注
  {
    let rem = match search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query.push_str(" and t.rem = ?");
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
  search: Option<&WxwUsrSearch>,
  options: Option<&Options>,
) -> Result<String> {
  let from_query = r#"wxwork_wxw_usr t"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找企微用户列表
#[allow(unused_mut)]
pub async fn find_all(
  search: Option<WxwUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  let table = "wxwork_wxw_usr";
  let method = "find_all";
  
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
        return Err(anyhow!("search.create_usr_id.length > {ids_limit}"));
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
        return Err(anyhow!("search.update_usr_id.length > {ids_limit}"));
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
  
  let mut res: Vec<WxwUsrModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
  }
  
  Ok(res)
}

/// 根据条件查找企微用户总数
pub async fn find_count(
  search: Option<WxwUsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_usr";
  let method = "find_count";
  
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
  
  Ok(total)
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path_wxw_usr().into(),
  }
}

/// 获取企微用户字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<WxwUsrFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "姓名".into(),
    "用户ID".into(),
    "手机号".into(),
    "性别".into(),
    "邮箱".into(),
    "企业邮箱".into(),
    "直属上级".into(),
    "职位".into(),
    "头像".into(),
    "头像缩略图".into(),
    "个人二维码".into(),
    "备注".into(),
    "创建人".into(),
    "创建人".into(),
    "创建时间".into(),
    "创建时间".into(),
    "更新人".into(),
    "更新人".into(),
    "更新时间".into(),
    "更新时间".into(),
  ];
  
  let map = n_route.n_batch(
    i18n_code_maps.clone(),
  ).await?;
  
  let vec = i18n_code_maps.into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.to_owned())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = WxwUsrFieldComment {
    id: vec[0].to_owned(),
    lbl: vec[1].to_owned(),
    userid: vec[2].to_owned(),
    mobile: vec[3].to_owned(),
    gender: vec[4].to_owned(),
    email: vec[5].to_owned(),
    biz_email: vec[6].to_owned(),
    direct_leader: vec[7].to_owned(),
    position: vec[8].to_owned(),
    avatar: vec[9].to_owned(),
    thumb_avatar: vec[10].to_owned(),
    qr_code: vec[11].to_owned(),
    rem: vec[12].to_owned(),
    create_usr_id: vec[13].to_owned(),
    create_usr_id_lbl: vec[14].to_owned(),
    create_time: vec[15].to_owned(),
    create_time_lbl: vec[16].to_owned(),
    update_usr_id: vec[17].to_owned(),
    update_usr_id_lbl: vec[18].to_owned(),
    update_time: vec[19].to_owned(),
    update_time_lbl: vec[20].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一个企微用户
pub async fn find_one(
  search: Option<WxwUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  let table = "wxwork_wxw_usr";
  let method = "find_one";
  
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
  
  let res = find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<WxwUsrModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据 id 查找企微用户
pub async fn find_by_id(
  id: WxwUsrId,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  let table = "wxwork_wxw_usr";
  let method = "find_by_id";
  
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
  
  let search = WxwUsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = find_one(
    search,
    None,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 查找企微用户
#[allow(dead_code)]
pub async fn find_by_ids(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  let table = "wxwork_wxw_usr";
  let method = "find_by_ids";
  
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
    return Err(anyhow!("find_by_ids: ids.length > FIND_ALL_IDS_LIMIT"));
  }
  
  let search = WxwUsrSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let models = find_all(
    search,
    None,
    None,
    options,
  ).await?;
  
  if models.len() != len {
    return Err(anyhow!("find_by_ids: models.length !== ids.length"));
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
      Err(anyhow!("find_by_ids: id: {id} not found"))
    })
    .collect::<Result<Vec<WxwUsrModel>>>()?;
  
  Ok(models)
}

/// 根据搜索条件判断企微用户是否存在
#[allow(dead_code)]
pub async fn exists(
  search: Option<WxwUsrSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wxwork_wxw_usr";
  let method = "exists";
  
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
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据 id 判断企微用户是否存在
#[allow(dead_code)]
pub async fn exists_by_id(
  id: WxwUsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wxwork_wxw_usr";
  let method = "exists_by_id";
  
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
  
  let search = WxwUsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique(
  search: WxwUsrSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  let table = "wxwork_wxw_usr";
  let method = "find_by_unique";
  
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
    let model = find_by_id(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<WxwUsrModel> = vec![];
  
  let mut models_tmp = {
    if
      search.userid.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwUsrSearch {
      userid: search.userid.clone(),
      ..Default::default()
    };
    
    find_all(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwUsrSearch {
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all(
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
  input: &WxwUsrInput,
  model: &WxwUsrModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.userid.as_ref().is_some() && input.userid.as_ref().unwrap() == &model.userid
  {
    return true;
  }
  
  if
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: WxwUsrInput,
  model: WxwUsrModel,
  options: Option<Options>,
) -> Result<Option<WxwUsrId>> {
  
  let table = "wxwork_wxw_usr";
  let method = "check_by_unique";
  
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
    let id = update_by_id(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let table_comment = i18n_dao::ns(
      "企微用户".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "此 {0} 已经存在".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  Ok(None)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables)]
pub async fn set_id_by_lbl(
  input: WxwUsrInput,
) -> Result<WxwUsrInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  Ok(input)
}

/// 批量创建企微用户
pub async fn creates(
  inputs: Vec<WxwUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrId>> {
  
  let table = "wxwork_wxw_usr";
  let method = "creates";
  
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

/// 批量创建企微用户
#[allow(unused_variables)]
async fn _creates(
  inputs: Vec<WxwUsrInput>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrId>> {
  
  let table = "wxwork_wxw_usr";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<WxwUsrId> = vec![];
  let mut inputs2: Vec<WxwUsrInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(anyhow!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxwUsrId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique(
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
  // 姓名
  sql_fields += ",lbl";
  // 用户ID
  sql_fields += ",userid";
  // 手机号
  sql_fields += ",mobile";
  // 性别
  sql_fields += ",gender";
  // 邮箱
  sql_fields += ",email";
  // 企业邮箱
  sql_fields += ",biz_email";
  // 直属上级
  sql_fields += ",direct_leader";
  // 职位
  sql_fields += ",position";
  // 头像
  sql_fields += ",avatar";
  // 头像缩略图
  sql_fields += ",thumb_avatar";
  // 个人二维码
  sql_fields += ",qr_code";
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
    
    let id: WxwUsrId = get_short_uuid().into();
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
    // 姓名
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
    } else {
      sql_values += ",default";
    }
    // 用户ID
    if let Some(userid) = input.userid {
      sql_values += ",?";
      args.push(userid.into());
    } else {
      sql_values += ",default";
    }
    // 手机号
    if let Some(mobile) = input.mobile {
      sql_values += ",?";
      args.push(mobile.into());
    } else {
      sql_values += ",default";
    }
    // 性别
    if let Some(gender) = input.gender {
      sql_values += ",?";
      args.push(gender.into());
    } else {
      sql_values += ",default";
    }
    // 邮箱
    if let Some(email) = input.email {
      sql_values += ",?";
      args.push(email.into());
    } else {
      sql_values += ",default";
    }
    // 企业邮箱
    if let Some(biz_email) = input.biz_email {
      sql_values += ",?";
      args.push(biz_email.into());
    } else {
      sql_values += ",default";
    }
    // 直属上级
    if let Some(direct_leader) = input.direct_leader {
      sql_values += ",?";
      args.push(direct_leader.into());
    } else {
      sql_values += ",default";
    }
    // 职位
    if let Some(position) = input.position {
      sql_values += ",?";
      args.push(position.into());
    } else {
      sql_values += ",default";
    }
    // 头像
    if let Some(avatar) = input.avatar {
      sql_values += ",?";
      args.push(avatar.into());
    } else {
      sql_values += ",default";
    }
    // 头像缩略图
    if let Some(thumb_avatar) = input.thumb_avatar {
      sql_values += ",?";
      args.push(thumb_avatar.into());
    } else {
      sql_values += ",default";
    }
    // 个人二维码
    if let Some(qr_code) = input.qr_code {
      sql_values += ",?";
      args.push(qr_code.into());
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
    return Err(anyhow!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

/// 创建企微用户
#[allow(dead_code)]
pub async fn create(
  #[allow(unused_mut)]
  mut input: WxwUsrInput,
  options: Option<Options>,
) -> Result<WxwUsrId> {
  
  let table = "wxwork_wxw_usr";
  let method = "create";
  
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
    return Err(anyhow!("_creates: Create failed in dao: {table}"));
  }
  let id = ids[0].clone();
  
  Ok(id)
}

/// 企微用户根据id修改租户id
pub async fn update_tenant_by_id(
  id: WxwUsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "wxwork_wxw_usr";
  let method = "update_tenant_by_id";
  
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

/// 根据 id 修改企微用户
#[allow(unused_mut)]
pub async fn update_by_id(
  id: WxwUsrId,
  mut input: WxwUsrInput,
  options: Option<Options>,
) -> Result<WxwUsrId> {
  
  let table = "wxwork_wxw_usr";
  let method = "update_by_id";
  
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
  
  let old_model = find_by_id(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let table_comment = i18n_dao::ns(
      "企微用户".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "编辑失败, 此 {0} 已被删除".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
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
    
    let models = find_by_unique(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxwUsrModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "企微用户".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(anyhow!(err_msg));
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
  // 姓名
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 用户ID
  if let Some(userid) = input.userid {
    field_num += 1;
    sql_fields += "userid=?,";
    args.push(userid.into());
  }
  // 手机号
  if let Some(mobile) = input.mobile {
    field_num += 1;
    sql_fields += "mobile=?,";
    args.push(mobile.into());
  }
  // 性别
  if let Some(gender) = input.gender {
    field_num += 1;
    sql_fields += "gender=?,";
    args.push(gender.into());
  }
  // 邮箱
  if let Some(email) = input.email {
    field_num += 1;
    sql_fields += "email=?,";
    args.push(email.into());
  }
  // 企业邮箱
  if let Some(biz_email) = input.biz_email {
    field_num += 1;
    sql_fields += "biz_email=?,";
    args.push(biz_email.into());
  }
  // 直属上级
  if let Some(direct_leader) = input.direct_leader {
    field_num += 1;
    sql_fields += "direct_leader=?,";
    args.push(direct_leader.into());
  }
  // 职位
  if let Some(position) = input.position {
    field_num += 1;
    sql_fields += "position=?,";
    args.push(position.into());
  }
  // 头像
  if let Some(avatar) = input.avatar {
    field_num += 1;
    sql_fields += "avatar=?,";
    args.push(avatar.into());
  }
  // 头像缩略图
  if let Some(thumb_avatar) = input.thumb_avatar {
    field_num += 1;
    sql_fields += "thumb_avatar=?,";
    args.push(thumb_avatar.into());
  }
  // 个人二维码
  if let Some(qr_code) = input.qr_code {
    field_num += 1;
    sql_fields += "qr_code=?,";
    args.push(qr_code.into());
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
  let table = "wxwork_wxw_usr";
  vec![
    table,
  ]
}

/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

/// 根据 ids 删除企微用户
#[allow(unused_variables)]
pub async fn delete_by_ids(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_usr";
  let method = "delete_by_ids";
  
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
    return Err(anyhow!("ids.len(): {} > MAX_SAFE_INTEGER", ids.len()));
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id(
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
    return Err(anyhow!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

/// 根据 ids 还原企微用户
pub async fn revert_by_ids(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_usr";
  let method = "revert_by_ids";
  
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
    
    args.push(id.as_ref().into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one(
      WxwUsrSearch {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: WxwUsrInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<WxwUsrModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "企微用户".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(anyhow!(err_msg));
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

/// 根据 ids 彻底删除企微用户
#[allow(unused_variables)]
pub async fn force_delete_by_ids(
  ids: Vec<WxwUsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_usr";
  let method = "force_delete_by_ids";
  
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
    
    let old_model = find_all(
      WxwUsrSearch {
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
    
    args.push(id.as_ref().into());
    
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

/// 校验企微用户是否存在
#[allow(dead_code)]
pub async fn validate_option<T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "企微用户".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + msg1.as_str();
    let backtrace = std::backtrace::Backtrace::capture();
    error!(
      "{req_id} {err_msg}: {backtrace}",
      req_id = get_req_id(),
    );
    return Err(anyhow!(err_msg));
  }
  Ok(model.unwrap())
}
