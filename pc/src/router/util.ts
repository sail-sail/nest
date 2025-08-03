import type {
  Component,
} from "vue";

import type {
  Router,
  RouteRecordRaw,
} from "vue-router";

import cfg from "@/utils/config";

import router0 from "./index";

export function getRouter(path0?: string) {
  if (!path0) {
    return;
  }
  const routers = router0.getRoutes();
  function tmpFn(router: RouteRecordRaw) {
    if (router.path === path0) {
      return router;
    }
    if (router.children) {
      for (let i = 0; i < router.children.length; i++) {
        const item = router.children[i];
        tmpFn(item);
      }
    }
  }
  for (let i = 0; i < routers.length; i++) {
    const item = routers[i];
    const router = tmpFn(item);
    if (router) {
      return router;
    }
  }
}

export function getRouters() {
  const routersRv: RouteRecordRaw[] = [ ];
  const routers = router0.getRoutes();
  function tmpFn(router: RouteRecordRaw) {
    if (router.path.startsWith("/")) {
      routersRv.push(router);
    }
    if (router.children) {
      for (let i = 0; i < router.children.length; i++) {
        const item = router.children[i];
        tmpFn(item);
      }
    }
  }
  for (let i = 0; i < routers.length; i++) {
    const item = routers[i];
    tmpFn(item);
  }
  return routersRv;
}

export function getRouterPaths(
  filterFn?: (router: RouteRecordRaw) => boolean,
) {
  const paths: {
    name: string;
    path: string;
  }[] = [ ];
  const routers = getRouters();
  for (let i = 0; i < routers.length; i++) {
    const router = routers[i];
    if (typeof router.name === "symbol") {
      continue;
    }
    if (!router.name) {
      continue;
    }
    if (filterFn) {
      const isIn = filterFn(router);
      if (!isIn) {
        continue;
      }
    }
    paths.push({
      name: String(router.meta?.name || router.name),
      path: router.path,
    });
  }
  return paths;
}

export async function getComponent(path0: string): Promise<Component> {
  const router = getRouter(path0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compFn = router?.components?.default as any;
  if (compFn instanceof Function) {
    const comp = await compFn();
    return comp.default;
  }
  return compFn.default;
}

/**
 * 根据路由名称获取路由
 */
export function getRouterByName(
  router0: Router,
  name?: string,
) {
  if (!name) {
    return;
  }
  const routers = router0.getRoutes();
  function tmpFn(router: RouteRecordRaw) {
    if (router.name === name) {
      return router;
    }
    if (router.children) {
      for (let i = 0; i < router.children.length; i++) {
        const item = router.children[i];
        tmpFn(item);
      }
    }
  }
  for (let i = 0; i < routers.length; i++) {
    const item = routers[i];
    const router = tmpFn(item);
    if (router) {
      return router;
    }
  }
}

export async function openForeignPage(
  routeName: string,
  tabName: string | undefined,
  query?: { [key: string]: string },
) {
  const tabsStore = useTabsStore();
  await tabsStore.openPageByRouteName(
    routeName,
    tabName,
    query,
  );
}
