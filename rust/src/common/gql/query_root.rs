use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  crate::gen::GenQuery,
  crate::src::SrcQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  crate::gen::GenMutation,
  crate::src::SrcMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;
