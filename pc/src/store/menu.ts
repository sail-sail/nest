import type {
  MenuModel as MenuModel0,
} from "#/types";

import type {
  LocationQuery,
} from "vue-router";

type MenuModel = MenuModel0 & {
  children?: MenuModel[];
  oldRoute_path: string;
  _isShow?: boolean;
}

export default defineStore("menu", function() {
  
  /** 菜单搜索关键字 */
  const search = ref("");
  
  const menus = ref<MenuModel[]>([ ]);
  
  const pathMenuMap = computed(() => {
    const pathMenuMap = new Map<string, MenuModel>();
    treeMenu(menus.value, (item) => {
      pathMenuMap.set(item.route_path, item);
      return true;
    });
    return pathMenuMap;
  });
  
  /**
   * 通过当前路由获取菜单名字
   */
  function getLblByPath(path: string) {
    const menu = pathMenuMap.value.get(path);
    return menu?.lbl;
  }
  
  function setMenus(menus0: MenuModel[]) {
    menus.value = menus0 || [ ];
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
      treeMenu(menus.value, (item) => {
        if (item.oldRoute_path === src && item.lbl === name) {
          menu2 = item;
          return false;
        }
        return true;
      });
      return menu2;
    }
    let menu2: MenuModel | undefined = undefined;
    treeMenu(menus.value, (item) => {
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
   * @param {MenuId} id
   */
  function getMenuById(id: MenuId): MenuModel | undefined {
    if (!id) {
      return;
    }
    let menu2: MenuModel | undefined = undefined;
    treeMenu(menus.value, (item) => {
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
   * @param {MenuId} id
   * @return {MenuId[]}
   */
  function getParentIds(id: MenuId): MenuId[] {
    const parentIds: MenuId[] = [ ];
    const menus0 = [ ...menus.value ];
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
  
  function getParentMenus(id: MenuId): MenuModel[] {
    const parentMenus: MenuModel[] = [ ];
    let parent_id = id;
    while (parent_id) {
      const parentMenu = getMenuById(parent_id);
      if (parentMenu) {
        parentMenus.push(parentMenu);
        parent_id = parentMenu.parent_id;
      } else {
        parent_id = "" as MenuId;
      }
    }
    return parentMenus;
  }
  
  function clear() {
    menus.value = [ ];
  }
  
  function reset() {
    menus.value = [ ];
  }
  
  const isCollapse = ref(false);
  const hide = ref(false);
  
  function searchMenu(search: string) {
    treeMenu(menus.value, (item) => {
      if (!item.route_path) {
        item._isShow = false;
        return true;
      }
      if (item.lbl.includes(search)) {
        item._isShow = true;
        const parentMenus = getParentMenus(item.id);
        for (let i = 0; i < parentMenus.length; i++) {
          const parentMenu = parentMenus[i];
          parentMenu._isShow = true;
        }
      } else {
        item._isShow = false;
      }
      return true;
    });
  }
  
  let searchTimer: NodeJS.Timeout | undefined = undefined;
  
  watch(
    () => search,
    () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      if (isEmpty(search.value)) {
        treeMenu(menus.value, (item) => {
          item._isShow = true;
          return true;
        });
        return;
      }
      searchTimer = setTimeout(() => {
        searchMenu(search.value);
      }, 300);
    },
  );
  
  return {
    menus,
    isCollapse,
    setMenus,
    getMenuByPath,
    getMenuById,
    getParentIds,
    clear,
    reset,
    hide,
    search,
    getLblByPath,
  };
},
{
  persist: {
    pick: [
      "menus",
    ],
  },
});
