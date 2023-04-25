pub mod base;


use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  crate::gen::base::background_task::background_task_resolver::BackgroundTaskQuery,
  crate::gen::base::dept::dept_resolver::DeptQuery,
  crate::gen::base::dict::dict_resolver::DictQuery,
  crate::gen::base::dict_detail::dict_detail_resolver::DictDetailQuery,
  crate::gen::base::dictbiz::dictbiz_resolver::DictbizQuery,
  crate::gen::base::dictbiz_detail::dictbiz_detail_resolver::DictbizDetailQuery,
  crate::gen::base::i18n::i18n_resolver::I18nQuery,
  crate::gen::base::lang::lang_resolver::LangQuery,
  crate::gen::base::menu::menu_resolver::MenuQuery,
  crate::gen::base::operation_record::operation_record_resolver::OperationRecordQuery,
  crate::gen::base::options::options_resolver::OptionsQuery,
  crate::gen::base::role::role_resolver::RoleQuery,
  crate::gen::base::tenant::tenant_resolver::TenantQuery,
  crate::gen::base::usr::usr_resolver::UsrQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  crate::gen::base::background_task::background_task_resolver::BackgroundTaskMutation,
  crate::gen::base::dept::dept_resolver::DeptMutation,
  crate::gen::base::dict::dict_resolver::DictMutation,
  crate::gen::base::dict_detail::dict_detail_resolver::DictDetailMutation,
  crate::gen::base::dictbiz::dictbiz_resolver::DictbizMutation,
  crate::gen::base::dictbiz_detail::dictbiz_detail_resolver::DictbizDetailMutation,
  crate::gen::base::i18n::i18n_resolver::I18nMutation,
  crate::gen::base::lang::lang_resolver::LangMutation,
  crate::gen::base::menu::menu_resolver::MenuMutation,
  crate::gen::base::operation_record::operation_record_resolver::OperationRecordMutation,
  crate::gen::base::options::options_resolver::OptionsMutation,
  crate::gen::base::role::role_resolver::RoleMutation,
  crate::gen::base::tenant::tenant_resolver::TenantMutation,
  crate::gen::base::usr::usr_resolver::UsrMutation,
);
