pub mod cron_job_log_model;
pub mod cron_job_log_resolver;
pub mod cron_job_log_graphql;
pub mod cron_job_log_service;
pub mod cron_job_log_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(cron_job_log_dao::sync_usr_lbl_by_usr_id_cron_job_log);
}
