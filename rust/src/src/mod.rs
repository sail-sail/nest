pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct Resolver(
  // crate::src::base::usr::usr_resolver::UsrResolver,
);
