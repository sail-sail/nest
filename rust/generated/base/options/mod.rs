pub mod options_model;
pub mod options_resolver;
pub mod options_graphql;
pub mod options_service;
pub mod options_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(options_dao::sync_usr_lbl_by_usr_id_options);
}
