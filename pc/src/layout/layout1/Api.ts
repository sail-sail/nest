import {
  type MenuModel as MenuModel0,
  type GetLoginInfo,
  type Mutation,
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
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($type: String) {
        menus: getMenus(type: $type) {
          id lbl route_path route_query children
        }
      }
    `,
    variables,
  }, opt);
  const result = data?.menus;
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
  const data = await gqlQuery({
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
  } = await gqlQuery({
    query: /* GraphQL */ `
      query {
        getLoginInfo {
          lbl
          lang
          dept_id
          dept_idModels {
            id
            lbl
          }
        }
      }
    `,
  }, opt);
  return data?.getLoginInfo;
}

export async function deptLoginSelect(
  variables: {
    dept_id: string;
  },
  opt?: GqlOpt,
) {
  const data: {
    deptLoginSelect: Mutation["deptLoginSelect"];
  } = await gqlQuery({
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
  } = await gqlQuery({
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
