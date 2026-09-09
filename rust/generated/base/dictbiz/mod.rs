pub mod dictbiz_model;
pub mod dictbiz_resolver;
pub mod dictbiz_graphql;
pub mod dictbiz_service;
pub mod dictbiz_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(dictbiz_dao::sync_usr_lbl_by_usr_id_dictbiz);
}
