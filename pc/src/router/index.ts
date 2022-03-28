import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
} from "vue-router";
import { routesGen } from "./gen";

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

export default router;
