import type {
  RouteRecordRaw,
} from "vue-router";

import type {
  MenuModel as MenuModel0,
} from "#/types";

import Layout1 from "@/layout/layout1/index.vue";

type MenuModel = MenuModel0 & {
  children?: MenuModel[];
  oldRoute_path: string;
  _isShow?: boolean;
}

// 从 localStorage 读取缓存的菜单数据
export function getMenuRoutesFromStorage(): Array<RouteRecordRaw> {
  const menuRoutes: Array<RouteRecordRaw> = [];
  try {
    const menusStr = localStorage.getItem("store.menu.menus");
    if (menusStr) {
      const menus: MenuModel[] = JSON.parse(menusStr);
      
      // 过滤出动态页面的菜单
      const menus_dyn_page: MenuModel[] = [];
      function filterDynPageMenus(children: MenuModel[]) {
        for (let i = 0; i < children.length; i++) {
          const menu_model = children[i];
          if (menu_model.is_dyn_page) {
            menus_dyn_page.push(menu_model);
          }
          if (menu_model.children && menu_model.children.length > 0) {
            filterDynPageMenus(menu_model.children);
          }
        }
      }
      filterDynPageMenus(menus);
      
      // 为动态页面创建路由
      function treeMenus(children: MenuModel[]) {
        for (let i = 0; i < children.length; i++) {
          const menu_model = children[i];
          if (
            !menu_model.route_path ||
            !menu_model.route_path.startsWith("/") ||
            menu_model.route_path === "/" ||
            menu_model.route_path === "/index"
          ) {
            if (menu_model.children && menu_model.children.length > 0) {
              treeMenus(menu_model.children);
            }
            continue;
          }
          
          let name = "";
          if (menu_model.parent_id_lbl) {
            name = menu_model.parent_id_lbl + "/" + menu_model.lbl;
          } else {
            name = menu_model.lbl;
          }
          
          menuRoutes.push({
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
      
      treeMenus(menus_dyn_page);
    }
  } catch (e) {
    console.error("读取菜单缓存失败:", e);
  }
  return menuRoutes;
}
