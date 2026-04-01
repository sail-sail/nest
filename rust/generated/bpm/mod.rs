pub mod log;
pub mod node_inst;
pub mod process_def;
pub mod process_inst;
pub mod process_revision;
pub mod task;
pub mod transfer;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct BpmQuery(
  self::log::log_graphql::LogGenQuery,
  self::node_inst::node_inst_graphql::NodeInstGenQuery,
  self::process_def::process_def_graphql::ProcessDefGenQuery,
  self::process_inst::process_inst_graphql::ProcessInstGenQuery,
  self::process_revision::process_revision_graphql::ProcessRevisionGenQuery,
  self::task::task_graphql::TaskGenQuery,
  self::transfer::transfer_graphql::TransferGenQuery,
);

#[derive(MergedObject, Default)]
pub struct BpmMutation(
  self::log::log_graphql::LogGenMutation,
  self::node_inst::node_inst_graphql::NodeInstGenMutation,
  self::process_def::process_def_graphql::ProcessDefGenMutation,
  self::process_inst::process_inst_graphql::ProcessInstGenMutation,
  self::process_revision::process_revision_graphql::ProcessRevisionGenMutation,
  self::task::task_graphql::TaskGenMutation,
  self::transfer::transfer_graphql::TransferGenMutation,
);
