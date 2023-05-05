pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcQuery(
  crate::src::base::dict_detail::dict_detail_resolver::DictDetailQuery,
  crate::src::base::dictbiz_detail::dictbiz_detail_resolver::DictbizDetailQuery,
  crate::src::base::i18n::i18n_resolver::I18nQuery,
  crate::src::base::lang::lang_resolver::LangQuery,
  crate::src::base::menu::menu_resolver::MenuQuery,
  crate::src::base::options::options_resolver::OptionsQuery,
  crate::src::base::tenant::tenant_resolver::TenantQuery,
  crate::src::base::usr::usr_resolver::UsrQuery,
);

#[derive(MergedObject, Default)]
pub struct SrcMutation(
  crate::src::base::dept::dept_resolver::DeptMutation,
  crate::src::base::usr::usr_resolver::UsrMutation,
);
