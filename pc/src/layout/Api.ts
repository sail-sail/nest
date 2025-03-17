import type {
  Query,
  Mutation,
  MutationLoginArgs,
  GetLoginTenants,
} from "#/types";

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
      query($domain: String!) {
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
