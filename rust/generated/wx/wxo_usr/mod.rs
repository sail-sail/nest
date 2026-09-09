pub mod wxo_usr_model;
pub mod wxo_usr_resolver;
pub mod wxo_usr_graphql;
pub mod wxo_usr_service;
pub mod wxo_usr_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxo_usr_dao::sync_usr_lbl_by_usr_id_wxo_usr);
}
