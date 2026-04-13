pub mod menu;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct BaseAppQuery(
  self::menu::menu_graphql::MenuQuery,
);

#[derive(MergedObject, Default)]
pub struct BaseAppMutation(
);

