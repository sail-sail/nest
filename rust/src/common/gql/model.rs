use async_graphql::{
  SimpleObject,
  InputObject,
  Enum,
};

#[derive(SimpleObject, InputObject, Copy, Clone)]
pub struct PageInput {
  pub pg_offset: Option<i64>,
  pub pg_size: Option<i64>,
}

#[derive(SimpleObject, InputObject, Clone)]
pub struct SortInput {
  #[graphql(default)]
  pub prop: String,
  #[graphql(default)]
  pub order: String,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum UniqueType {
  #[graphql(name = "throw")]
  Throw,
  #[graphql(name = "update")]
  Update,
  #[graphql(name = "ignore")]
  Ignore,
}

#[derive(Clone)]
pub struct Ip(pub String);