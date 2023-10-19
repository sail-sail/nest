import {
  getRouterPaths,
} from "@/router/util";

export async function getHomeUrlMap() {
  const routers = getRouterPaths((router) => {
    if (router.meta?.isIndex === true) {
      return true;
    }
    return false;
  });
  return routers.map((router) => ({
    lbl: router.name,
    id: router.path,
  }));
}
