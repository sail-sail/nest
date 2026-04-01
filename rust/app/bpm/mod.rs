pub mod process_def;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
#[graphql(name = "AppBpmMutation")]
pub struct AppBpmMutation(
  self::process_def::process_def_graphql::ProcessDefMutation,
);