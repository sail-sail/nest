pub mod wxw_usr_model;
pub mod wxw_usr_resolver;
pub mod wxw_usr_graphql;
pub mod wxw_usr_service;
pub mod wxw_usr_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxw_usr_dao::sync_usr_lbl_by_usr_id_wxw_usr);
}
