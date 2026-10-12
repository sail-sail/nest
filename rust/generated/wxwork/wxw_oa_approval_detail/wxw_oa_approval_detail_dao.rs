
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

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
  get_find_all_result_limit,
  CountModel,
  UniqueType,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
  get_auth_org_id,
};
use crate::common::exceptions::service_exception::ServiceException;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::common::dict_detail::dict_detail_dao::get_dict;

use super::wxw_oa_approval_detail_model::*;

use crate::base::tenant::tenant_model::TenantId;
#[allow(unused_imports)]
use crate::base::org::org_model::OrgId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxwOaApprovalDetailSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let mut where_query = String::with_capacity(80 * 11 * 6);
  
  where_query.push_str(" 1=1");
  {
    if let Some(id) = search.and_then(|item| item.id) {
      where_query.push_str(" and t.id=?");
      args.push(id.into());
    }
  }
  {
    if let Some(ids) = search.and_then(|item| item.ids.as_deref()) {
      let arg = {
        if ids.is_empty() {
          String::from("null")
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
  // 审批编号
  {
    let sp_no = match search {
      Some(item) => item.sp_no.clone(),
      None => None,
    };
    if let Some(sp_no) = sp_no {
      where_query.push_str(" and t.sp_no=?");
      args.push(sp_no.into());
    }
    let sp_no_like = match search {
      Some(item) => item.sp_no_like.clone(),
      None => None,
    };
    if let Some(sp_no_like) = sp_no_like && !sp_no_like.is_empty() {
      where_query.push_str(" and t.sp_no like ?");
      args.push(format!("%{}%", sql_like(&sp_no_like)).into());
    }
  }
  // 审批申请类型名称
  {
    let sp_name = match search {
      Some(item) => item.sp_name.clone(),
      None => None,
    };
    if let Some(sp_name) = sp_name {
      where_query.push_str(" and t.sp_name=?");
      args.push(sp_name.into());
    }
    let sp_name_like = match search {
      Some(item) => item.sp_name_like.clone(),
      None => None,
    };
    if let Some(sp_name_like) = sp_name_like && !sp_name_like.is_empty() {
      where_query.push_str(" and t.sp_name like ?");
      args.push(format!("%{}%", sql_like(&sp_name_like)).into());
    }
  }
  // 审批申请状态
  {
    let sp_status: Option<Vec<u8>> = match search {
      Some(item) => item.sp_status.clone(),
      None => None,
    };
    if let Some(sp_status) = sp_status {
      let arg = {
        if sp_status.is_empty() {
          String::from("null")
        } else {
          let mut items = Vec::with_capacity(sp_status.len());
          for item in sp_status {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.sp_status in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 模板ID
  {
    let template_id = match search {
      Some(item) => item.template_id.clone(),
      None => None,
    };
    if let Some(template_id) = template_id {
      where_query.push_str(" and t.template_id=?");
      args.push(template_id.into());
    }
    let template_id_like = match search {
      Some(item) => item.template_id_like.clone(),
      None => None,
    };
    if let Some(template_id_like) = template_id_like && !template_id_like.is_empty() {
      where_query.push_str(" and t.template_id like ?");
      args.push(format!("%{}%", sql_like(&template_id_like)).into());
    }
  }
  // 审批申请提交时间
  {
    let mut apply_time = match search {
      Some(item) => item.apply_time.unwrap_or_default(),
      None => Default::default(),
    };
    let apply_time_gt = apply_time[0].take();
    let apply_time_lt = apply_time[1].take();
    if let Some(apply_time_gt) = apply_time_gt {
      where_query.push_str(" and t.apply_time >= ?");
      args.push(apply_time_gt.into());
    }
    if let Some(apply_time_lt) = apply_time_lt {
      where_query.push_str(" and t.apply_time <= ?");
      args.push(apply_time_lt.into());
    }
  }
  // 申请人
  {
    let applyer_userid = match search {
      Some(item) => item.applyer_userid.clone(),
      None => None,
    };
    if let Some(applyer_userid) = applyer_userid {
      where_query.push_str(" and t.applyer_userid=?");
      args.push(applyer_userid.into());
    }
    let applyer_userid_like = match search {
      Some(item) => item.applyer_userid_like.clone(),
      None => None,
    };
    if let Some(applyer_userid_like) = applyer_userid_like && !applyer_userid_like.is_empty() {
      where_query.push_str(" and t.applyer_userid like ?");
      args.push(format!("%{}%", sql_like(&applyer_userid_like)).into());
    }
  }
  // 批量申请人
  {
    let batch_applyer_userid = match search {
      Some(item) => item.batch_applyer_userid.clone(),
      None => None,
    };
    if let Some(batch_applyer_userid) = batch_applyer_userid {
      where_query.push_str(" and t.batch_applyer_userid=?");
      args.push(batch_applyer_userid.into());
    }
    let batch_applyer_userid_like = match search {
      Some(item) => item.batch_applyer_userid_like.clone(),
      None => None,
    };
    if let Some(batch_applyer_userid_like) = batch_applyer_userid_like && !batch_applyer_userid_like.is_empty() {
      where_query.push_str(" and t.batch_applyer_userid like ?");
      args.push(format!("%{}%", sql_like(&batch_applyer_userid_like)).into());
    }
  }
  // 原始数据
  {
    let raw_data = match search {
      Some(item) => item.raw_data.clone(),
      None => None,
    };
    if let Some(raw_data) = raw_data {
      where_query.push_str(" and t.raw_data=?");
      args.push(raw_data.into());
    }
    let raw_data_like = match search {
      Some(item) => item.raw_data_like.clone(),
      None => None,
    };
    if let Some(raw_data_like) = raw_data_like && !raw_data_like.is_empty() {
      where_query.push_str(" and t.raw_data like ?");
      args.push(format!("%{}%", sql_like(&raw_data_like)).into());
    }
  }
  // 所属组织
  {
    if let Some(org_id) = search.and_then(|item| item.org_id.as_deref()) {
      let arg = {
        if org_id.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(org_id.len());
          for item in org_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.org_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let org_id_is_null: bool = match search {
      Some(item) => item.org_id_is_null.unwrap_or(false),
      None => false,
    };
    if org_id_is_null {
      where_query.push_str(" and t.org_id is null");
    }
  }
  {
    let org_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.org_id_lbl.clone(),
      None => None,
    };
    if let Some(org_id_lbl) = org_id_lbl {
      let arg = {
        if org_id_lbl.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(org_id_lbl.len());
          for item in org_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.org_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let org_id_lbl_like = match search {
        Some(item) => item.org_id_lbl_like.clone(),
        None => None,
      };
      if let Some(org_id_lbl_like) = org_id_lbl_like {
        if !org_id_lbl_like.is_empty() {
          where_query.push_str(" and org_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&org_id_lbl_like)).into());
        }
      }
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&WxwOaApprovalDetailSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"wxwork_wxw_oa_approval_detail t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_wxw_oa_approval_detail
/// 根据搜索条件和分页查找审批申请详情列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_all_wxw_oa_approval_detail";
  
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
  // 审批申请状态
  if let Some(search) = &search && let Some(sp_status) = &search.sp_status {
    let len = sp_status.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.sp_status.length > {ids_limit}"));
    }
  }
  // 所属组织
  if let Some(search) = &search && let Some(org_id) = &search.org_id {
    let len = org_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.org_id.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  
  if !sort.iter().any(|item| item.prop == "apply_time") {
    sort.push(SortInput {
      prop: "apply_time".into(),
      order: SortOrderEnum::Desc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let is_result_limit = page.as_ref()
    .and_then(|item| item.is_result_limit)
    .unwrap_or(true);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let mut res: Vec<WxwOaApprovalDetailModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let len = res.len();
  let result_limit_num = get_find_all_result_limit();
  
  if is_result_limit && len > result_limit_num {
    return Err(eyre!(
      ServiceException {
        message: format!("{table}.{method}: result length {len} > {result_limit_num}"),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let dict_vec = get_dict(&[
    "wxw_oa_approval_detail_sp_status",
  ]).await?;
  let [
    sp_status_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 审批申请状态
    model.sp_status_lbl = {
      sp_status_dict
        .iter()
        .find(|item| item.val == model.sp_status.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.sp_status.to_string())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_wxw_oa_approval_detail
/// 根据条件查找审批申请详情总数
pub async fn find_count_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_count_wxw_oa_approval_detail";
  
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
  // 审批申请状态
  if let Some(search) = &search && search.sp_status.is_some() {
    let len = search.sp_status.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.sp_status.length > {ids_limit}"));
    }
  }
  // 所属组织
  if let Some(search) = &search && search.org_id.is_some() {
    let len = search.org_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.org_id.length > {ids_limit}"));
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
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}

// MARK: get_field_comments_wxw_oa_approval_detail
/// 获取审批申请详情字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_wxw_oa_approval_detail(
  _options: Option<Options>,
) -> Result<WxwOaApprovalDetailFieldComment> {
  
  let mut field_comments = WxwOaApprovalDetailFieldComment {
    id: "ID".into(),
    sp_no: "审批编号".into(),
    sp_name: "审批申请类型名称".into(),
    sp_status: "审批申请状态".into(),
    sp_status_lbl: "审批申请状态".into(),
    template_id: "模板ID".into(),
    apply_time: "审批申请提交时间".into(),
    apply_time_lbl: "审批申请提交时间".into(),
    applyer_userid: "申请人".into(),
    batch_applyer_userid: "批量申请人".into(),
    raw_data: "原始数据".into(),
    org_id: "所属组织".into(),
    org_id_lbl: "所属组织".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_wxw_oa_approval_detail
/// 根据条件查找第一个审批申请详情, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_one_ok_wxw_oa_approval_detail";
  
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
  
  let wxw_oa_approval_detail_model = find_one_wxw_oa_approval_detail(
    search,
    sort,
    options,
  ).await?;
  
  let Some(wxw_oa_approval_detail_model) = wxw_oa_approval_detail_model else {
    let err_msg = "此 审批申请详情 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(wxw_oa_approval_detail_model)
}

// MARK: find_one_wxw_oa_approval_detail
/// 根据条件查找第一个审批申请详情
#[allow(dead_code)]
pub async fn find_one_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwOaApprovalDetailModel>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_one_wxw_oa_approval_detail";
  
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
  
  let res = find_all_wxw_oa_approval_detail(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<WxwOaApprovalDetailModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_wxw_oa_approval_detail
/// 根据 id 查找审批申请详情, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_by_id_ok_wxw_oa_approval_detail";
  
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
  
  let wxw_oa_approval_detail_model = find_by_id_wxw_oa_approval_detail(
    id,
    options,
  ).await?;
  
  let Some(wxw_oa_approval_detail_model) = wxw_oa_approval_detail_model else {
    let err_msg = String::from("此 审批申请详情 已被删除");
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
  
  Ok(wxw_oa_approval_detail_model)
}

// MARK: find_by_id_wxw_oa_approval_detail
/// 根据 id 查找审批申请详情
pub async fn find_by_id_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  options: Option<Options>,
) -> Result<Option<WxwOaApprovalDetailModel>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_by_id_wxw_oa_approval_detail";
  
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
  
  let search = WxwOaApprovalDetailSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let wxw_oa_approval_detail_model = find_one_wxw_oa_approval_detail(
    search,
    None,
    options,
  ).await?;
  
  Ok(wxw_oa_approval_detail_model)
}

// MARK: find_by_ids_ok_wxw_oa_approval_detail
/// 根据 ids 查找审批申请详情, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_wxw_oa_approval_detail(
  ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_by_ids_ok_wxw_oa_approval_detail";
  
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
  
  let wxw_oa_approval_detail_models = find_by_ids_wxw_oa_approval_detail(
    ids.clone(),
    options,
  ).await?;
  
  if wxw_oa_approval_detail_models.len() != len {
    let err_msg = String::from("此 审批申请详情 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let wxw_oa_approval_detail_models = ids
    .into_iter()
    .map(|id| {
      let model = wxw_oa_approval_detail_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = String::from("此 审批申请详情 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<WxwOaApprovalDetailModel>>>()?;
  
  Ok(wxw_oa_approval_detail_models)
}

// MARK: find_by_ids_wxw_oa_approval_detail
/// 根据 ids 查找审批申请详情
#[allow(dead_code)]
pub async fn find_by_ids_wxw_oa_approval_detail(
  ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_by_ids_wxw_oa_approval_detail";
  
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
  
  let search = WxwOaApprovalDetailSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let wxw_oa_approval_detail_models = find_all_wxw_oa_approval_detail(
    search,
    None,
    None,
    options,
  ).await?;
  
  let wxw_oa_approval_detail_models = ids
    .into_iter()
    .filter_map(|id| {
      wxw_oa_approval_detail_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<WxwOaApprovalDetailModel>>();
  
  Ok(wxw_oa_approval_detail_models)
}

// MARK: exists_wxw_oa_approval_detail
/// 根据搜索条件判断审批申请详情是否存在
#[allow(dead_code)]
pub async fn exists_wxw_oa_approval_detail(
  search: Option<WxwOaApprovalDetailSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "exists_wxw_oa_approval_detail";
  
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
  
  let ids_limit = options
    .as_ref()
    .and_then(|x| x.get_ids_limit())
    .unwrap_or(FIND_ALL_IDS_LIMIT);
  
  if let Some(search) = &search {
    if let Some(id) = &search.id && id.is_empty() {
      return Ok(false);
    }
    if let Some(ids) = &search.ids && ids.is_empty() {
      return Ok(false);
    }
  }
  // 审批申请状态
  if let Some(search) = &search && let Some(sp_status) = &search.sp_status {
    let len = sp_status.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.sp_status.length > {ids_limit}"));
    }
  }
  // 所属组织
  if let Some(search) = &search && let Some(org_id) = &search.org_id {
    let len = org_id.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.org_id.length > {ids_limit}"));
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
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_wxw_oa_approval_detail
/// 根据 id 判断审批申请详情是否存在
#[allow(dead_code)]
pub async fn exists_by_id_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "exists_by_id_wxw_oa_approval_detail";
  
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
  
  let search = WxwOaApprovalDetailSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_wxw_oa_approval_detail(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_wxw_oa_approval_detail
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_wxw_oa_approval_detail(
  search: WxwOaApprovalDetailSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "find_by_unique_wxw_oa_approval_detail";
  
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
    let model = find_by_id_wxw_oa_approval_detail(
      id,
      options,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<WxwOaApprovalDetailModel> = vec![];
  
  let mut models_tmp = if
    search.sp_no.is_none()
  {
    vec![]
  } else {
    let search = WxwOaApprovalDetailSearch {
      tenant_id: search.tenant_id,
      sp_no: search.sp_no.clone(),
      ..Default::default()
    };
    
    find_all_wxw_oa_approval_detail(
      search.into(),
      None,
      sort.clone(),
      options,
    ).await?
  };
  models.append(&mut models_tmp);
  
  Ok(models)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code, unused_variables)]
pub fn equals_by_unique(
  input: &WxwOaApprovalDetailInput,
  model: &WxwOaApprovalDetailModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  
  if
    input.sp_no.as_ref().is_some() && input.sp_no.as_ref().unwrap() == &model.sp_no
  {
    return true;
  }
  false
}

// MARK: check_by_unique_wxw_oa_approval_detail
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_wxw_oa_approval_detail(
  input: WxwOaApprovalDetailInput,
  model: WxwOaApprovalDetailModel,
  options: Option<Options>,
) -> Result<Option<WxwOaApprovalDetailId>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "check_by_unique_wxw_oa_approval_detail";
  
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
    let id = update_by_id_wxw_oa_approval_detail(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "审批申请详情 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_wxw_oa_approval_detail
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_wxw_oa_approval_detail(
  input: WxwOaApprovalDetailInput,
) -> Result<WxwOaApprovalDetailInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 审批申请提交时间
  if input.apply_time.is_none() && let Some(apply_time_lbl) = input.apply_time_lbl.as_ref().filter(|s| !s.is_empty()) {
    input.apply_time = chrono::NaiveDateTime::parse_from_str(apply_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
    if input.apply_time.is_none() {
      input.apply_time = chrono::NaiveDateTime::parse_from_str(apply_time_lbl, "%Y-%m-%d").ok();
    }
    if input.apply_time.is_none() {
      let field_comments = get_field_comments_wxw_oa_approval_detail(
        None,
      ).await?;
      let column_comment = field_comments.apply_time;
      
      let err_msg = "日期格式错误";
      return Err(eyre!("{column_comment} {err_msg}"));
    }
  }
  
  let dict_vec = get_dict(&[
    "wxw_oa_approval_detail_sp_status",
  ]).await?;
  
  // 审批申请状态
  if input.sp_status.is_none() {
    let sp_status_dict = &dict_vec[0];
    if let Some(sp_status_lbl) = input.sp_status_lbl.clone() {
      input.sp_status = sp_status_dict
        .iter()
        .find(|item| {
          item.lbl == sp_status_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 审批申请状态
  if
    input.sp_status_lbl.is_some() && !input.sp_status_lbl.as_ref().unwrap().is_empty()
    && input.sp_status.is_none()
  {
    let sp_status_dict = &dict_vec[0];
    let dict_model = sp_status_dict.iter().find(|item| {
      item.lbl == input.sp_status_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.sp_status = val.parse::<u8>()?.into();
    }
  } else if
    (input.sp_status_lbl.is_none() || input.sp_status_lbl.as_ref().unwrap().is_empty())
    && input.sp_status.is_some()
  {
    let sp_status_dict = &dict_vec[0];
    let dict_model = sp_status_dict.iter().find(|item| {
      item.val == input.sp_status.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.sp_status_lbl = lbl;
  }
  
  // 所属组织
  if input.org_id_lbl.is_some()
    && !input.org_id_lbl.as_ref().unwrap().is_empty()
    && input.org_id.is_none()
  {
    input.org_id_lbl = input.org_id_lbl.map(|item| 
      String::from(item.trim())
    );
    let model = crate::base::org::org_dao::find_one_org(
      crate::base::org::org_model::OrgSearch {
        lbl: input.org_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.org_id = model.id.into();
    }
  } else if
    (input.org_id_lbl.is_none() || input.org_id_lbl.as_ref().unwrap().is_empty())
    && input.org_id.is_some()
  {
    let org_model = crate::base::org::org_dao::find_one_org(
      crate::base::org::org_model::OrgSearch {
        id: input.org_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(org_model) = org_model {
      input.org_id_lbl = org_model.lbl.into();
    }
  }
  
  Ok(input)
}

// MARK: creates_return_wxw_oa_approval_detail
/// 批量创建审批申请详情并返回
#[allow(dead_code)]
pub async fn creates_return_wxw_oa_approval_detail(
  inputs: Vec<WxwOaApprovalDetailInput>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailModel>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "creates_return_wxw_oa_approval_detail";
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let ids = _creates(
    inputs.clone(),
    options,
  ).await?;
  
  let models_wxw_oa_approval_detail = find_by_ids_wxw_oa_approval_detail(
    ids,
    options,
  ).await?;
  
  Ok(models_wxw_oa_approval_detail)
}

// MARK: creates_wxw_oa_approval_detail
/// 批量创建审批申请详情
pub async fn creates_wxw_oa_approval_detail(
  inputs: Vec<WxwOaApprovalDetailInput>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailId>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "creates_wxw_oa_approval_detail";
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let ids = _creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 批量创建审批申请详情
#[allow(unused_variables, clippy::redundant_locals, unused_mut)]
async fn _creates(
  inputs: Vec<WxwOaApprovalDetailInput>,
  options: Option<Options>,
) -> Result<Vec<WxwOaApprovalDetailId>> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();

  let auth_org_id = get_auth_org_id();
  let mut auth_org_id_lbl = String::from("");
  if let Some(auth_org_id) = auth_org_id {
    let org_model = crate::base::org::org_dao::find_by_id_org(
      auth_org_id,
      options,
    ).await?;
    if let Some(org_model) = org_model {
      auth_org_id_lbl = org_model.lbl;
    }
  }
  let mut inputs = inputs;
  for input in &mut inputs {
    if input.org_id.is_none_or(|x| x.is_empty()) {
      input.org_id = auth_org_id;
      input.org_id_lbl = Some(auth_org_id_lbl.clone());
    }
  }
  
  let mut ids2: Vec<WxwOaApprovalDetailId> = vec![];
  let mut inputs2: Vec<WxwOaApprovalDetailInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }

    let mut input = input;

    // 所属组织
    if (input.org_id_lbl.is_none() || input.org_id_lbl.as_ref().unwrap().is_empty())
      && input.org_id.is_some()
      && !input.org_id.as_ref().unwrap().is_empty()
    {
      let org_model = crate::base::org::org_dao::find_by_id_org(
        input.org_id.clone().unwrap(),
        Some(Options::new().set_is_debug(Some(false))),
      ).await?;
      if let Some(org_model) = org_model {
        input.org_id_lbl = org_model.lbl.into();
      }
    }
    let input = input;
    
    let old_models = find_by_unique_wxw_oa_approval_detail(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxwOaApprovalDetailId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_wxw_oa_approval_detail(
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
  let mut sql_fields = String::with_capacity(80 * 11 * 3 + 60);
  
  sql_fields += "id";
  sql_fields += ",tenant_id";
  // 审批编号
  sql_fields += ",sp_no";
  // 审批申请类型名称
  sql_fields += ",sp_name";
  // 审批申请状态
  sql_fields += ",sp_status";
  // 模板ID
  sql_fields += ",template_id";
  // 审批申请提交时间
  sql_fields += ",apply_time";
  // 申请人
  sql_fields += ",applyer_userid";
  // 批量申请人
  sql_fields += ",batch_applyer_userid";
  // 原始数据
  sql_fields += ",raw_data";
  // 所属组织
  sql_fields += ",org_id_lbl";
  // 所属组织
  sql_fields += ",org_id";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity(((2 * 11 + 3) * inputs2_len) * 3);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: WxwOaApprovalDetailId = get_short_uuid().into();
    ids2.push(id);
    
    inputs2_ids.push(id);
    
    sql_values += "(?";
    args.push(id.into());
    
    if let Some(tenant_id) = input.tenant_id {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else if let Some(tenant_id) = get_auth_tenant_id() {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else {
      sql_values += ",default";
    }
    // 审批编号
    if let Some(sp_no) = input.sp_no {
      sql_values += ",?";
      args.push(sp_no.into());
    } else {
      sql_values += ",default";
    }
    // 审批申请类型名称
    if let Some(sp_name) = input.sp_name {
      sql_values += ",?";
      args.push(sp_name.into());
    } else {
      sql_values += ",default";
    }
    // 审批申请状态
    if let Some(sp_status) = input.sp_status {
      sql_values += ",?";
      args.push(sp_status.into());
    } else {
      sql_values += ",default";
    }
    // 模板ID
    if let Some(template_id) = input.template_id {
      sql_values += ",?";
      args.push(template_id.into());
    } else {
      sql_values += ",default";
    }
    // 审批申请提交时间
    if let Some(apply_time) = input.apply_time {
      sql_values += ",?";
      args.push(apply_time.into());
    } else if input.apply_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 申请人
    if let Some(applyer_userid) = input.applyer_userid {
      sql_values += ",?";
      args.push(applyer_userid.into());
    } else {
      sql_values += ",default";
    }
    // 批量申请人
    if let Some(batch_applyer_userid) = input.batch_applyer_userid {
      sql_values += ",?";
      args.push(batch_applyer_userid.into());
    } else {
      sql_values += ",default";
    }
    // 原始数据
    if let Some(raw_data) = input.raw_data {
      sql_values += ",?";
      args.push(raw_data.into());
    } else {
      sql_values += ",default";
    }
    // 所属组织
    if let Some(org_id_lbl) = input.org_id_lbl {
      sql_values += ",?";
      args.push(org_id_lbl.into());
    } else {
      sql_values += ",default";
    }
    // 所属组织
    if let Some(org_id) = input.org_id {
      sql_values += ",?";
      args.push(org_id.into());
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
  
  let affected_rows = execute(
    sql,
    args,
    options,
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_wxw_oa_approval_detail
/// 创建审批申请详情并返回
#[allow(dead_code)]
pub async fn create_return_wxw_oa_approval_detail(
  #[allow(unused_mut)]
  mut input: WxwOaApprovalDetailInput,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  let id = create_wxw_oa_approval_detail(
    input.clone(),
    options,
  ).await?;
  
  let model_wxw_oa_approval_detail = find_by_id_wxw_oa_approval_detail(
    id,
    options,
  ).await?;
  
  let model_wxw_oa_approval_detail = match model_wxw_oa_approval_detail {
    Some(model) => model,
    None => {
      let err_msg = "create_return_wxw_oa_approval_detail: model_wxw_oa_approval_detail.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_wxw_oa_approval_detail)
}

// MARK: create_wxw_oa_approval_detail
/// 创建审批申请详情
#[allow(dead_code)]
pub async fn create_wxw_oa_approval_detail(
  #[allow(unused_mut)]
  mut input: WxwOaApprovalDetailInput,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailId> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "create_wxw_oa_approval_detail";
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
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

// MARK: update_tenant_by_id_wxw_oa_approval_detail
/// 审批申请详情根据id修改租户id
pub async fn update_tenant_by_id_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "update_tenant_by_id_wxw_oa_approval_detail";
  
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

// MARK: update_by_id_wxw_oa_approval_detail
/// 根据 id 修改审批申请详情
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  mut input: WxwOaApprovalDetailInput,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailId> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "update_by_id_wxw_oa_approval_detail";
  
  let is_debug = get_is_debug(options.as_ref());
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

  // 所属组织
  if (input.org_id_lbl.is_none() || input.org_id_lbl.as_ref().unwrap().is_empty())
    && input.org_id.is_some()
    && !input.org_id.as_ref().unwrap().is_empty()
  {
    let org_model = crate::base::org::org_dao::find_by_id_org(
      input.org_id.clone().unwrap(),
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(org_model) = org_model {
      input.org_id_lbl = org_model.lbl.into();
    }
  }
  
  let old_model = find_by_id_wxw_oa_approval_detail(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      return Ok(id);
    }
  };
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique_wxw_oa_approval_detail(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxwOaApprovalDetailModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "审批申请详情 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity((80 * 11 + 20) * 3);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 审批编号
  if let Some(sp_no) = input.sp_no.clone() {
    field_num += 1;
    sql_fields += "sp_no=?,";
    args.push(sp_no.into());
  }
  // 审批申请类型名称
  if let Some(sp_name) = input.sp_name.clone() {
    field_num += 1;
    sql_fields += "sp_name=?,";
    args.push(sp_name.into());
  }
  // 审批申请状态
  if let Some(sp_status) = input.sp_status {
    field_num += 1;
    sql_fields += "sp_status=?,";
    args.push(sp_status.into());
  }
  // 模板ID
  if let Some(template_id) = input.template_id.clone() {
    field_num += 1;
    sql_fields += "template_id=?,";
    args.push(template_id.into());
  }
  // 审批申请提交时间
  if let Some(apply_time) = input.apply_time {
    field_num += 1;
    sql_fields += "apply_time=?,";
    args.push(apply_time.into());
  } else if input.apply_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "apply_time=null,";
  }
  // 申请人
  if let Some(applyer_userid) = input.applyer_userid.clone() {
    field_num += 1;
    sql_fields += "applyer_userid=?,";
    args.push(applyer_userid.into());
  }
  // 批量申请人
  if let Some(batch_applyer_userid) = input.batch_applyer_userid.clone() {
    field_num += 1;
    sql_fields += "batch_applyer_userid=?,";
    args.push(batch_applyer_userid.into());
  }
  // 原始数据
  if let Some(raw_data) = input.raw_data.clone() {
    field_num += 1;
    sql_fields += "raw_data=?,";
    args.push(raw_data.into());
  }
  // 所属组织
  if let Some(org_id_lbl) = input.org_id_lbl {
    field_num += 1;
    sql_fields += "org_id_lbl=?,";
    args.push(org_id_lbl.into());
  }
  // 所属组织
  if let Some(org_id) = input.org_id {
    field_num += 1;
    sql_fields += "org_id=?,";
    args.push(org_id.into());
  }
  
  if field_num > 0 {
    
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
    
  }
  
  Ok(id)
}

// MARK: update_by_id_return_wxw_oa_approval_detail
/// 根据 id 更新审批申请详情, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_wxw_oa_approval_detail(
  id: WxwOaApprovalDetailId,
  input: WxwOaApprovalDetailInput,
  options: Option<Options>,
) -> Result<WxwOaApprovalDetailModel> {
  
  update_by_id_wxw_oa_approval_detail(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_wxw_oa_approval_detail(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "审批申请详情 update_by_id_return_wxw_oa_approval_detail id: {id}",
    )),
  }
}

// MARK: delete_by_ids_wxw_oa_approval_detail
/// 根据 ids 删除审批申请详情
#[allow(unused_variables)]
pub async fn delete_by_ids_wxw_oa_approval_detail(
  ids: Vec<WxwOaApprovalDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxw_oa_approval_detail();
  let method = "delete_by_ids_wxw_oa_approval_detail";
  
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
  
  let old_models = find_by_ids_wxw_oa_approval_detail(
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
    
    let sql = format!("delete from {table} where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: validate_option_wxw_oa_approval_detail
/// 校验审批申请详情是否存在
#[allow(dead_code)]
pub async fn validate_option_wxw_oa_approval_detail(
  model: Option<WxwOaApprovalDetailModel>,
) -> Result<WxwOaApprovalDetailModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = String::from("审批申请详情不存在");
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
