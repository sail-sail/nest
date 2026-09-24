pub mod comp_cnf_model;
pub mod comp_cnf_resolver;
pub mod comp_cnf_graphql;
pub mod comp_cnf_service;
pub mod comp_cnf_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(comp_cnf_dao::sync_usr_lbl_by_usr_id_comp_cnf);
}
