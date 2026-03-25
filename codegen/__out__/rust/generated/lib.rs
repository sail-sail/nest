#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod cron;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseQuery,
  cron::CronQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseMutation,
  cron::CronMutation,
);
