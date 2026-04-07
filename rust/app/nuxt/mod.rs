
pub mod seo;

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct NuxtAppQuery(
  self::seo::seo_graphql::SeoAppQuery,
);

#[derive(MergedObject, Default)]
pub struct NuxtAppMutation(
);
