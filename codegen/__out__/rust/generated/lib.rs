#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod nuxt;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseGenQuery,
  nuxt::NuxtGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseGenMutation,
  nuxt::NuxtGenMutation,
);
