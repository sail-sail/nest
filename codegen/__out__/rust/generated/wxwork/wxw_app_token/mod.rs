pub mod wxw_app_token_model;
pub mod wxw_app_token_resolver;
pub mod wxw_app_token_graphql;
pub mod wxw_app_token_service;
pub mod wxw_app_token_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxw_app_token_dao::sync_usr_lbl_by_usr_id_wxw_app_token);
}
