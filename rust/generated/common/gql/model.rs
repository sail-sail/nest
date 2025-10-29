use async_graphql::{
  SimpleObject,
  InputObject,
  Enum,
};
use serde::{Deserialize, Serialize};

#[derive(SimpleObject, InputObject, Copy, Clone, Deserialize, Serialize)]
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

#[derive(SimpleObject, InputObject, Clone, Debug, Serialize, Deserialize)]
pub struct SortInput {
  #[graphql(default)]
  pub prop: String,
  #[graphql(default)]
  pub order: SortOrderEnum,
}

#[derive(Enum, Default, Copy, Clone, Eq, PartialEq, Debug, Serialize, Deserialize)]
pub enum SortOrderEnum {
  #[graphql(name = "asc")]
  #[default]
  Asc,
  #[graphql(name = "ascending")]
  Ascending,
  #[graphql(name = "desc")]
  Desc,
  #[graphql(name = "descending")]
  Descending,
}

impl std::fmt::Display for SortOrderEnum {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    match self {
      SortOrderEnum::Asc => write!(f, "asc"),
      SortOrderEnum::Ascending => write!(f, "asc"),
      SortOrderEnum::Desc => write!(f, "desc"),
      SortOrderEnum::Descending => write!(f, "desc"),
    }
  }
}

#[derive(Enum, Default, Copy, Clone, Eq, PartialEq, Debug)]
pub enum UniqueType {
  #[graphql(name = "throw")]
  #[default]
  Throw,
  #[graphql(name = "update")]
  Update,
  #[graphql(name = "ignore")]
  Ignore,
}

#[derive(Clone, Debug)]
pub struct Ip(pub String);
