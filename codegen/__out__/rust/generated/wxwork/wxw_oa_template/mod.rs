pub mod wxw_oa_template_model;
pub mod wxw_oa_template_resolver;
pub mod wxw_oa_template_graphql;
pub mod wxw_oa_template_service;
pub mod wxw_oa_template_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(wxw_oa_template_dao::sync_usr_lbl_by_usr_id_wxw_oa_template);
}
