pub mod dept_model;
pub mod dept_resolver;
pub mod dept_graphql;
pub mod dept_service;
pub mod dept_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(dept_dao::sync_usr_lbl_by_usr_id_dept);
}
