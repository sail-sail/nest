pub mod cron_job;
pub mod cron_job_log;
pub mod cron_job_log_detail;
pub mod job;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct CronGenQuery(
  self::cron_job::cron_job_graphql::CronJobGenQuery,
  self::cron_job_log::cron_job_log_graphql::CronJobLogGenQuery,
  self::cron_job_log_detail::cron_job_log_detail_graphql::CronJobLogDetailGenQuery,
  self::job::job_graphql::JobGenQuery,
);

#[derive(MergedObject, Default)]
pub struct CronGenMutation(
  self::cron_job::cron_job_graphql::CronJobGenMutation,
  self::cron_job_log::cron_job_log_graphql::CronJobLogGenMutation,
  self::cron_job_log_detail::cron_job_log_detail_graphql::CronJobLogDetailGenMutation,
  self::job::job_graphql::JobGenMutation,
);
