use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  super::super::app::app_resolver::AppQuery,
  crate::gen::GenQuery,
  crate::src::SrcQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  super::super::cache::cache_resolver::CacheMutation,
  crate::gen::GenMutation,
  crate::src::SrcMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;
