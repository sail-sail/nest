import { defineStore } from "pinia";
import { NavigationFailure, useRoute, useRouter } from "vue-router";

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
      const keys1 = tab.query ? Object.keys(tab.query) : [ ];
      const keys2 = Object.keys(actTab?.query || { });
      if (keys1.length === keys2.length) {
        let isEqual = true;
        for (let i = 0; i < keys1.length; i++) {
          const key1 = keys1[i];
          const val1 = tab.query![key1];
          const val2 = actTab!.query![key1];
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
  
  async function removeTab(path: string) {
    if (!path) {
      return false;
    }
    let idx = tabs.findIndex((item) => item.path === path);
    const tab = tabs[idx];
    if (tab.active) {
      if (idx !== -1) {
        if (tabs[idx + 1]) {
          activeTab(tabs[idx + 1]);
        } else if (tabs[idx - 1]) {
          activeTab(tabs[idx - 1]);
        } else {
          await useRouter().replace({ path: "/", query: { } });
        }
      }
    }
    if (idx !== -1) {
      tabs.splice(idx, 1);
    }
  }
  
  function closeOtherTabs(path: string) {
    const tab = tabs.find((item: TabInf) => item.path === path);
    if (!tab) {
      tabs = [ ];
      return;
    }
    tabs = [ tab ];
  }
  
  async function refreshTab() {
    const router = useRouter();
    const route = useRoute();
    if (!router) return;
    const routes = router.getRoutes();
    if (actTab && routes.some((item) => item.path === actTab?.path)) {
      activeTab(actTab);
      const navFail = await router.replace({
        path: actTab.path,
        query: actTab.query,
      });
      return navFail;
    }
    const tab = tabs[0];
    if (tab && routes.some((item) => item.path === tab?.path)) {
      activeTab(tab);
      const navFail = await router.replace({
        path: tab.path,
        query: tab.query,
      });
      return navFail;
    }
    const navFail = await router.replace("/");
    activeTab({ path: route.path });
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
