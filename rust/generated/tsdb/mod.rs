pub mod tsdb_app;

use async_graphql::MergedObject;

pub fn init() {
  self::tsdb_app::init();
}

#[derive(MergedObject, Default)]
pub struct TsdbGenQuery(
  self::tsdb_app::tsdb_app_graphql::TsdbAppGenQuery,
);

#[derive(MergedObject, Default)]
pub struct TsdbGenMutation(
  self::tsdb_app::tsdb_app_graphql::TsdbAppGenMutation,
);
