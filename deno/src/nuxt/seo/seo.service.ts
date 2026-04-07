import {
  findOneDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  findOneSeo,
} from "/gen/nuxt/seo/seo.dao.ts";

/**
 * 查找默认的SEO优化
 */
export async function findDefaultSeo(
  domain: string,
  options?: {
    is_debug?: boolean;
  },
): Promise<SeoModel | undefined> {
  
  const domain_model = await findOneDomain(
    {
      lbl: domain,
    },
    undefined,
    options,
  );
  if (!domain_model) {
    return;
  }
  
  const seo_model = await findOneSeo(
    {
      domain_ids: [ domain_model.id ],
    },
    undefined,
    options,
  );
  
  return seo_model;
}
