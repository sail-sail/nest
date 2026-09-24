pub mod dyn_page_val_model;
pub mod dyn_page_val_resolver;
pub mod dyn_page_val_graphql;
pub mod dyn_page_val_service;
pub mod dyn_page_val_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(dyn_page_val_dao::sync_usr_lbl_by_usr_id_dyn_page_val);
}
