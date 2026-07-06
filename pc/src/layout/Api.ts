import type {
  Query,
  Mutation,
  MutationLoginArgs,
  GetLoginTenants,
} from "#/types";

import {
  lang,
} from "@/locales/index";

/**
 * 根据 当前网址的域名+端口 获取 租户列表
 */
export async function getLoginTenants(
  variables: { domain: string },
  opt?: GqlOpt,
): Promise<GetLoginTenants[]> {
  const data: {
    getLoginTenants: Query["getLoginTenants"],
  } = await query({
    query: /* GraphQL */ `
      query($domain: SmolStr!) {
        getLoginTenants(domain: $domain) {
          id
          lbl
          title
          info
          lang
        }
      }
    `,
    variables,
  }, opt);
  return data.getLoginTenants;
}

/**
 * 根据 租户ids 获取 租户信息
 */
export async function getLoginTenantByIds(
  tenant_ids: TenantId[],
  opt?: GqlOpt,
): Promise<GetLoginTenants[]> {
  const res: {
    getLoginTenantByIds: Query["getLoginTenantByIds"];
  } = await query({
    query: /* GraphQL */ `
      query($tenant_ids: [TenantId!]!) {
        getLoginTenantByIds(tenant_ids: $tenant_ids) {
          id
          lbl
          title
          info
          lang
        }
      }
    `,
    variables: {
      tenant_ids,
    },
  }, opt);
  
  const data = res.getLoginTenantByIds;
  
  return data;
}

export async function login(
  input: MutationLoginArgs["input"],
  opt?: GqlOpt,
) {
  const res: {
    login: Mutation["login"],
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: LoginInput!) {
        login(input: $input) {
          usr_id
          username
          tenant_id
          org_id
          authorization
          lang
        }
      }
    `,
    variables: {
      input,
    },
  }, opt);
  const data = res.login;
  return data;
}

export async function wxwGetAppid(
  host: string,
  opt?: GqlOpt,
) {
  const res: {
    wxwGetAppid: Query["wxwGetAppid"],
  } = await query({
    query: /* GraphQL */ `
      query($host: SmolStr!) {
        wxwGetAppid(host: $host) {
          appid
          agentid
          scope
        }
      }
    `,
    variables: {
      host,
    },
  }, opt);
  const data = res?.wxwGetAppid;
  if (!data?.appid || !data?.agentid) {
    throw new Error("请联系管理员配置企业微信 appid 和 agentid");
  }
  return data;
}

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
          username
          name
          tenant_id
          lang
        }
      }
    `,
    variables: {
      input: {
        host: window.location.host,
        code,
        lang,
      },
    },
  }, opt);
  return res?.wxwLoginByCode;
}

// 清空缓存
export async function clearCache(
  opt?: GqlOpt,
) {
  const data: {
    clearCache: Mutation["clearCache"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation {
        clearCache
      }
    `,
  }, opt);
  return data?.clearCache;
}
