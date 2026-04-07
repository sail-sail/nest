use color_eyre::eyre::Result;

use generated::common::context::Options;

use generated::nuxt::seo::seo_model::{
  SeoModel,
  SeoSearch,
};
use generated::nuxt::seo::seo_dao::find_one_seo;

/// 查找默认的SEO优化
pub async fn find_default_seo(
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  let seo_model = find_one_seo(
    Some(SeoSearch {
      is_default: Some(vec![1]),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  Ok(seo_model)
}
