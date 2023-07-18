pub mod base;


use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  crate::gen::base::background_task::background_task_graphql::BackgroundTaskGenQuery,
  crate::gen::base::dept::dept_graphql::DeptGenQuery,
  crate::gen::base::dict::dict_graphql::DictGenQuery,
  crate::gen::base::dict_detail::dict_detail_graphql::DictDetailGenQuery,
  crate::gen::base::dictbiz::dictbiz_graphql::DictbizGenQuery,
  crate::gen::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenQuery,
  crate::gen::base::domain::domain_graphql::DomainGenQuery,
  crate::gen::base::i18n::i18n_graphql::I18nGenQuery,
  crate::gen::base::lang::lang_graphql::LangGenQuery,
  crate::gen::base::menu::menu_graphql::MenuGenQuery,
  crate::gen::base::operation_record::operation_record_graphql::OperationRecordGenQuery,
  crate::gen::base::options::options_graphql::OptionsGenQuery,
  crate::gen::base::org::org_graphql::OrgGenQuery,
  crate::gen::base::permit::permit_graphql::PermitGenQuery,
  crate::gen::base::role::role_graphql::RoleGenQuery,
  crate::gen::base::tenant::tenant_graphql::TenantGenQuery,
  crate::gen::base::usr::usr_graphql::UsrGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  crate::gen::base::background_task::background_task_graphql::BackgroundTaskGenMutation,
  crate::gen::base::dept::dept_graphql::DeptGenMutation,
  crate::gen::base::dict::dict_graphql::DictGenMutation,
  crate::gen::base::dict_detail::dict_detail_graphql::DictDetailGenMutation,
  crate::gen::base::dictbiz::dictbiz_graphql::DictbizGenMutation,
  crate::gen::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenMutation,
  crate::gen::base::domain::domain_graphql::DomainGenMutation,
  crate::gen::base::i18n::i18n_graphql::I18nGenMutation,
  crate::gen::base::lang::lang_graphql::LangGenMutation,
  crate::gen::base::menu::menu_graphql::MenuGenMutation,
  crate::gen::base::operation_record::operation_record_graphql::OperationRecordGenMutation,
  crate::gen::base::options::options_graphql::OptionsGenMutation,
  crate::gen::base::org::org_graphql::OrgGenMutation,
  crate::gen::base::permit::permit_graphql::PermitGenMutation,
  crate::gen::base::role::role_graphql::RoleGenMutation,
  crate::gen::base::tenant::tenant_graphql::TenantGenMutation,
  crate::gen::base::usr::usr_graphql::UsrGenMutation,
);
