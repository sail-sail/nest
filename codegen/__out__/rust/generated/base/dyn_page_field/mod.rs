pub mod dyn_page_field_model;
pub mod dyn_page_field_resolver;
pub mod dyn_page_field_graphql;
pub mod dyn_page_field_service;
pub mod dyn_page_field_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(dyn_page_field_dao::sync_usr_lbl_by_usr_id_dyn_page_field);
}
