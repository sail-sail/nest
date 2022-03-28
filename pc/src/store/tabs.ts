import { defineStore } from "pinia";

export interface TabInf {
  lbl?: string,
  path: string,
  active?: boolean,
  query?: { [key: string]: any },
}

export default defineStore("tabs", function() {
  
  let tabs = $ref<TabInf[]>([ ]);
  
  let actTab = $computed(() => tabs.find((item) => item.active));
  
  function activeTab(tab?: TabInf) {
    let idx = -1;
    if (tab) {
      idx = tabs.findIndex((item: TabInf) => item.path === tab.path);
    }
    tabs.forEach((item: TabInf) => item.active = false);
    if (idx === -1) {
      if (tab && tab.lbl) {
        tabs.push(tab);
      }
    } else {
      tabs[idx].active = true;
    }
  }
  
  function removeTab(path: string) {
    if (!path) return;
    const idx = tabs.findIndex((item: TabInf) => item.path === path);
    if (idx === -1) return;
    tabs.splice(idx, 1);
  }
  
  function closeOtherTabs(path: string) {
    const tab = tabs.find((item: TabInf) => item.path === path);
    if (!tab) {
      tabs = [ ];
      return;
    }
    tabs = [ tab ];
  }
  
  function reset() {
    tabs = [ ];
  }
  
  return $$({
    tabs,
    actTab,
    activeTab,
    removeTab,
    closeOtherTabs,
    reset,
  });
}, { persist: true });
