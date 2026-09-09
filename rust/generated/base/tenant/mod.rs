pub mod tenant_model;
pub mod tenant_resolver;
pub mod tenant_graphql;
pub mod tenant_service;
pub mod tenant_service2;
pub mod tenant_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(tenant_dao::sync_usr_lbl_by_usr_id_tenant);
}
