export interface TabInf {
  name: string,
  lbl?: string,
  path: string,
  active?: boolean,
  query?: { [key: string]: any },
  _hasPermit?: boolean, // 当前选项卡是否有权限打开
}

export default defineStore("tabs", function() {
  
  const route = useRoute();
  const router = useRouter();
  
  let tabs = $ref<TabInf[]>([ ]);
  
  const actTab = $computed(() => tabs.find((item) => item.active));
  
  let keepAliveNames = $ref<string[]>([ ]);
  
  function clearKeepAliveNames() {
    keepAliveNames = [ ];
    if (actTab) {
      keepAliveNames.push(actTab.name);
    }
  }
  
  function tabEqual(tab1: TabInf, tab2: TabInf) {
    if (tab1.path !== tab2.path) {
      return false;
    }
    const keys1 = tab1.query ? Object.keys(tab1.query) : [ ];
    const keys2 = Object.keys(tab2?.query || { });
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let i = 0; i < keys1.length; i++) {
      const key1 = keys1[i];
      const val1 = tab1.query![key1];
      const val2 = tab2!.query![key1];
      if (val1 !== val2) {
        return false;
      }
    }
    return true;
  }
  
  function activeTab(tab?: TabInf) {
    if (tab && tab.name) {
      if (!keepAliveNames.includes(tab.name)) {
        keepAliveNames.push(tab.name);
      }
    }
    if (tab && actTab) {
      if (tabEqual(tab, actTab)) {
        return;
      }
    }
    let idx = -1;
    if (tab) {
      idx = tabs.findIndex((item: TabInf) => {
        return tabEqual(item, tab);
      });
    }
    tabs.forEach((item: TabInf) => item.active = false);
    if (idx === -1) {
      if (tab && tab.lbl) {
        tabs.push(tab);
        if (!keepAliveNames.includes(tab.name)) {
          keepAliveNames.push(tab.name);
        }
      }
    } else {
      if (!keepAliveNames.includes(tabs[idx].name)) {
        keepAliveNames.push(tabs[idx].name);
      }
      tabs[idx].active = true;
      tabs[idx].query = tab?.query;
    }
  }
  
  function unshiftTab(...tabs0: TabInf[]) {
    for (let i = 0; i < tabs0.length; i++) {
      const tab = tabs0[tabs0.length - 1 - i];
      if (tabs.some((item) => tabEqual(item, tab))) {
        continue;
      }
      tabs.unshift(tab);
      if (!keepAliveNames.includes(tab.name)) {
        keepAliveNames.push(tab.name);
      }
    }
  }
  
  async function removeTab(tab: TabInf) {
    if (!tab) {
      return false;
    }
    const idx = tabs.findIndex((item: TabInf) => {
      return tabEqual(item, tab);
    });
    if (tab.active) {
      if (idx !== -1) {
        if (tabs[idx + 1]) {
          activeTab(tabs[idx + 1]);
        } else if (tabs[idx - 1]) {
          activeTab(tabs[idx - 1]);
        } else {
          await router.replace({ path: "/", query: { } });
        }
      }
    }
    if (idx !== -1) {
      tabs.splice(idx, 1);
      const idx2 = keepAliveNames.findIndex((item) => item === tab.name);
      if (idx2 !== -1) {
        keepAliveNames.splice(idx2, 1);
      }
    }
  }
  
  async function closeOtherTabs(tab?: TabInf) {
    if (!tab) {
      tabs = [ ];
      await router.replace({ path: "/home/index", query: { } });
      return;
    }
    tabs = [ tab ];
    tab.active = true;
    keepAliveNames = [ tab.name ];
  }
  
  async function refreshTab() {
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
    activeTab({
      name: "首页",
      path: route.path,
      query: route.query,
    });
    return navFail;
  }
  
  function reset() {
    tabs = [ ];
  }
  
  return $$({
    tabs,
    actTab,
    activeTab,
    unshiftTab,
    refreshTab,
    removeTab,
    closeOtherTabs,
    reset,
    keepAliveNames,
    clearKeepAliveNames,
  });
  
}, {
  persist: {
    paths: [
      "tabs",
    ],
  },
});
