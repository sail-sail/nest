import { defineStore } from "pinia";
import { NavigationFailure, useRouter } from "vue-router";

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
