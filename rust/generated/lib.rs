#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseMutation,
);
