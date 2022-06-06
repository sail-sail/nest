import { MenuModel } from "@/views/menu/Model";
import { defineStore } from "pinia";

export default defineStore("menu", function() {
  
  let menus = $ref<MenuModel[]>([ ]);
  
  function setMenus(menus0: typeof menus) {
    menus = menus0 || [ ];
  }
  
  /**
   * 通过路由获取菜单
   * @param {string} path
   */
  function getMenuByPath(path: string) {
    let menu2: MenuModel;
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      if (menu.route_path === path) {
        menu2 = menu;
        return menu2;
      }
      for (let k = 0; k < menu.children.length; k++) {
        const item = menu.children[k];
        if (item.route_path === path) {
          menu2 = item;
          return menu2;
        }
        if (item.children && item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            const item2 = item.children[j];
            if (item2.route_path === path) {
              menu2 = item2;
              return menu2;
            }
            if (item2.children && item2.children.length > 0) {
              for (let l = 0; l < item2.children.length; l++) {
                const item3 = item2.children[l];
                if (item3.route_path === path) {
                  menu2 = item3;
                  return menu2;
                }
              }
            }
          }
        }
      }
    }
    return menu2;
  }
  
  /**
   * 通过菜单id向上找父菜单列表id
   * @param {string} id
   * @return {string[]}
   */
  function getParentIds(id: string): string[] {
    let parentIds: string[] = [ ];
    let menus0 = [ ...menus ];
    let parentId = id;
    const tmpFn = function(menus0: MenuModel[]) {
      for (let i = 0; i < menus0.length; i++) {
        const item = menus0[i];
        if (item.id === parentId) {
          parentIds.push(item.menu_id);
          parentId = item.menu_id;
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
  
  return {
    menus: $$(menus),
    isCollapse: $$(isCollapse),
    setMenus,
    getMenuByPath,
    getParentIds,
    clear,
    reset,
  };
}, { persist: true });
