// #ifdef H5
import type {
  Mutation,
} from "#/types";
 
import cfg from "@/utils/config";
 
import { lang } from "@/locales/index";
 
export async function wxoLoginByCode(
  code: string,
  opt?: GqlOpt,
) {
  const host = cfg.domain;
  const res: {
    wxoLoginByCode: Mutation["wxoLoginByCode"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: WxoLoginByCodeInput!) {
        wxoLoginByCode(input: $input) {
          authorization
          org_id
          username,
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
  const data = res.wxoLoginByCode;
  return data;
}
// #ifdef H5
