import type {
  Query,
  Mutation,
  MutationLoginArgs,
} from "#/types";

import cfg from "@/utils/config";

export async function wxwLoginByCode(
  code: string,
  opt?: GqlOpt,
) {
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
        corpid: cfg.appid,
        agentid: cfg.agentid,
        code,
      },
    },
  }, opt);
  const data = res.wxwLoginByCode;
  return data;
}
