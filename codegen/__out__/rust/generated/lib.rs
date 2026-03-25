#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod wxwork;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseQuery,
  wxwork::WxworkQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseMutation,
  wxwork::WxworkMutation,
);
