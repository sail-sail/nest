pub mod base;
pub mod gql_router;
pub mod query_root;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcQuery(
  base::menu::menu_graphql::MenuQuery,
);

#[derive(MergedObject, Default)]
pub struct SrcMutation(
);
