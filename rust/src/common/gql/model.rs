use async_graphql::{SimpleObject, InputObject};

#[derive(SimpleObject, InputObject, Debug)]
pub struct PageInput {
  pub pg_offset: Option<i64>,
  pub pg_size: Option<i64>,
}

#[derive(SimpleObject, InputObject, Debug)]
pub struct SortInput {
  #[graphql(default)]
  pub prop: String,
  #[graphql(default)]
  pub order: String,
}
