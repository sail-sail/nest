#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod bpm;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseGenQuery,
  bpm::BpmGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseGenMutation,
  bpm::BpmGenMutation,
);
