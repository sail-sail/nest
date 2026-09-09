pub mod lang_model;
pub mod lang_resolver;
pub mod lang_graphql;
pub mod lang_service;
pub mod lang_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(lang_dao::sync_usr_lbl_by_usr_id_lang);
}
