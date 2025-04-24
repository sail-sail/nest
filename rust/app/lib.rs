#![forbid(unsafe_code)]
#![recursion_limit="512"]

pub mod base;
pub mod cron;

use async_graphql::{
  MergedObject,
  EmptySubscription, Schema,
};

#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  crate::base::menu::menu_graphql::MenuQuery,
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
  
  // cron 定时任务
  cron::cron_job::cron_job_graphql::CronJobMutation,
);

pub type QuerySchema = Schema<Query, Mutation, EmptySubscription>;
