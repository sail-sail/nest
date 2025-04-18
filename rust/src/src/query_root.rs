use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  crate::common::app::app_resolver::AppQuery,
  crate::r#gen::GenQuery,
  crate::src::SrcQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  crate::common::cache::cache_graphql::CacheMutation,
  crate::r#gen::GenMutation,
  crate::src::SrcMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;
