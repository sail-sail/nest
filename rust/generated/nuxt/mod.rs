pub mod comp_cnf;
pub mod seo;

use async_graphql::MergedObject;

pub fn init() {
  self::comp_cnf::init();
  self::seo::init();
}

#[derive(MergedObject, Default)]
pub struct NuxtGenQuery(
  self::comp_cnf::comp_cnf_graphql::CompCnfGenQuery,
  self::seo::seo_graphql::SeoGenQuery,
);

#[derive(MergedObject, Default)]
pub struct NuxtGenMutation(
  self::comp_cnf::comp_cnf_graphql::CompCnfGenMutation,
  self::seo::seo_graphql::SeoGenMutation,
);
