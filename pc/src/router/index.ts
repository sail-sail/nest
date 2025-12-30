import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
} from "vue-router";

import { routesGen } from "./gen.ts";

import {
  getMenuRoutesFromStorage,
} from "./menu_routes.ts";

import Layout1 from "@/layout/layout1/index.vue";

const routes: Array<RouteRecordRaw> = [
  ...routesGen,
  ...getMenuRoutesFromStorage(),
  {
    path: "",
    redirect: "/index",
  },
  {
    path: "/index",
    component: Layout1,
    children: [
      {
        path: "",
        name: "首页",
        component: () => import("@/views/Index.vue"),
        meta: {
          closeable: true,
          icon: "iconfont-home-fill",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes,
});

// router.beforeEach((to, from) => {
//   const tabsStore = useTabsStore();
//   if (tabsStore.actTab?._hasPermit) {
//     return true;
//   }
//   if (to.path === "/index" || to.path === "/" || to.path === "") {
//     return true;
//   }
//   const menuStore = useMenuStore();
//   const menu = menuStore.getMenuByPath(to.path);
//   if (!menu) {
//     tabsStore.activeTab({ path: from.path });
//     alert("无权限打开此菜单!");
//     return false;
//   }
//   if (tabsStore.actTab) {
//     tabsStore.actTab._hasPermit = true;
//   }
//   return true;
// });

export default router;
