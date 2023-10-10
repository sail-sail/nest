pub mod base;
pub mod wxwork;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcQuery(
  crate::src::base::dict_detail::dict_detail_graphql::DictDetailQuery,
  crate::src::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailQuery,
  crate::src::base::i18n::i18n_resolver::I18nQuery,
  crate::src::base::lang::lang_resolver::LangQuery,
  crate::src::base::menu::menu_resolver::MenuQuery,
  crate::src::base::options::options_resolver::OptionsQuery,
  crate::src::base::tenant::tenant_resolver::TenantQuery,
  crate::src::base::usr::usr_graphql::UsrQuery,
  crate::src::base::permit::permit_graphql::PermitQuery,
  crate::src::wxwork::wxw_usr::wxw_usr_graphql::WxwUsrQuery,
);

#[derive(MergedObject, Default)]
pub struct SrcMutation(
  crate::src::base::org::org_graphql::OrgMutation,
  crate::src::base::usr::usr_graphql::UsrMutation,
  crate::src::wxwork::wxw_usr::wxw_usr_graphql::WxwUsrMutation,
);
