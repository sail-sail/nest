pub mod cron_job_model;
pub mod cron_job_resolver;
pub mod cron_job_graphql;
pub mod cron_job_service;
pub mod cron_job_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(cron_job_dao::sync_usr_lbl_by_usr_id_cron_job);
}
