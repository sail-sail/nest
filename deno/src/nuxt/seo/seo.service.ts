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
  options?: {
    is_debug?: boolean;
  },
): Promise<SeoModel | undefined> {
  
  const seo_model = await findOneSeo(
    undefined,
    undefined,
    options,
  );
  
  return seo_model;
}
