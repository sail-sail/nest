import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./seo.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type Query {
  "查找默认的SEO优化"
  findDefaultSeo: SeoModel
}
  
`);
