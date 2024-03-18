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

impl std::fmt::Debug for PageInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("PageInput");
    if let Some(ref pg_offset) = self.pg_offset {
      item = item.field("pg_offset", pg_offset);
    }
    if let Some(ref pg_size) = self.pg_size {
      item = item.field("pg_size", pg_size);
    }
    item.finish()
  }
}

#[derive(SimpleObject, InputObject, Clone, Debug)]
pub struct SortInput {
  #[graphql(default)]
  pub prop: String,
  #[graphql(default)]
  pub order: String,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq, Debug)]
pub enum UniqueType {
  #[graphql(name = "throw")]
  Throw,
  #[graphql(name = "update")]
  Update,
  #[graphql(name = "ignore")]
  Ignore,
}

impl Default for UniqueType {
  fn default() -> Self {
    UniqueType::Throw
  }
}

#[derive(Clone, Debug)]
pub struct Ip(pub String);
