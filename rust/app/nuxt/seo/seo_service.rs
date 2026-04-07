use color_eyre::eyre::Result;

use generated::common::context::Options;

use smol_str::SmolStr;

/// 查找默认的SEO优化
pub async fn find_default_seo(
  domain: SmolStr,
  options: Option<Options>,
) -> Result<Option<generated::nuxt::seo::seo_model::SeoModel>> {
  
  // 通过 domain 找到 租户
  let domain_model = generated::base::domain::domain_dao::find_one_domain(
    Some(generated::base::domain::domain_model::DomainSearch {
      lbl: Some(domain.clone()),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  let domain_model = match domain_model {
    Some(domain_model) => domain_model,
    None => return Ok(None),
  };
  
  let domain_id = domain_model.id;
  
  let seo_model = generated::nuxt::seo::seo_dao::find_one_seo(
    Some(generated::nuxt::seo::seo_model::SeoSearch {
      domain_ids: Some(vec![domain_id]),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  Ok(seo_model)
}
