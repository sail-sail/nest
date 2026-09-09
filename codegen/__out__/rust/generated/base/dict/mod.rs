pub mod dict_model;
pub mod dict_resolver;
pub mod dict_graphql;
pub mod dict_service;
pub mod dict_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(dict_dao::sync_usr_lbl_by_usr_id_dict);
}
