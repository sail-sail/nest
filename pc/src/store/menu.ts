import {
  type MenuModel as MenuModel0,
} from "#/types";

import {
  type LocationQuery,
} from "vue-router";

type MenuModel = MenuModel0 & {
  children?: MenuModel[];
  oldRoute_path: string;
}

export default defineStore("menu", function() {
  
  let menus = $ref<MenuModel[]>([ ]);
  
  const pathMenuMap = $computed(() => {
    const pathMenuMap = new Map<string, MenuModel>();
    treeMenu(menus, (item) => {
      pathMenuMap.set(item.route_path, item);
      return true;
    });
    return pathMenuMap;
  });
  
  /**
   * 通过当前路由获取菜单名字
   */
  function getLblByPath(path: string) {
    const menu = pathMenuMap.get(path);
    return menu?.lbl;
  }
  
  function setMenus(menus0: typeof menus) {
    menus = menus0 || [ ];
  }
  
  function treeMenu(children: MenuModel[], callback: (item: MenuModel) => boolean) {
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      const isNotReturn = callback(item);
      if (!isNotReturn) {
        return;
      }
      if (item.children && item.children.length > 0) {
        treeMenu(item.children, callback);
      }
    }
  }
  
  /**
   * 通过路由获取菜单
   * @param {string} path
   */
  function getMenuByPath(path: string, query: LocationQuery): MenuModel | undefined {
    if (path === "/myiframe") {
      const name = query["name"];
      const src = query["src"];
      let menu2: MenuModel | undefined = undefined;
      treeMenu(menus, (item) => {
        if (item.oldRoute_path === src && item.lbl === name) {
          menu2 = item;
          return false;
        }
        return true;
      });
      return menu2;
    }
    let menu2: MenuModel | undefined = undefined;
    treeMenu(menus, (item) => {
      if (item.route_path === path) {
        menu2 = item;
        return false;
      }
      return true;
    });
    return menu2;
  }
  
  /**
   * 通过路由获取菜单
   * @param {string} id
   */
  function getMenuById(id: string): MenuModel | undefined {
    if (!id) {
      return;
    }
    let menu2: MenuModel | undefined = undefined;
    treeMenu(menus, (item) => {
      if (item.id === id) {
        menu2 = item;
        return false;
      }
      return true;
    });
    return menu2;
  }
  
  /**
   * 通过菜单id向上找父菜单列表id
   * @param {string} id
   * @return {string[]}
   */
  function getParentIds(id: string): string[] {
    const parentIds: string[] = [ ];
    const menus0 = [ ...menus ];
    let parentId = id;
    const tmpFn = function(menus0: MenuModel[]) {
      for (let i = 0; i < menus0.length; i++) {
        const item = menus0[i];
        if (item.id === parentId) {
          parentIds.push(item.parent_id);
          parentId = item.parent_id;
        }
        const children = item.children;
        if (children && children.length > 0) {
          tmpFn(children);
        }
      }
    };
    tmpFn(menus0);
    return parentIds;
  }
  
  function clear() {
    menus = [ ];
  }
  
  function reset() {
    menus = [ ];
  }
  
  let isCollapse = $ref(false);
  
  return $$({
    menus,
    isCollapse,
    setMenus,
    getMenuByPath,
    getMenuById,
    getParentIds,
    clear,
    reset,
    getLblByPath,
  });
}, {
  persist: {
    paths: [
      "menus",
    ],
  },
});
