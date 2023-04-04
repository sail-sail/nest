use async_graphql::{
 MergedObject,
  EmptyMutation, EmptySubscription, Schema,
};

use crate::gen::gen_query::GenQuery;

#[derive(MergedObject, Default)]
pub struct Query(GenQuery);

pub type QuerySchema = Schema<Query, EmptyMutation, EmptySubscription>;
