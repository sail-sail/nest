use async_graphql::{
  MergedObject,
  EmptyMutation, EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  crate::gen::Resolver,
);

pub type QuerySchema = Schema<Query, EmptyMutation, EmptySubscription>;
