import type {
  GetLoginInfo,
  Mutation,
  Query,
  MenuModel as MenuModel0,
} from "#/types.ts";

import {
  getRoutersMap,
} from "@/router/util.ts";

import Layout1 from "@/layout/layout1/index.vue";

import router from "@/router/index.ts";

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
        is_dyn_page
      }
      query {
        getMenus {
          ...GetMenusFragment
        }
      }
    `,
  }, opt);
  const menu_models = res.getMenus;
  const routersMap = getRoutersMap();
  // const routersKeys = Object.keys(routersMap);
  for (let i = 0; i < menu_models.length; i++) {
    const menu_model = menu_models[i];
    if (
      !menu_model.route_path ||
      !menu_model.route_path.startsWith("/") ||
      menu_model.route_path === "/" ||
      menu_model.route_path === "/index"
    ) {
      continue;
    }
    // 只为动态页面创建路由
    if (!menu_model.is_dyn_page) {
      continue;
    }
    const routerItem = routersMap[menu_model.route_path || ""];
    if (!routerItem) {
      let name = "";
      if (menu_model.parent_id_lbl) {
        name = menu_model.parent_id_lbl + "/" + menu_model.lbl;
      } else {
        name = menu_model.lbl;
      }
      router.addRoute({
        path: menu_model.route_path,
        component: Layout1,
        children: [
          {
            path: "",
            name,
            component: () => import("@/components/CustomDynList.vue"),
            props: (route) => {
              const query = route.query || { };
              if (menu_model.route_query) {
                try {
                  const queryObj = JSON.parse(menu_model.route_query);
                  Object.assign(query, queryObj);
                } catch (e) {
                  console.error("菜单路由参数解析错误:", e);
                }
              }
              return query;
            },
            meta: {
              name: menu_model.lbl,
              is_dyn_page: true,
            },
          },
        ],
      });
    }
  }
  // 移除无用路由
  // for (const keys of routersKeys) {
  //   const routerItem = routersMap[keys];
  //   if (
  //     !routerItem.path ||
  //     !routerItem.path.startsWith("/") ||
  //     routerItem.path === "/" ||
  //     routerItem.path === "/index"
  //   ) {
  //     continue;
  //   }
  //   let hasMenu = false;
  //   for (let i = 0; i < menu_models.length; i++) {
  //     const menu_model = menu_models[i];
  //     if (menu_model.route_path === routerItem.path) {
  //       hasMenu = true;
  //       break;
  //     }
  //   }
  //   if (hasMenu) {
  //     continue;
  //   }
  //   const name = routerItem.name || routerItem.children?.[0]?.name;
  //   if (!name) {
  //     continue;
  //   }
  //   router.removeRoute(name);
  // }
  const dataTree = list2tree(menu_models);
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
          tenant_id
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
