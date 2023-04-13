pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcResolver(
  // crate::src::base::usr::usr_resolver::UsrResolver,
  crate::src::base::dict_detail::dict_detail_resolver::DictDetailResolver,
);
