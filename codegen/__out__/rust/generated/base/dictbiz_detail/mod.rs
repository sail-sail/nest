pub mod dictbiz_detail_model;
pub mod dictbiz_detail_resolver;
pub mod dictbiz_detail_graphql;
pub mod dictbiz_detail_service;
pub mod dictbiz_detail_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(dictbiz_detail_dao::sync_usr_lbl_by_usr_id_dictbiz_detail);
}
