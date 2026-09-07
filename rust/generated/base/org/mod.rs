pub mod org_model;
pub mod org_resolver;
pub mod org_graphql;
pub mod org_service;
pub mod org_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(org_dao::sync_usr_lbl_by_usr_id_org);
}
