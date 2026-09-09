pub mod wxo_app_model;
pub mod wxo_app_resolver;
pub mod wxo_app_graphql;
pub mod wxo_app_service;
pub mod wxo_app_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxo_app_dao::sync_usr_lbl_by_usr_id_wxo_app);
}
