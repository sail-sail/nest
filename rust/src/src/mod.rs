pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcQuery(
  crate::src::base::dict_detail::dict_detail_graphql::DictDetailQuery,
  crate::src::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailQuery,
  crate::src::base::i18n::i18n_graphql::I18nQuery,
  crate::src::base::lang::lang_graphql::LangQuery,
  crate::src::base::menu::menu_resolver::MenuQuery,
  crate::src::base::options::options_resolver::OptionsQuery,
  crate::src::base::tenant::tenant_resolver::TenantQuery,
  crate::src::base::usr::usr_graphql::UsrQuery,
  crate::src::base::permit::permit_graphql::PermitQuery,
  crate::src::base::role::role_graphql::RoleQuery,
);

#[derive(MergedObject, Default)]
pub struct SrcMutation(
  crate::src::base::org::org_graphql::OrgMutation,
  crate::src::base::usr::usr_graphql::UsrMutation,
);
