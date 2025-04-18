use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  crate::common::CommonQuery,
  crate::r#gen::GenQuery,
  crate::src::SrcQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  crate::common::CommonMutation,
  crate::r#gen::GenMutation,
  crate::src::SrcMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;
