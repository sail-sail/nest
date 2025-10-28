#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;

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
);
