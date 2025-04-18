pub mod base;
pub mod gql_router;
pub mod query_root;
pub mod wxwork;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcQuery(
  crate::src::base::dict_detail::dict_detail_graphql::DictDetailQuery,
  crate::src::base::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailQuery,
  crate::src::base::i18n::i18n_graphql::I18nQuery,
  crate::src::base::lang::lang_graphql::LangQuery,
  crate::src::base::menu::menu_graphql::MenuQuery,
  crate::src::base::optbiz::optbiz_graphql::OptbizQuery,
  crate::src::base::options::options_graphql::OptionsQuery,
  crate::src::base::tenant::tenant_graphql::TenantQuery,
  crate::src::base::usr::usr_graphql::UsrQuery,
  crate::src::base::permit::permit_graphql::PermitQuery,
  crate::src::base::role::role_graphql::RoleQuery,
  crate::src::base::field_permit::field_permit_graphql::FieldPermitQuery,
  crate::src::wxwork::wxw_usr::wxw_usr_graphql::WxwUsrQuery,
  crate::src::wxwork::wxw_app_token::wxw_app_token_graphql::WxwAppTokenQuery,
);

#[derive(MergedObject, Default)]
pub struct SrcMutation(
  crate::src::base::org::org_graphql::OrgMutation,
  crate::src::base::usr::usr_graphql::UsrMutation,
  crate::src::base::tenant::tenant_graphql::TenantMutation,
  crate::src::wxwork::wxw_usr::wxw_usr_graphql::WxwUsrMutation,
);
