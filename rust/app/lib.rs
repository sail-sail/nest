#![forbid(unsafe_code)]
#![recursion_limit="512"]

pub mod base;
pub mod wxwork;

use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  crate::base::menu::menu_graphql::MenuQuery,
  
  wxwork::wxw_usr::wxw_usr_graphql::WxwUsrQuery,
  wxwork::wxw_app_token::wxw_app_token_graphql::WxwAppTokenQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
  
  wxwork::wxw_usr::wxw_usr_graphql::WxwUsrMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;
