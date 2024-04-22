import {
  useContext,
} from "/lib/context.ts";

/**
 * 查找默认的SEO优化
 */
export async function findDefaultSeo(
): Promise<SeoModel | undefined> {
  const {
    findDefaultSeo,
  } = await import("./seo.service.ts");
  
  const context = useContext();
  context.notVerifyToken = true;
  
  const res = await findDefaultSeo();
  
  return res;
}
