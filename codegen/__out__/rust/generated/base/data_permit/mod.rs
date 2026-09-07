pub mod data_permit_model;
pub mod data_permit_resolver;
pub mod data_permit_graphql;
pub mod data_permit_service;
pub mod data_permit_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(data_permit_dao::sync_usr_lbl_by_usr_id_data_permit);
}
