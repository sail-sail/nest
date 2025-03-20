pub mod base;
pub mod cron;


use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  crate::common::oss::oss_graphql::OssQuery,
  crate::r#gen::base::background_task::background_task_graphql::BackgroundTaskGenQuery,
  crate::r#gen::base::data_permit::data_permit_graphql::DataPermitGenQuery,
  crate::r#gen::base::dept::dept_graphql::DeptGenQuery,
  crate::r#gen::base::dict::dict_graphql::DictGenQuery,
  crate::r#gen::base::dict_detail::dict_detail_graphql::DictDetailGenQuery,
  crate::r#gen::base::dictbiz::dictbiz_graphql::DictbizGenQuery,
  crate::r#gen::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenQuery,
  crate::r#gen::base::domain::domain_graphql::DomainGenQuery,
  crate::r#gen::base::field_permit::field_permit_graphql::FieldPermitGenQuery,
  crate::r#gen::base::i18n::i18n_graphql::I18nGenQuery,
  crate::r#gen::base::icon::icon_graphql::IconGenQuery,
  crate::r#gen::base::lang::lang_graphql::LangGenQuery,
  crate::r#gen::base::login_log::login_log_graphql::LoginLogGenQuery,
  crate::r#gen::base::menu::menu_graphql::MenuGenQuery,
  crate::r#gen::base::operation_record::operation_record_graphql::OperationRecordGenQuery,
  crate::r#gen::base::optbiz::optbiz_graphql::OptbizGenQuery,
  crate::r#gen::base::options::options_graphql::OptionsGenQuery,
  crate::r#gen::base::org::org_graphql::OrgGenQuery,
  crate::r#gen::base::permit::permit_graphql::PermitGenQuery,
  crate::r#gen::base::role::role_graphql::RoleGenQuery,
  crate::r#gen::base::tenant::tenant_graphql::TenantGenQuery,
  crate::r#gen::base::usr::usr_graphql::UsrGenQuery,
  crate::r#gen::cron::cron_job::cron_job_graphql::CronJobGenQuery,
  crate::r#gen::cron::cron_job_log::cron_job_log_graphql::CronJobLogGenQuery,
  crate::r#gen::cron::cron_job_log_detail::cron_job_log_detail_graphql::CronJobLogDetailGenQuery,
  crate::r#gen::cron::job::job_graphql::JobGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  crate::r#gen::base::background_task::background_task_graphql::BackgroundTaskGenMutation,
  crate::r#gen::base::data_permit::data_permit_graphql::DataPermitGenMutation,
  crate::r#gen::base::dept::dept_graphql::DeptGenMutation,
  crate::r#gen::base::dict::dict_graphql::DictGenMutation,
  crate::r#gen::base::dict_detail::dict_detail_graphql::DictDetailGenMutation,
  crate::r#gen::base::dictbiz::dictbiz_graphql::DictbizGenMutation,
  crate::r#gen::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenMutation,
  crate::r#gen::base::domain::domain_graphql::DomainGenMutation,
  crate::r#gen::base::field_permit::field_permit_graphql::FieldPermitGenMutation,
  crate::r#gen::base::i18n::i18n_graphql::I18nGenMutation,
  crate::r#gen::base::icon::icon_graphql::IconGenMutation,
  crate::r#gen::base::lang::lang_graphql::LangGenMutation,
  crate::r#gen::base::login_log::login_log_graphql::LoginLogGenMutation,
  crate::r#gen::base::menu::menu_graphql::MenuGenMutation,
  crate::r#gen::base::operation_record::operation_record_graphql::OperationRecordGenMutation,
  crate::r#gen::base::optbiz::optbiz_graphql::OptbizGenMutation,
  crate::r#gen::base::options::options_graphql::OptionsGenMutation,
  crate::r#gen::base::org::org_graphql::OrgGenMutation,
  crate::r#gen::base::permit::permit_graphql::PermitGenMutation,
  crate::r#gen::base::role::role_graphql::RoleGenMutation,
  crate::r#gen::base::tenant::tenant_graphql::TenantGenMutation,
  crate::r#gen::base::usr::usr_graphql::UsrGenMutation,
  crate::r#gen::cron::cron_job::cron_job_graphql::CronJobGenMutation,
  crate::r#gen::cron::cron_job_log::cron_job_log_graphql::CronJobLogGenMutation,
  crate::r#gen::cron::cron_job_log_detail::cron_job_log_detail_graphql::CronJobLogDetailGenMutation,
  crate::r#gen::cron::job::job_graphql::JobGenMutation,
);
