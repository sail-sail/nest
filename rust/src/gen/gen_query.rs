use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  super::usr::usr_resolver::UsrQuery,
);
