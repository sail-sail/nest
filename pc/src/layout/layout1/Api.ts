import type {
  GetLoginInfo,
  Mutation,
  Query,
  GetMenus,
  MenuModel as MenuModel0,
} from "#/types";

export type MenuModel = MenuModel0 & {
  children?: MenuModel[];
  oldRoute_path: string;
  _isShow?: boolean;
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
  opt?: GqlOpt,
) {
  const res: {
    getMenus: MenuModel[];
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
  }, opt);
  const data = res.getMenus;
  const dataTree = list2tree(data);
  treeMenusUrl(dataTree);
  return dataTree;
}

// 清空缓存
export async function clearCache(
  opt?: GqlOpt,
) {
  const res: {
    clearCache: Mutation["clearCache"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation {
        clearCache
      }
    `,
  }, opt);
  const data = res.clearCache;
  return data;
}

export async function getLoginInfo(
  opt?: GqlOpt,
) {
  const res: {
    getLoginInfo: GetLoginInfo;
  } = await query({
    query: /* GraphQL */ `
      query {
        getLoginInfo {
          lbl
          username
          role_codes
          lang
          org_id
          org_id_models {
            id
            lbl
          }
        }
      }
    `,
  }, opt);
  const data = res.getLoginInfo;
  return data;
}

/** 获取当前用户的权限列表 */
export async function getUsrPermits(
  opt?: GqlOpt,
) {
  const res: {
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
  const data = res.getUsrPermits;
  return data;
}

export async function deptLoginSelect(
  variables: {
    org_id?: OrgId;
  },
  opt?: GqlOpt,
) {
  const res: {
    orgLoginSelect: Mutation["orgLoginSelect"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($org_id: OrgId) {
        orgLoginSelect(org_id: $org_id)
      }
    `,
    variables,
  }, opt);
  const data = res.orgLoginSelect;
  return data;
}
