pub mod base;
pub mod cron;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcQuery(
  crate::src::base::dict_detail::dict_detail_graphql::DictDetailQuery,
  crate::src::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailQuery,
  crate::src::base::i18n::i18n_graphql::I18nQuery,
  crate::src::base::lang::lang_graphql::LangQuery,
  crate::src::base::menu::menu_graphql::MenuQuery,
  crate::src::base::options::options_graphql::OptionsQuery,
  crate::src::base::tenant::tenant_graphql::TenantQuery,
  crate::src::base::usr::usr_graphql::UsrQuery,
  crate::src::base::permit::permit_graphql::PermitQuery,
  crate::src::base::role::role_graphql::RoleQuery,
  crate::src::base::field_permit::field_permit_graphql::FieldPermitQuery,
  
  // cron 定时任务
);

#[derive(MergedObject, Default)]
pub struct SrcMutation(
  crate::src::base::org::org_graphql::OrgMutation,
  crate::src::base::usr::usr_graphql::UsrMutation,
  crate::src::base::tenant::tenant_graphql::TenantMutation,
  
  // cron 定时任务
  crate::src::cron::cron_job::cron_job_graphql::CronJobMutation,
);
