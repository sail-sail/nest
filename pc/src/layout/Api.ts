import {
  type Query,
  type Mutation,
  type MutationLoginArgs,
} from "#/types";

/**
 * 根据 当前网址的域名+端口 获取 租户列表
 * @export
 * @param {{ host: string }} variables
 * @param {GqlOpt} [opt]
 * @return {Promise<{ id: string, lbl: string }[]>}
 */
export async function getLoginTenants(
  variables: { domain: string },
  opt?: GqlOpt,
): Promise<{ id: string, lbl: string }[]> {
  const data: {
    getLoginTenants: Query["getLoginTenants"],
  } = await query({
    query: /* GraphQL */ `
      query($domain: String!) {
        getLoginTenants(domain: $domain) {
          id
          lbl
        }
      }
    `,
    variables,
  },opt);
  return data.getLoginTenants;
}

/**
 * 获取语言列表
 */
export async function getLoginLangs(
  opt?: GqlOpt,
) {
  const res: {
    getLoginLangs: Query["getLoginLangs"],
  } = await query({
    query: /* GraphQL */ `
      query {
        getLoginLangs {
          id
          code
          lbl
        }
      }
    `,
  }, opt);
  const data = res.getLoginLangs;
  return data;
}

export async function login(
  model: MutationLoginArgs,
  opt?: GqlOpt,
) {
  const res: {
    login: Mutation["login"],
  } = await mutation({
    query: /* GraphQL */ `
      mutation($username: String!, $password: String!, $tenant_id: String!, $org_id: String, $lang: String!) {
        login(username: $username, password: $password, tenant_id: $tenant_id, org_id: $org_id, lang: $lang) {
          authorization
          org_id
        }
      }
    `,
    variables: {
      ...model,
    },
  }, opt);
  const data = res.login;
  return data;
}

// 清空缓存
export async function clearCache(
  variables?: { [key: string]: any; },
  opt?: GqlOpt,
): Promise<any> {
  const data = await mutation({
    query: /* GraphQL */ `
      mutation {
        clearCache
      }
    `,
    variables,
  }, opt);
  return data?.clearCache;
}
