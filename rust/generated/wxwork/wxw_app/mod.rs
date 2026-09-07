pub mod wxw_app_model;
pub mod wxw_app_resolver;
pub mod wxw_app_graphql;
pub mod wxw_app_service;
pub mod wxw_app_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxw_app_dao::sync_usr_lbl_by_usr_id_wxw_app);
}
