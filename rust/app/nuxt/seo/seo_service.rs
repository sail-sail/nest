use color_eyre::eyre::Result;

use generated::common::context::Options;

/// 查找默认的SEO优化
pub async fn find_default_seo(
  options: Option<Options>,
) -> Result<Option<generated::nuxt::seo::seo_model::SeoModel>> {
  
  let seo_model = generated::nuxt::seo::seo_dao::find_one_seo(
    None,
    None,
    options,
  ).await?;
  
  Ok(seo_model)
}
