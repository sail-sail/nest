pub mod data_permit;
pub mod dept;
pub mod dict;
pub mod dict_detail;
pub mod dictbiz;
pub mod dictbiz_detail;
pub mod domain;
pub mod dyn_page;
pub mod dyn_page_data;
pub mod dyn_page_field;
pub mod dyn_page_val;
pub mod field_permit;
pub mod i18n;
pub mod icon;
pub mod lang;
pub mod login_log;
pub mod menu;
pub mod operation_record;
pub mod optbiz;
pub mod options;
pub mod org;
pub mod permit;
pub mod role;
pub mod server_log;
pub mod tenant;
pub mod usr;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct BaseGenQuery(
  self::data_permit::data_permit_graphql::DataPermitGenQuery,
  self::dept::dept_graphql::DeptGenQuery,
  self::dict::dict_graphql::DictGenQuery,
  self::dict_detail::dict_detail_graphql::DictDetailGenQuery,
  self::dictbiz::dictbiz_graphql::DictbizGenQuery,
  self::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenQuery,
  self::domain::domain_graphql::DomainGenQuery,
  self::dyn_page::dyn_page_graphql::DynPageGenQuery,
  self::dyn_page_data::dyn_page_data_graphql::DynPageDataGenQuery,
  self::dyn_page_field::dyn_page_field_graphql::DynPageFieldGenQuery,
  self::dyn_page_val::dyn_page_val_graphql::DynPageValGenQuery,
  self::field_permit::field_permit_graphql::FieldPermitGenQuery,
  self::i18n::i18n_graphql::I18nGenQuery,
  self::icon::icon_graphql::IconGenQuery,
  self::lang::lang_graphql::LangGenQuery,
  self::login_log::login_log_graphql::LoginLogGenQuery,
  self::menu::menu_graphql::MenuGenQuery,
  self::operation_record::operation_record_graphql::OperationRecordGenQuery,
  self::optbiz::optbiz_graphql::OptbizGenQuery,
  self::options::options_graphql::OptionsGenQuery,
  self::org::org_graphql::OrgGenQuery,
  self::permit::permit_graphql::PermitGenQuery,
  self::role::role_graphql::RoleGenQuery,
  self::server_log::server_log_graphql::ServerLogGenQuery,
  self::tenant::tenant_graphql::TenantGenQuery,
  self::usr::usr_graphql::UsrGenQuery,
);

#[derive(MergedObject, Default)]
pub struct BaseGenMutation(
  self::data_permit::data_permit_graphql::DataPermitGenMutation,
  self::dept::dept_graphql::DeptGenMutation,
  self::dict::dict_graphql::DictGenMutation,
  self::dict_detail::dict_detail_graphql::DictDetailGenMutation,
  self::dictbiz::dictbiz_graphql::DictbizGenMutation,
  self::dictbiz_detail::dictbiz_detail_graphql::DictbizDetailGenMutation,
  self::domain::domain_graphql::DomainGenMutation,
  self::dyn_page::dyn_page_graphql::DynPageGenMutation,
  self::dyn_page_data::dyn_page_data_graphql::DynPageDataGenMutation,
  self::dyn_page_field::dyn_page_field_graphql::DynPageFieldGenMutation,
  self::dyn_page_val::dyn_page_val_graphql::DynPageValGenMutation,
  self::field_permit::field_permit_graphql::FieldPermitGenMutation,
  self::i18n::i18n_graphql::I18nGenMutation,
  self::icon::icon_graphql::IconGenMutation,
  self::lang::lang_graphql::LangGenMutation,
  self::login_log::login_log_graphql::LoginLogGenMutation,
  self::menu::menu_graphql::MenuGenMutation,
  self::operation_record::operation_record_graphql::OperationRecordGenMutation,
  self::optbiz::optbiz_graphql::OptbizGenMutation,
  self::options::options_graphql::OptionsGenMutation,
  self::org::org_graphql::OrgGenMutation,
  self::permit::permit_graphql::PermitGenMutation,
  self::role::role_graphql::RoleGenMutation,
  self::server_log::server_log_graphql::ServerLogGenMutation,
  self::tenant::tenant_graphql::TenantGenMutation,
  self::usr::usr_graphql::UsrGenMutation,
);
