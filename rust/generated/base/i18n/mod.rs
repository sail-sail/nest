pub mod i18n_model;
pub mod i18n_resolver;
pub mod i18n_graphql;
pub mod i18n_service;
pub mod i18n_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(i18n_dao::sync_usr_lbl_by_usr_id_i18n);
}
