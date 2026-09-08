pub mod job_model;
pub mod job_resolver;
pub mod job_graphql;
pub mod job_service;
pub mod job_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(job_dao::sync_usr_lbl_by_usr_id_job);
}
