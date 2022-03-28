import { MenuModel } from "@/views/menu/Model";
import { defineStore } from "pinia";

export default defineStore("menu", function() {
  
  let menus = $ref<MenuModel[]>([ ]);
  
  function setMenus(menus0: typeof menus) {
    menus = menus0;
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
    clear,
    reset,
  });
}, { persist: true });
