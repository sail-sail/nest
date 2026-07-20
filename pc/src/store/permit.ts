import type {
  GetUsrPermits,
} from "@/typings/types";

import {
  getUsrPermits as getUsrPermitsApi,
} from "@/layout/layout1/Api.ts";

type PermitItem = Pick<GetUsrPermits, "code" | "route_path">;

type PermitRouteState = {
  loaded: boolean;
  permits: Record<string, boolean>;
};

const permits = ref<PermitItem[]>([ ]);
const routePermitMap = reactive<Record<string, PermitRouteState>>({ });
const routePermitLoading = reactive<Record<string, Promise<Record<string, boolean>> | undefined>>({ });

const usrStore = useUsrStore();

function buildPermitMap(route_path: string, permitItems: PermitItem[]) {
  const permitObj = permitItems
    .filter((permit) => permit.route_path === route_path)
    .reduce<Record<string, boolean>>((prev, curr) => ({
      ...prev,
      [curr.code]: true,
    }), {});
  routePermitMap[route_path] = {
    loaded: true,
    permits: permitObj,
  };
  return permitObj;
}

function mergePermits(permitItems: PermitItem[]) {
  const nextPermits = [ ...permits.value ];
  for (const item of permitItems) {
    const idx = nextPermits.findIndex((permit) => permit.route_path === item.route_path && permit.code === item.code);
    if (idx === -1) {
      nextPermits.push(item);
      continue;
    }
    nextPermits[idx] = item;
  }
  permits.value = nextPermits;
}

export default function() {
  function getRoutePermitMap(route_path: string) {
    const cacheState = routePermitMap[route_path];
    if (cacheState?.loaded) {
      return cacheState.permits;
    }
    const matchingPermits = permits.value.filter((permit) => permit.route_path === route_path);
    if (matchingPermits.length > 0) {
      return buildPermitMap(route_path, matchingPermits);
    }
    return { };
  }

  async function requestRoutePermits(route_path: string) {
    if (routePermitLoading[route_path]) {
      return await routePermitLoading[route_path];
    }
    const pending = (async () => {
      const data = await getUsrPermitsApi(route_path, { notLoading: true });
      const permitItems = (data || [ ]) as PermitItem[];
      mergePermits(permitItems);
      return buildPermitMap(route_path, permitItems);
    })();
    routePermitLoading[route_path] = pending;
    try {
      return await pending;
    } finally {
      delete routePermitLoading[route_path];
    }
  }

  function getPermit(route_path?: string) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }

    function permit(code: string, lbl?: string) {
      if (usrStore.isAdmin()) {
        return true;
      }
      const permitObj = getRoutePermitMap(route_path!);
      const isLoaded = Boolean(routePermitMap[route_path!]?.loaded);
      if (!isLoaded && !routePermitLoading[route_path!]) {
        void requestRoutePermits(route_path!);
      }
      return Boolean(permitObj[code]);
    }

    async function permitAsync(code: string, lbl?: string) {
      if (usrStore.isAdmin()) {
        return true;
      }
      const permitObj = getRoutePermitMap(route_path!);
      if (routePermitMap[route_path!]?.loaded || Object.keys(permitObj).length > 0) {
        return Boolean(permitObj[code]);
      }
      const nextPermitObj = await requestRoutePermits(route_path!);
      return Boolean(nextPermitObj[code]);
    }

    const permitFn = ((code: string, lbl?: string) => permit(code, lbl)) as typeof permit & {
      permit: typeof permit;
      permitAsync: typeof permitAsync;
    };
    permitFn.permit = permit;
    permitFn.permitAsync = permitAsync;
    return permitFn;
  }

  function clear() {
    permits.value = [ ];
    Object.keys(routePermitMap).forEach((key) => {
      delete routePermitMap[key];
    });
    Object.keys(routePermitLoading).forEach((key) => {
      delete routePermitLoading[key];
    });
  }
  
  return {
    get permits() {
      return permits.value;
    },
    set permits(value: PermitItem[]) {
      permits.value = value;
      const currentRoute = useRoute().path;
      if (currentRoute) {
        getRoutePermitMap(currentRoute);
      }
    },
    getPermit,
    clear,
  };
  
};
