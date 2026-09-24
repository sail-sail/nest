pub mod icon_model;
pub mod icon_resolver;
pub mod icon_graphql;
pub mod icon_service;
pub mod icon_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(icon_dao::sync_usr_lbl_by_usr_id_icon);
}
