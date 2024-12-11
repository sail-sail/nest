import type {
  GetLoginTenants,
  SeoModel,
} from "./typings/types";

export async function useMySeoMeta() {
  const seo_model = (await useAsyncData(() => findDefaultSeo())).data.value;
  if (!seo_model) {
    // console.error("未找到默认的SEO优化");
    return;
  }
  let ogImage = "";
  if (seo_model.og_image) {
    const url = useRequestURL();
    ogImage = `${ url.origin }${ getImgUrl(seo_model.og_image) }`;
  }
  useSeoMeta({
    title: seo_model.title || undefined,
    description: seo_model.description || undefined,
    keywords: seo_model.keywords || undefined,
    ogTitle: seo_model.og_title || undefined,
    ogDescription: seo_model.og_description || undefined,
    ogImage: ogImage || undefined,
  });
}

async function findDefaultSeo(
  opt?: GqlOpt,
) {
  const res: {
    findDefaultSeo: SeoModel | undefined;
  } = await query({
    query: /* GraphQL */ `
      query {
        findDefaultSeo {
          id
          title
          description
          keywords
          og_image
          og_title
          og_description
        }
      }
    `,
  }, opt);
  const data = res.findDefaultSeo;
  return data;
}

export async function getLoginTenants(
  domain: string,
  opt?: GqlOpt,
) {
  const res: {
    getLoginTenants: GetLoginTenants[];
  } = await query({
    query: /* GraphQL */ `
      query($domain: String!) {
        getLoginTenants(domain: $domain) {
          id
          lbl
        }
      }
    `,
    variables: {
      domain,
    },
  }, opt);
  const data = res.getLoginTenants;
  return data;
}
