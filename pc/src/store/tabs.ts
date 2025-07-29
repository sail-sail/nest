import type {
  RouteLocationNormalizedLoaded,
  RouteMeta,
} from "vue-router";

import config from "@/utils/config";

import {
  getRouterByName,
} from "@/router/util";

export interface TabInf {
  name: string,
  lbl?: string,
  path: string,
  active?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: { [key: string]: any },
  _hasPermit?: boolean, // 当前选项卡是否有权限打开
  fixed?: boolean, // 是否固定选项卡
  closeable?: boolean, // 是否可关闭
  icon?: string, // 图标
  meta?: RouteMeta,
}

const tabs = useStorage<TabInf[]>("store.tabs.tabs", [ ]);

const actTab = computed(() => tabs.value.find((item) => item.active));

const keepAliveNames = ref<string[]>([ ]);

let indexIsEmptyHandle: ReturnType<typeof watch> | undefined;

const menuStore = useMenuStore();

export default function() {
  
  if (config.indexIsEmpty && !indexIsEmptyHandle) {
    indexIsEmptyHandle = watch(
      () => tabs.value.length,
      async () => {
        if (tabs.value.length === 0) {
          setIndexTab(true);
          return;
        }
        await removeTab({
          name: "首页",
          path: "/index",
        });
      },
    );
  }
  
  function clearKeepAliveNames() {
    keepAliveNames.value = [ ];
    if (actTab.value) {
      keepAliveNames.value.push(actTab.value.name);
    }
  }
  
  function tabEqual(tab1: Pick<TabInf, "path" | "query">, tab2: Pick<TabInf, "path" | "query">) {
    if (tab1.path !== tab2.path) {
      return false;
    }
    tab1.query = tab1.query || { };
    tab2.query = tab2.query || { };
    const keys1 = Object.keys(tab1.query);
    const keys2 = Object.keys(tab2.query);
    if (keys1.length !== keys2.length) {
      return false;
    }
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
    return tabs.value.some((item) => tabEqual(item, tab));
  }
  
  function findTab(tab: Pick<TabInf, "path" | "query">) {
    return tabs.value.find((item) => tabEqual(item, tab));
  }
  
  function activeTab(tab?: TabInf) {
    if (tab && tab.name) {
      if (!keepAliveNames.value.includes(tab.name)) {
        keepAliveNames.value.push(tab.name);
      }
    }
    if (tab && actTab.value) {
      if (tabEqual(tab, actTab.value)) {
        return;
      }
    }
    let idx = -1;
    if (tab) {
      idx = tabs.value.findIndex((item: TabInf) => {
        return tabEqual(item, tab);
      });
    }
    tabs.value.forEach((item: TabInf) => item.active = false);
    if (idx === -1) {
      if (tab && tab.lbl) {
        tabs.value.push(tab);
        if (!keepAliveNames.value.includes(tab.name)) {
          keepAliveNames.value.push(tab.name);
        }
      }
    } else {
      if (!keepAliveNames.value.includes(tabs.value[idx].name)) {
        keepAliveNames.value.push(tabs.value[idx].name);
      }
      tabs.value[idx].active = true;
      tabs.value[idx].query = tab?.query;
    }
  }
  
  function unshiftTab(...tabs0: TabInf[]) {
    for (let i = 0; i < tabs0.length; i++) {
      const tab = tabs0[tabs0.length - 1 - i];
      if (tabs.value.some((item) => tabEqual(item, tab))) {
        continue;
      }
      tabs.value.unshift(tab);
      if (!keepAliveNames.value.includes(tab.name)) {
        keepAliveNames.value.push(tab.name);
      }
    }
  }
  
  async function removeTab(tab: TabInf, force = false) {
    
    const router = useRouter();
    
    if (!tab) {
      return false;
    }
    if (!force && tab.closeable === false) {
      return false;
    }
    const idx = tabs.value.findIndex((item: TabInf) => {
      return tabEqual(item, tab);
    });
    if (tab.active) {
      if (idx !== -1) {
        if (tabs.value[idx + 1]) {
          activeTab(tabs.value[idx + 1]);
        } else if (tabs.value[idx - 1]) {
          activeTab(tabs.value[idx - 1]);
        } else {
          await router.replace({ path: "/", query: { } });
        }
      }
    }
    setTimeout(() => {
      if (idx !== -1) {
        const idx2 = keepAliveNames.value.findIndex((item) => item === tab.name);
        if (idx2 !== -1) {
          keepAliveNames.value.splice(idx2, 1);
        }
        tabs.value.splice(idx, 1);
      }
    }, 0);
  }
  
  /** 关闭当前路由对应的选项卡 */
  function closeCurrentTab(
    tab0: Pick<TabInf, "path" | "query">,
    force = false,
  ) {
    const tab = findTab({
      path: tab0.path,
      query: tab0.query,
    });
    if (!tab) {
      return;
    }
    tab.active = false;
    removeTab(tab, force);
  }
  
  async function closeOtherTabs(tab?: TabInf) {
    
    const router = useRouter();
    
    const notCloseableTabs = tabs.value.filter((item) => item.closeable === false);
    if (!tab) {
      tabs.value = notCloseableTabs;
      await router.replace({ path: "/", query: { } });
      return;
    }
    tabs.value = [ ...notCloseableTabs ];
    if (!notCloseableTabs.some((item) => tab && tabEqual(item, tab))) {
      tabs.value.push(tab);
    }
    tab.active = true;
    keepAliveNames.value = [ tab.name ];
    await router.replace({ path: tab.path, query: tab.query });
  }
  
  async function moveTab(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) {
      return;
    }
    const tab = tabs.value[oldIndex];
    tabs.value.splice(oldIndex, 1);
    tabs.value.splice(newIndex, 0, tab);
  }
  
  async function refreshTab(route: RouteLocationNormalizedLoaded) {
    
    const router = useRouter();
    
    let hash = location.hash;
    if (hash.startsWith("#")) {
      hash = hash.substring(1);
    }
    if (hash.startsWith("/")) {
      hash = hash.substring(1);
    }
    if (hash) {
      return;
    }
    const routes = router.getRoutes();
    if (actTab.value && routes.some((item) => item.path === actTab.value?.path)) {
      activeTab(actTab.value);
      const navFail = await router.replace({
        path: actTab.value.path,
        query: actTab.value.query,
      });
      return navFail;
    }
    const tab = tabs.value[0];
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
  
  function setIndexTab(active = false) {
    if (config.indexIsEmpty) {
      return;
    }
    const tab = findTab({
      path: "/index",
      query: { },
    });
    if (tab) {
      return tab;
    }
    {
      const name = "首页";
      const lbl = name;
      const closeable = true;
      const icon = "iconfont-home-fill";
      const tab: TabInf = {
        name,
        lbl,
        active: false,
        path: "/index",
        closeable,
        icon,
      };
      unshiftTab(tab);
      if (active) {
        activeTab(tab);
      }
      return tab;
    }
  }
  
  async function openPageByRouteName(
    routeName: string,
    tabName?: string,
    query?: { [key: string]: string },
  ) {
    
    const router = useRouter();
    const routeNow = useRoute();
    
    const route = getRouterByName(router, routeName);
    if (!route) {
      ElMessage.error(`未找到对应的路由 ${ routeName }`);
      return;
    }
    const menuLbl = menuStore.getLblByPath(route.path);
    const name = route.name as string;
    let lbl = menuLbl || (route.meta?.name as string) || name || "";
    if (tabName) {
      lbl = `${ lbl } - ${ tabName }`;
    }
    const tab: TabInf = {
      name,
      lbl,
      active: true,
      path: route.path,
      query: { },
      meta: route.meta,
    };
    if (query) {
      tab.query = {
        ...query,
      };
    }
    const oldTab = findTab({
      path: route.path,
      query,
    });
    activeTab(tab);
    const navFail = await router.push({
      path: tab.path,
      query: tab.query,
    });
    if (oldTab) {
      oldTab.lbl = tab.lbl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const comp = routeNow.matched[1].instances?.default as any;
      await comp?.refresh?.();
    }
    return navFail;
  }
  
  function reset() {
    tabs.value = [ ];
    const tab = setIndexTab();
    if (tab) {
      activeTab(tab);
    }
  }
  
  return {
    get tabs() {
      return tabs.value;
    },
    set tabs(value: TabInf[]) {
      tabs.value = value || [ ];
    },
    get actTab() {
      return actTab.value;
    },
    activeTab,
    hasTab,
    findTab,
    tabEqual,
    unshiftTab,
    refreshTab,
    removeTab,
    closeOtherTabs,
    closeCurrentTab,
    setIndexTab,
    moveTab,
    reset,
    get keepAliveNames() {
      return keepAliveNames.value;
    },
    set keepAliveNames(value: string[]) {
      keepAliveNames.value = value || [ ];
    },
    clearKeepAliveNames,
    openPageByRouteName,
  };
  
};
