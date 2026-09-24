pub mod seo_model;
pub mod seo_resolver;
pub mod seo_graphql;
pub mod seo_service;
pub mod seo_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(seo_dao::sync_usr_lbl_by_usr_id_seo);
}
