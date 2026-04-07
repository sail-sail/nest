pub mod seo;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct NuxtGenQuery(
  self::seo::seo_graphql::SeoGenQuery,
);

#[derive(MergedObject, Default)]
pub struct NuxtGenMutation(
  self::seo::seo_graphql::SeoGenMutation,
);
