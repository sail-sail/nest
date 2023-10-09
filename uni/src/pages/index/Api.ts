import type {
  Query,
  Mutation,
  MutationLoginArgs,
} from "#/types";

/** 根据 当前网址的域名+端口 获取 租户列表 */
export async function getLoginTenants(
  variables: { domain: string },
  opt?: GqlOpt,
): Promise<{ id: string, lbl: string }[]> {
  const data: {
    getLoginTenants: Query["getLoginTenants"],
  } = await query({
    query: `
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
          authorization
          org_id
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

export async function checkLogin(
  opt?: GqlOpt,
) {
  opt = opt || { };
  opt.showErrMsg = false;
  const res: {
    checkLogin: Query["checkLogin"],
  } = await query({
    query: /* GraphQL */ `
      query {
        checkLogin
      }
    `,
  }, opt);
  const data = res?.checkLogin || false;
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
