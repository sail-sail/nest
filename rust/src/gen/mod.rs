pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenResolver(
  crate::gen::base::usr::usr_resolver::UsrResolver,
);
