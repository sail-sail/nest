pub mod seo;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct NuxtQuery(
  self::seo::seo_graphql::SeoGenQuery,
);

#[derive(MergedObject, Default)]
pub struct NuxtMutation(
  self::seo::seo_graphql::SeoGenMutation,
);
