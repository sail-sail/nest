import {
  type MenuModel as MenuModel0,
  type GetLoginInfo,
  type Mutation,
  type Query,
} from "#/types";

type MenuModel = MenuModel0 & {
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
  variables?: { type?: string },
  opt?: GqlOpt,
): Promise<any> {
  const data = await query({
    query: /* GraphQL */ `
      query($type: String) {
        getMenus(type: $type) {
          ...GetMenusFragment
        }
      }
      fragment GetMenusFragment on GetMenus {
        id
        lbl
        route_path
        route_query
        children {
          id
          lbl
          route_path
          route_query
        }
      }
    `,
    variables,
  }, opt);
  const result = data?.getMenus;
  if (result) {
    treeMenusUrl(result);
  }
  return result;
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
    getLoginInfo?: GetLoginInfo;
  } = await query({
    query: /* GraphQL */ `
      query {
        getLoginInfo {
          lbl
          lang
          dept_id
          dept_id_models {
            id
            lbl
          }
        }
      }
    `,
  }, opt);
  return data?.getLoginInfo;
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
          is_visible
        }
      }
    `,
  }, opt);
  return data.getUsrPermits;
}

export async function deptLoginSelect(
  variables: {
    dept_id: string;
  },
  opt?: GqlOpt,
) {
  const data: {
    deptLoginSelect: Mutation["deptLoginSelect"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($dept_id: String!) {
        deptLoginSelect(dept_id: $dept_id)
      }
    `,
    variables,
  }, opt);
  return data.deptLoginSelect;
}

/**
 * 切换语言
 */
export async function selectLang(
  variables: {
    lang: string;
  },
  opt?: GqlOpt,
) {
  const res: {
    selectLang: Mutation["selectLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($lang: String!) {
        selectLang(lang: $lang)
      }
    `,
    variables,
  }, opt);
  const data = res.selectLang;
  return data;
}
