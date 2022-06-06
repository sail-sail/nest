import { gql, GqlOpt, gqlQuery } from "@/utils/graphql";

/**
 * 根据 当前网址的域名+端口 获取 租户列表
 * @export
 * @param {{ host: string }} variables
 * @param {GqlOpt} [opt]
 * @return {Promise<{ id: string, lbl: string }[]>}
 */
export async function getLoginTenants(
  variables: { host: string },
  opt?: GqlOpt,
): Promise<{ id: string, lbl: string }[]> {
  const query = gql`
    query($host: String!) {
      getLoginTenants(host: $host) {
        id
        lbl
      }
    }
  `;
  const data = await gqlQuery({ query, variables }, opt);
  return data?.getLoginTenants;
}

export async function login(
  variables: { username: string, password: string, tenant_id: string },
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($username: String!, $password: String!, $tenant_id: String!) {
        login(username: $username, password: $password, tenant_id: $tenant_id)
      }
    `,
    variables,
  }, opt);
  return data?.login;
}

export async function getMenus(
  variables?: { type?: string },
  opt?: GqlOpt,
): Promise<any> {
  const data = await gqlQuery({
    query: gql`
      query($type: String) {
        menus: getMenus(type: $type) {
          id lbl route_path route_query children
        }
      }
    `,
    variables,
  }, opt);
  return data?.menus;
}

// 清空缓存
export async function clearCache(
  variables?: unknown,
  opt?: GqlOpt,
): Promise<any> {
  const data = await gqlQuery({
    query: gql`
      mutation {
        clearCache
      }
    `,
    variables,
  }, opt);
  return data?.clearCache;
}
