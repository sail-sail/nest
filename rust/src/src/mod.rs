pub mod base;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct SrcQuery(
  // crate::src::base::usr::usr_resolver::UsrQuery,
  crate::src::base::dict_detail::dict_detail_resolver::DictDetailQuery,
);
