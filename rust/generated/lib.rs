#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod wx;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseGenQuery,
  wx::WxGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseGenMutation,
  wx::WxGenMutation,
);
