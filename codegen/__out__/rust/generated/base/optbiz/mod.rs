pub mod optbiz_model;
pub mod optbiz_resolver;
pub mod optbiz_graphql;
pub mod optbiz_service;
pub mod optbiz_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(optbiz_dao::sync_usr_lbl_by_usr_id_optbiz);
}
