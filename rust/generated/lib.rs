#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod cron;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::background_task::background_task_graphql::BackgroundTaskGenQuery,
  base::data_permit::data_permit_graphql::DataPermitGenQuery,
  base::dept::dept_graphql::DeptGenQuery,
  base::dict::dict_graphql::DictGenQuery,
  base::dict_detail::dict_detail_graphql::DictDetailGenQuery,
  base::dictbiz::dictbiz_graphql::DictbizGenQuery,
  base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenQuery,
  base::domain::domain_graphql::DomainGenQuery,
  base::dyn_page::dyn_page_graphql::DynPageGenQuery,
  base::dyn_page_data::dyn_page_data_graphql::DynPageDataGenQuery,
  base::dyn_page_field::dyn_page_field_graphql::DynPageFieldGenQuery,
  base::dyn_page_val::dyn_page_val_graphql::DynPageValGenQuery,
  base::field_permit::field_permit_graphql::FieldPermitGenQuery,
  base::i18n::i18n_graphql::I18nGenQuery,
  base::icon::icon_graphql::IconGenQuery,
  base::lang::lang_graphql::LangGenQuery,
  base::login_log::login_log_graphql::LoginLogGenQuery,
  base::menu::menu_graphql::MenuGenQuery,
  base::operation_record::operation_record_graphql::OperationRecordGenQuery,
  base::optbiz::optbiz_graphql::OptbizGenQuery,
  base::options::options_graphql::OptionsGenQuery,
  base::org::org_graphql::OrgGenQuery,
  base::permit::permit_graphql::PermitGenQuery,
  base::role::role_graphql::RoleGenQuery,
  base::tenant::tenant_graphql::TenantGenQuery,
  base::usr::usr_graphql::UsrGenQuery,
  cron::cron_job::cron_job_graphql::CronJobGenQuery,
  cron::cron_job_log::cron_job_log_graphql::CronJobLogGenQuery,
  cron::cron_job_log_detail::cron_job_log_detail_graphql::CronJobLogDetailGenQuery,
  cron::job::job_graphql::JobGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::background_task::background_task_graphql::BackgroundTaskGenMutation,
  base::data_permit::data_permit_graphql::DataPermitGenMutation,
  base::dept::dept_graphql::DeptGenMutation,
  base::dict::dict_graphql::DictGenMutation,
  base::dict_detail::dict_detail_graphql::DictDetailGenMutation,
  base::dictbiz::dictbiz_graphql::DictbizGenMutation,
  base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenMutation,
  base::domain::domain_graphql::DomainGenMutation,
  base::dyn_page::dyn_page_graphql::DynPageGenMutation,
  base::dyn_page_data::dyn_page_data_graphql::DynPageDataGenMutation,
  base::dyn_page_field::dyn_page_field_graphql::DynPageFieldGenMutation,
  base::dyn_page_val::dyn_page_val_graphql::DynPageValGenMutation,
  base::field_permit::field_permit_graphql::FieldPermitGenMutation,
  base::i18n::i18n_graphql::I18nGenMutation,
  base::icon::icon_graphql::IconGenMutation,
  base::lang::lang_graphql::LangGenMutation,
  base::login_log::login_log_graphql::LoginLogGenMutation,
  base::menu::menu_graphql::MenuGenMutation,
  base::operation_record::operation_record_graphql::OperationRecordGenMutation,
  base::optbiz::optbiz_graphql::OptbizGenMutation,
  base::options::options_graphql::OptionsGenMutation,
  base::org::org_graphql::OrgGenMutation,
  base::permit::permit_graphql::PermitGenMutation,
  base::role::role_graphql::RoleGenMutation,
  base::tenant::tenant_graphql::TenantGenMutation,
  base::usr::usr_graphql::UsrGenMutation,
  cron::cron_job::cron_job_graphql::CronJobGenMutation,
  cron::cron_job_log::cron_job_log_graphql::CronJobLogGenMutation,
  cron::cron_job_log_detail::cron_job_log_detail_graphql::CronJobLogDetailGenMutation,
  cron::job::job_graphql::JobGenMutation,
);
