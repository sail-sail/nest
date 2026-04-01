#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod bpm;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseQuery,
  bpm::BpmQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseMutation,
  bpm::BpmMutation,
);
