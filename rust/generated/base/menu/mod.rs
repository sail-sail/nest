pub mod menu_model;
pub mod menu_resolver;
pub mod menu_graphql;
pub mod menu_service;
pub mod menu_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(menu_dao::sync_usr_lbl_by_usr_id_menu);
}
