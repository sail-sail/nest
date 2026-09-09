pub mod role_model;
pub mod role_resolver;
pub mod role_graphql;
pub mod role_service;
pub mod role_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(role_dao::sync_usr_lbl_by_usr_id_role);
}
