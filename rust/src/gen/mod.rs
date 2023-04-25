pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(
  crate::gen::base::usr::usr_resolver::UsrQuery,
);

#[derive(MergedObject, Default)]
pub struct GenMutation(
  crate::gen::base::usr::usr_resolver::UsrMutation,
);
