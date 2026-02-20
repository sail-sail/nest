#![forbid(unsafe_code)]
#![recursion_limit="512"]

pub mod base;

use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  crate::base::menu::menu_graphql::MenuQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;

use poem::{Route, get};

/// 注册 业务路由
#[allow(unused_mut)]
pub fn register_routes(app: Route) -> Route {
  let mut app = app;
  
  app
}
