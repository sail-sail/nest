use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  super::base::usr::usr_resolver::UsrQuery,
);
