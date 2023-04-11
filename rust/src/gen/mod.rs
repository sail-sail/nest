pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct Resolver(
  crate::gen::base::usr::usr_resolver::UsrResolver,
);
