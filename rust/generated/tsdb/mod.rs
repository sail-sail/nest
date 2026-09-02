pub mod tsdb_app;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct TsdbGenQuery(
  self::tsdb_app::tsdb_app_graphql::TsdbAppGenQuery,
);

#[derive(MergedObject, Default)]
pub struct TsdbGenMutation(
  self::tsdb_app::tsdb_app_graphql::TsdbAppGenMutation,
);
