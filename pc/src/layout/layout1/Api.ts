import type {
  GetLoginInfo,
  Mutation,
  Query,
  GetMenus,
} from "#/types";

type MenuModel = GetMenus & {
  children?: MenuModel[];
  oldRoute_path?: string;
}

function treeMenusUrl(children: MenuModel[]) {
  for (let i = 0; i < children.length; i++) {
    const item = children[i];
    if (item.route_path && (item.route_path.startsWith("http://") || item.route_path.startsWith("https://"))) {
      const path = item.route_path;
      item.oldRoute_path = path;
      item.route_path = `/myiframe?name=${ encodeURIComponent(item.lbl) }&src=${ encodeURIComponent(path) }`;
    }
    if (item.children && item.children.length > 0) {
      treeMenusUrl(item.children);
    }
  }
}

export async function getMenus(
  variables?: { },
  opt?: GqlOpt,
): Promise<any> {
  const res: {
    getMenus: Query["getMenus"]
  } = await query({
    query: /* GraphQL */ `
      fragment GetMenusFragment on GetMenus {
        id
        parent_id
        lbl
        route_path
        route_query
      }
      query {
        getMenus {
          ...GetMenusFragment
        }
      }
    `,
    variables,
  }, opt);
  const data = res.getMenus;
  const dataTree = list2tree(data);
  treeMenusUrl(dataTree);
  return dataTree;
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

export async function getLoginInfo(
  opt?: GqlOpt,
) {
  const data: {
    getLoginInfo: GetLoginInfo;
  } = await query({
    query: /* GraphQL */ `
      query {
        getLoginInfo {
          lbl
          lang
          username
          org_id
          org_id_models {
            id
            lbl
          }
        }
      }
    `,
  }, opt);
  return data.getLoginInfo;
}

/** 获取当前用户的权限列表 */
export async function getUsrPermits(
  opt?: GqlOpt,
) {
  const data: {
    getUsrPermits: Query["getUsrPermits"],
  } = await query({
    query: /* GraphQL */ `
      query {
        getUsrPermits {
          route_path
          code
        }
      }
    `,
  }, opt);
  return data.getUsrPermits;
}

export async function deptLoginSelect(
  variables: {
    org_id?: OrgId;
  },
  opt?: GqlOpt,
) {
  const data: {
    orgLoginSelect: Mutation["orgLoginSelect"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($org_id: OrgId) {
        orgLoginSelect(org_id: $org_id)
      }
    `,
    variables,
  }, opt);
  return data.orgLoginSelect;
}
