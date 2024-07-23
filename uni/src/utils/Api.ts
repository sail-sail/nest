// #ifdef H5
import type {
  Query,
  Mutation,
} from "#/types";

import cfg from "@/utils/config";

import {
  lang,
} from "@/locales/index";

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

/** 通过 appid, agentid, url 生成企业签名 */
export async function wxwGetConfigSignature(
  appid: string,
  agentid: string,
  url: string,
  opt?: GqlOpt,
) {
  const res: {
    wxwGetConfigSignature: Query["wxwGetConfigSignature"],
  } = await query({
    query: /* GraphQL */ `
      query($appid: String!, $agentid: String!, $url: String!) {
        wxwGetConfigSignature(appid: $appid, agentid: $agentid, url: $url) {
          timestamp
          nonceStr
          signature
        }
      }
    `,
    variables: {
      appid,
      agentid,
      url,
    },
  }, opt);
  const data = res.wxwGetConfigSignature;
  return data;
}

/** 通过 appid, agentid, url 生成应用签名 */
export async function wxwGetAgentConfigSignature(
  appid: string,
  agentid: string,
  url: string,
  opt?: GqlOpt,
) {
  const res: {
    wxwGetAgentConfigSignature: Query["wxwGetConfigSignature"],
  } = await query({
    query: /* GraphQL */ `
      query($appid: String!, $agentid: String!, $url: String!) {
        wxwGetAgentConfigSignature(appid: $appid, agentid: $agentid, url: $url) {
          timestamp
          nonceStr
          signature
        }
      }
    `,
    variables: {
      appid,
      agentid,
      url,
    },
  }, opt);
  const data = res.wxwGetAgentConfigSignature;
  return data;
}
// #endif
