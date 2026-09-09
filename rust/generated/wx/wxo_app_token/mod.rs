pub mod wxo_app_token_model;
pub mod wxo_app_token_resolver;
pub mod wxo_app_token_graphql;
pub mod wxo_app_token_service;
pub mod wxo_app_token_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxo_app_token_dao::sync_usr_lbl_by_usr_id_wxo_app_token);
}
