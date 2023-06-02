pub mod base;


use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  crate::gen::base::background_task::background_task_resolver::BackgroundTaskGenQuery,
  crate::gen::base::dept::dept_resolver::DeptGenQuery,
  crate::gen::base::dict::dict_resolver::DictGenQuery,
  crate::gen::base::dict_detail::dict_detail_resolver::DictDetailGenQuery,
  crate::gen::base::dictbiz::dictbiz_resolver::DictbizGenQuery,
  crate::gen::base::dictbiz_detail::dictbiz_detail_resolver::DictbizDetailGenQuery,
  crate::gen::base::i18n::i18n_resolver::I18nGenQuery,
  crate::gen::base::lang::lang_resolver::LangGenQuery,
  crate::gen::base::menu::menu_resolver::MenuGenQuery,
  crate::gen::base::operation_record::operation_record_resolver::OperationRecordGenQuery,
  crate::gen::base::options::options_resolver::OptionsGenQuery,
  crate::gen::base::permit::permit_resolver::PermitGenQuery,
  crate::gen::base::role::role_resolver::RoleGenQuery,
  crate::gen::base::tenant::tenant_resolver::TenantGenQuery,
  crate::gen::base::usr::usr_resolver::UsrGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  crate::gen::base::background_task::background_task_resolver::BackgroundTaskGenMutation,
  crate::gen::base::dept::dept_resolver::DeptGenMutation,
  crate::gen::base::dict::dict_resolver::DictGenMutation,
  crate::gen::base::dict_detail::dict_detail_resolver::DictDetailGenMutation,
  crate::gen::base::dictbiz::dictbiz_resolver::DictbizGenMutation,
  crate::gen::base::dictbiz_detail::dictbiz_detail_resolver::DictbizDetailGenMutation,
  crate::gen::base::i18n::i18n_resolver::I18nGenMutation,
  crate::gen::base::lang::lang_resolver::LangGenMutation,
  crate::gen::base::menu::menu_resolver::MenuGenMutation,
  crate::gen::base::operation_record::operation_record_resolver::OperationRecordGenMutation,
  crate::gen::base::options::options_resolver::OptionsGenMutation,
  crate::gen::base::permit::permit_resolver::PermitGenMutation,
  crate::gen::base::role::role_resolver::RoleGenMutation,
  crate::gen::base::tenant::tenant_resolver::TenantGenMutation,
  crate::gen::base::usr::usr_resolver::UsrGenMutation,
);
