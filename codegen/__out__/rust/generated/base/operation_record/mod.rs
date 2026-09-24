pub mod operation_record_model;
pub mod operation_record_resolver;
pub mod operation_record_graphql;
pub mod operation_record_service;
pub mod operation_record_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(operation_record_dao::sync_usr_lbl_by_usr_id_operation_record);
}
