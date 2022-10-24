import { GqlOpt, gqlQuery } from "@/utils/graphql";

import {
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
  variables: { host: string },
  opt?: GqlOpt,
): Promise<{ id: string, lbl: string }[]> {
  const query = /* GraphQL */ `
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
  variables: MutationLoginArgs,
  opt?: GqlOpt,
) {
  const data: {
    login: Mutation["login"],
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($username: String!, $password: String!, $tenant_id: String!, $dept_id: String) {
        login(username: $username, password: $password, tenant_id: $tenant_id, dept_id: $dept_id) {
          authorization
          dept_id
        }
      }
    `,
    variables,
  }, opt);
  return data?.login;
}
