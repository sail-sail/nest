pub mod wxw_msg_model;
pub mod wxw_msg_resolver;
pub mod wxw_msg_graphql;
pub mod wxw_msg_service;
pub mod wxw_msg_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxw_msg_dao::sync_usr_lbl_by_usr_id_wxw_msg);
}
