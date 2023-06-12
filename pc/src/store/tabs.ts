export interface TabInf {
  name: string,
  lbl?: string,
  path: string,
  active?: boolean,
  query?: { [key: string]: any },
  _hasPermit?: boolean, // 当前选项卡是否有权限打开
  fixed?: boolean, // 是否固定选项卡
}

export default defineStore("tabs", function() {
  
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
  
  function tabEqual(tab1: Pick<TabInf, "path" | "query">, tab2: Pick<TabInf, "path" | "query">) {
    if (tab1.path !== tab2.path) {
      return false;
    }
    tab1.query = tab1.query || { };
    tab2.query = tab2.query || { };
    const keys1 = [ "path", "query" ];
    for (let i = 0; i < keys1.length; i++) {
      const key1 = keys1[i];
      const val1 = tab1.query[key1];
      const val2 = tab2.query[key1];
      if (val1 !== val2) {
        return false;
      }
    }
    return true;
  }
  
  function hasTab(tab: Pick<TabInf, "path" | "query">) {
    return tabs.some((item) => tabEqual(item, tab));
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
      await router.replace({ path: "/", query: { } });
      return;
    }
    tabs = [ tab ];
    tab.active = true;
    keepAliveNames = [ tab.name ];
    await router.replace({ path: tab.path, query: tab.query });
  }
  
  async function moveTab(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) {
      return;
    }
    const tab = tabs[oldIndex];
    tabs.splice(oldIndex, 1);
    tabs.splice(newIndex, 0, tab);
  }
  
  async function refreshTab() {
    const route = useRoute();
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
    let name = route.meta?.name as string;
    if (!name) {
      name = String(route.name);
    }
    activeTab({
      name,
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
    hasTab,
    unshiftTab,
    refreshTab,
    removeTab,
    closeOtherTabs,
    moveTab,
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
