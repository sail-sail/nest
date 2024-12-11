import type {
  Query,
  Mutation,
  MutationLoginArgs,
  RoleSearch,
  PageInput,
  GetLoginTenants,
} from "#/types";

/** 根据 当前网址的域名+端口 获取 租户列表 */
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

/**
 * 根据搜索条件查找数据
 */
export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: Query["findAllRole"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllRole(search: $search, page: $page, sort: $sort) {
          id
          lbl
          menu_ids
          menu_ids_lbl
          permit_ids
          permit_ids_lbl
          data_permit_ids
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllRole;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}
