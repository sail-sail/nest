import { defineStore } from "pinia";
import { NavigationFailure, useRouter } from "vue-router";

export interface TabInf {
  lbl?: string,
  path: string,
  active?: boolean,
  query?: { [key: string]: any },
  _hasPermit?: boolean, // 当前选项卡是否有权限打开
}

export default defineStore("tabs", function() {
  
  let tabs = $ref<TabInf[]>([ ]);
  
  let actTab = $computed(() => tabs.find((item) => item.active));
  
  function activeTab(tab?: TabInf) {
    if (tab && actTab && tab.path === actTab.path) {
      const keys1 = Object.keys(tab.query);
      const keys2 = Object.keys(actTab?.query || { });
      if (keys1.length === keys2.length) {
        let isEqual = true;
        for (let i = 0; i < keys1.length; i++) {
          const key1 = keys1[i];
          const val1 = tab.query[key1];
          const val2 = actTab.query[key1];
          if (val1 !== val2) {
            isEqual = false;
            break;
          }
        }
        if (isEqual) {
          return;
        }
      }
    }
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
      tabs[idx].query = tab?.query;
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
  
  async function refreshTab(): Promise<NavigationFailure> {
    const router = useRouter();
    if (!router) return;
    let navFail: NavigationFailure;
    if (actTab) {
      navFail = <NavigationFailure> await router.replace({
        path: actTab.path,
        query: actTab.query,
      });
      return;
    }
    const tab = tabs[0];
    if (tab) {
      activeTab(tab);
      navFail = <NavigationFailure> await router.replace({
        path: tab.path,
        query: tab.query,
      });
    }
    return navFail;
  }
  
  function reset() {
    tabs = [ ];
  }
  
  return $$({
    tabs,
    actTab,
    activeTab,
    refreshTab,
    removeTab,
    closeOtherTabs,
    reset,
  });
}, { persist: true });
