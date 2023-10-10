import type {
  Mutation,
} from "#/types";

import cfg from "@/utils/config";

import { lang } from "@/locales/index";

export async function wxwLoginByCode(
  code: string,
  opt?: GqlOpt,
) {
  const host = cfg.domain;
  const res: {
    wxwLoginByCode: Mutation["wxwLoginByCode"],
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: WxwLoginByCodeInput!) {
        wxwLoginByCode(input: $input) {
          authorization
          org_id
          username,
          name,
          tenant_id,
          lang,
        }
      }
    `,
    variables: {
      input: {
        host,
        code,
        lang,
      },
    },
  }, opt);
  const data = res?.wxwLoginByCode;
  return data;
}
