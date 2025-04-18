pub mod context;
pub mod validators;
pub mod gql;
pub mod auth;
pub mod oss;
pub mod permit;
pub mod role;
pub mod tmpfile;
pub mod usr;
pub mod tenant;
pub mod data_permit;
pub mod dept;
pub mod cache;
pub mod exceptions;
pub mod util;
pub mod app;
pub mod websocket;
pub mod health;
pub mod lang;
pub mod operation_record;
pub mod options;
pub mod i18n;
pub mod dict_detail;
pub mod dictbiz_detail;
pub mod field_permit;
pub mod optbiz;
pub mod org;
pub mod wx_pay;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct CommonQuery(
  oss::oss_graphql::OssQuery,
  app::app_resolver::AppQuery,
  dict_detail::dict_detail_graphql::DictDetailQuery,
  dictbiz_detail::dictbiz_detail_graphql::DictbizDetailQuery,
  lang::lang_graphql::LangQuery,
  i18n::i18n_graphql::I18nQuery,
  tenant::tenant_graphql::TenantQuery,
  role::role_graphql::RoleQuery,
  permit::permit_graphql::PermitQuery,
  optbiz::optbiz_graphql::OptbizQuery,
  options::options_graphql::OptionsQuery,
  usr::usr_graphql::UsrQuery,
  field_permit::field_permit_graphql::FieldPermitQuery,
);

#[derive(MergedObject, Default)]
pub struct CommonMutation(
  cache::cache_graphql::CacheMutation,
  tenant::tenant_graphql::TenantMutation,
  org::org_graphql::OrgMutation,
  usr::usr_graphql::UsrMutation,
);
