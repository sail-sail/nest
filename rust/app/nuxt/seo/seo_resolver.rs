use color_eyre::eyre::Result;
use tracing::info;

use generated::common::context::{
  get_req_id,
  Options,
};

use smol_str::SmolStr;

use generated::nuxt::seo::seo_model::{
  SeoModel,
};
use super::seo_service;

/// 查找默认的SEO优化
#[function_name::named]
pub async fn find_default_seo(
  domain: SmolStr,
  options: Option<Options>,
) -> Result<Option<SeoModel>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let seo_model = seo_service::find_default_seo(
    domain,
    options,
  ).await?;
  
  Ok(seo_model)
}
