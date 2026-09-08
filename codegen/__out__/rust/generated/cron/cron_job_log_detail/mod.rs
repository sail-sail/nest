pub mod cron_job_log_detail_model;
pub mod cron_job_log_detail_resolver;
pub mod cron_job_log_detail_graphql;
pub mod cron_job_log_detail_service;
pub mod cron_job_log_detail_dao;

pub fn init() {
  crate::base::usr::usr_sync_dao::add_sync_usr_lbl_by_usr_id_callback(cron_job_log_detail_dao::sync_usr_lbl_by_usr_id_cron_job_log_detail);
}
