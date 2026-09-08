pub mod domain_model;
pub mod domain_resolver;
pub mod domain_graphql;
pub mod domain_service;
pub mod domain_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(domain_dao::sync_usr_lbl_by_usr_id_domain);
}
