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
  
  let futures: Vec<std::pin::Pin<Box<dyn std::future::Future<Output = Result<u64>> + Send>>> = vec![
    
    Box::pin(crate::base::role::role_dao::sync_usr_lbl_by_usr_id_role(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::tenant::tenant_dao::sync_usr_lbl_by_usr_id_tenant(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::domain::domain_dao::sync_usr_lbl_by_usr_id_domain(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::usr::usr_dao::sync_usr_lbl_by_usr_id_usr(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::login_log::login_log_dao::sync_usr_lbl_by_usr_id_login_log(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::menu::menu_dao::sync_usr_lbl_by_usr_id_menu(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::lang::lang_dao::sync_usr_lbl_by_usr_id_lang(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::i18n::i18n_dao::sync_usr_lbl_by_usr_id_i18n(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::data_permit::data_permit_dao::sync_usr_lbl_by_usr_id_data_permit(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::options::options_dao::sync_usr_lbl_by_usr_id_options(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::optbiz::optbiz_dao::sync_usr_lbl_by_usr_id_optbiz(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::operation_record::operation_record_dao::sync_usr_lbl_by_usr_id_operation_record(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::org::org_dao::sync_usr_lbl_by_usr_id_org(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dept::dept_dao::sync_usr_lbl_by_usr_id_dept(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dict::dict_dao::sync_usr_lbl_by_usr_id_dict(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dict_detail::dict_detail_dao::sync_usr_lbl_by_usr_id_dict_detail(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dictbiz::dictbiz_dao::sync_usr_lbl_by_usr_id_dictbiz(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dictbiz_detail::dictbiz_detail_dao::sync_usr_lbl_by_usr_id_dictbiz_detail(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::icon::icon_dao::sync_usr_lbl_by_usr_id_icon(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dyn_page::dyn_page_dao::sync_usr_lbl_by_usr_id_dyn_page(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dyn_page_field::dyn_page_field_dao::sync_usr_lbl_by_usr_id_dyn_page_field(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dyn_page_val::dyn_page_val_dao::sync_usr_lbl_by_usr_id_dyn_page_val(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::dyn_page_data::dyn_page_data_dao::sync_usr_lbl_by_usr_id_dyn_page_data(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::message::message_dao::sync_usr_lbl_by_usr_id_message(
      usr_id,
      options,
    )),
    
    Box::pin(crate::base::message_receiver::message_receiver_dao::sync_usr_lbl_by_usr_id_message_receiver(
      usr_id,
      options,
    )),
    
    Box::pin(crate::wxwork::wxw_app::wxw_app_dao::sync_usr_lbl_by_usr_id_wxw_app(
      usr_id,
      options,
    )),
    
    Box::pin(crate::wxwork::wxw_app_token::wxw_app_token_dao::sync_usr_lbl_by_usr_id_wxw_app_token(
      usr_id,
      options,
    )),
    
    Box::pin(crate::wxwork::wxw_usr::wxw_usr_dao::sync_usr_lbl_by_usr_id_wxw_usr(
      usr_id,
      options,
    )),
    
    Box::pin(crate::wxwork::wxw_msg::wxw_msg_dao::sync_usr_lbl_by_usr_id_wxw_msg(
      usr_id,
      options,
    )),
  ];

  let results = futures::future::try_join_all(futures).await?;
  let num = results.into_iter().sum::<u64>();

  Ok(num)
}