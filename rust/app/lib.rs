#![forbid(unsafe_code)]
#![recursion_limit="512"]

pub mod base;
pub mod wx;

use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  crate::base::menu::menu_graphql::MenuQuery,
  
  wx::pay_transactions_jsapi::pay_transactions_jsapi_graphql::PayTransactionsJsapiQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
  
  wx::pay_transactions_jsapi::pay_transactions_jsapi_graphql::PayTransactionsJsapiMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;
