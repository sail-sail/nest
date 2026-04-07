#![forbid(unsafe_code)]
#![recursion_limit="512"]

pub mod base;
pub mod nuxt;

use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  
  base::BaseAppQuery,
  nuxt::NuxtAppQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
  
  base::BaseAppMutation,
  nuxt::NuxtAppMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;

#[allow(unused_imports)]
use poem::{Route, get};

/// 注册 业务路由
#[allow(unused_mut, clippy::let_and_return)]
pub fn register_routes(app: Route) -> Route {
  let mut app = app;
  
  app
}
