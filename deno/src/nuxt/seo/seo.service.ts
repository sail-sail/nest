import {
  findOneSeo,
} from "/gen/nuxt/seo/seo.dao.ts";

/**
 * 查找默认的SEO优化
 */
export async function findDefaultSeo(): Promise<SeoModel | undefined> {
  
  const seo_model = await findOneSeo({
    is_default: [ 1 ],
  });
  
  return seo_model;
}
