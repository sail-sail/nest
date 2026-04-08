use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use generated::common::context::{
  Ctx,
};
use generated::nuxt::seo::seo_model::{
  SeoModel,
};
use super::seo_resolver;

#[derive(Default)]
pub struct SeoAppQuery;

#[Object(rename_args = "snake_case")]
impl SeoAppQuery {
  
  /// 查找默认的SEO优化
  #[graphql(name = "findDefaultSeo")]
  async fn find_default_seo(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Option<SeoModel>> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        seo_resolver::find_default_seo(
          None,
        )
      }).await
  }
}
