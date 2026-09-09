pub mod login_log_model;
pub mod login_log_resolver;
pub mod login_log_graphql;
pub mod login_log_service;
pub mod login_log_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(login_log_dao::sync_usr_lbl_by_usr_id_login_log);
}
