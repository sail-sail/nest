use async_graphql::{SimpleObject, InputObject};

#[derive(SimpleObject, InputObject, Debug)]
pub struct PageInput {
  pub pg_offset: Option<i64>,
  pub pg_size: Option<i64>,
}

#[derive(SimpleObject, InputObject, Debug)]
pub struct SortInput {
  pub prop: String,
  pub order: String,
}