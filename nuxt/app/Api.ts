import type {
  GetLoginTenants,
  SeoModel,
} from "#/types.ts";

export async function useMySeoMeta() {
  const url = useRequestURL();
  const domain = url.host;
  const seo_model = (await useAsyncData("useMySeoMeta", () => findDefaultSeo(domain))).data.value;
  if (!seo_model) {
    // console.error("未找到默认的SEO优化");
    return;
  }
  let ogImage = "";
  if (seo_model.og_image) {
    ogImage = `${ url.origin }${ getImgUrl(seo_model.og_image) }`;
  }
  useSeoMeta({
    title: seo_model.lbl || undefined,
    description: seo_model.description || undefined,
    keywords: seo_model.keywords || undefined,
    ogTitle: seo_model.og_title || undefined,
    ogDescription: seo_model.og_description || undefined,
    ogImage: ogImage || undefined,
  });
  let icon = "";
  if (seo_model.ico) {
    icon = `${ url.origin }${ getImgUrl(seo_model.ico) }`;
  }
  useHead({
    link: [
      {
        rel: "icon",
        href: icon || undefined,
      },
    ],
    title: seo_model.lbl || undefined,
  });
}

async function findDefaultSeo(
  domain: string,
  opt?: GqlOpt,
) {
  const res: {
    findDefaultSeo?: SeoModel;
  } = await query({
    query: /* GraphQL */ `
      query($domain: SmolStr!) {
        findDefaultSeo(domain: $domain) {
          id
          ico
          lbl
          description
          keywords
          og_image
          og_title
          og_description
        }
      }
    `,
    variables: {
      domain,
    },
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
      query($domain: SmolStr!) {
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
