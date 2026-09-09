pub mod tsdb_app_model;
pub mod tsdb_app_resolver;
pub mod tsdb_app_graphql;
pub mod tsdb_app_service;
pub mod tsdb_app_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(tsdb_app_dao::sync_usr_lbl_by_usr_id_tsdb_app);
}
