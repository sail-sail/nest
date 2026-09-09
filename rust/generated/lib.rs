#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;
pub mod base;
pub mod tsdb;

use async_graphql::MergedObject;

pub fn init() {
  
  base::init();
  
}

#[derive(MergedObject, Default)]
pub struct GenQuery(
  base::BaseGenQuery,
  tsdb::TsdbGenQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  base::BaseGenMutation,
  tsdb::TsdbGenMutation,
);
