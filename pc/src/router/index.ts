import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
} from "vue-router";
import { routesGen } from "./gen";
// import useMenuStore from "../store/menu";
// import useTabsStore from "../store/tabs";

const routes: Array<RouteRecordRaw> = [
  ...routesGen,
  // {
  //   path: "",
  //   redirect: "/index",
  // },
  // {
  //   path: "/index",
  //   name: "主页",
  //   component: () => import("@/views/Index.vue"),
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
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
