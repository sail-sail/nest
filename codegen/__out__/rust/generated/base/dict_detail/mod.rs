pub mod dict_detail_model;
pub mod dict_detail_resolver;
pub mod dict_detail_graphql;
pub mod dict_detail_service;
pub mod dict_detail_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(dict_detail_dao::sync_usr_lbl_by_usr_id_dict_detail);
}
