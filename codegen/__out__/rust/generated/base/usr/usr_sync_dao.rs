#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

use color_eyre::eyre::Result;
#[allow(unused_imports)]
use tracing::info;

use crate::common::context::{
  Options,
  get_is_debug,
  get_req_id,
};

use super::usr_model::UsrId;

use crate::base::role::role_dao::sync_usr_lbl_by_usr_id_role;

use crate::base::tenant::tenant_dao::sync_usr_lbl_by_usr_id_tenant;

use crate::base::domain::domain_dao::sync_usr_lbl_by_usr_id_domain;

use crate::base::usr::usr_dao::sync_usr_lbl_by_usr_id_usr;

use crate::base::login_log::login_log_dao::sync_usr_lbl_by_usr_id_login_log;

use crate::base::menu::menu_dao::sync_usr_lbl_by_usr_id_menu;

use crate::base::lang::lang_dao::sync_usr_lbl_by_usr_id_lang;

use crate::base::i18n::i18n_dao::sync_usr_lbl_by_usr_id_i18n;

use crate::base::data_permit::data_permit_dao::sync_usr_lbl_by_usr_id_data_permit;

use crate::base::options::options_dao::sync_usr_lbl_by_usr_id_options;

use crate::base::optbiz::optbiz_dao::sync_usr_lbl_by_usr_id_optbiz;

use crate::base::operation_record::operation_record_dao::sync_usr_lbl_by_usr_id_operation_record;

use crate::base::org::org_dao::sync_usr_lbl_by_usr_id_org;

use crate::base::dept::dept_dao::sync_usr_lbl_by_usr_id_dept;

use crate::base::dict::dict_dao::sync_usr_lbl_by_usr_id_dict;

use crate::base::dict_detail::dict_detail_dao::sync_usr_lbl_by_usr_id_dict_detail;

use crate::base::dictbiz::dictbiz_dao::sync_usr_lbl_by_usr_id_dictbiz;

use crate::base::dictbiz_detail::dictbiz_detail_dao::sync_usr_lbl_by_usr_id_dictbiz_detail;

use crate::base::icon::icon_dao::sync_usr_lbl_by_usr_id_icon;

use crate::base::dyn_page::dyn_page_dao::sync_usr_lbl_by_usr_id_dyn_page;

use crate::base::dyn_page_field::dyn_page_field_dao::sync_usr_lbl_by_usr_id_dyn_page_field;

use crate::base::dyn_page_val::dyn_page_val_dao::sync_usr_lbl_by_usr_id_dyn_page_val;

use crate::base::dyn_page_data::dyn_page_data_dao::sync_usr_lbl_by_usr_id_dyn_page_data;

use crate::bpm::process_def::process_def_dao::sync_usr_lbl_by_usr_id_process_def;

use crate::bpm::process_revision::process_revision_dao::sync_usr_lbl_by_usr_id_process_revision;

use crate::bpm::process_inst::process_inst_dao::sync_usr_lbl_by_usr_id_process_inst;

use crate::bpm::node_inst::node_inst_dao::sync_usr_lbl_by_usr_id_node_inst;

use crate::bpm::task::task_dao::sync_usr_lbl_by_usr_id_task;

use crate::bpm::transfer::transfer_dao::sync_usr_lbl_by_usr_id_transfer;

use crate::bpm::log::log_dao::sync_usr_lbl_by_usr_id_log;

/// 根据 usr_id 同步所有表中的创建人/更新人/删除人标签
pub async fn sync_usr_lbl_by_usr_id(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<u64> {
  let method = "sync_usr_lbl_by_usr_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{method}:");
    msg += &format!(" usr_id: {usr_id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if usr_id.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  
  num += sync_usr_lbl_by_usr_id_role(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_tenant(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_domain(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_usr(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_login_log(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_menu(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_lang(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_i18n(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_data_permit(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_options(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_optbiz(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_operation_record(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_org(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dept(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dict(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dict_detail(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dictbiz(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dictbiz_detail(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_icon(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dyn_page(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dyn_page_field(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dyn_page_val(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_dyn_page_data(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_process_def(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_process_revision(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_process_inst(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_node_inst(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_task(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_transfer(
    usr_id.clone(),
    options,
  ).await?;
  
  num += sync_usr_lbl_by_usr_id_log(
    usr_id.clone(),
    options,
  ).await?;
  
  Ok(num)
}