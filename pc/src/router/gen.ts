import { RouteRecordRaw } from "vue-router";

export const routesGen: Array<RouteRecordRaw> = [
  {
    path: "/background_task",
    name: "后台任务",
    component: () => import("@/views/background_task/List.vue"),
  },
  {
    path: "/menu",
    name: "菜单",
    component: () => import("@/views/menu/List.vue"),
  },
  {
    path: "/permit",
    name: "权限",
    component: () => import("@/views/permit/List.vue"),
  },
  {
    path: "/role",
    name: "角色",
    component: () => import("@/views/role/List.vue"),
  },
  {
    path: "/tenant",
    name: "租户",
    component: () => import("@/views/tenant/List.vue"),
  },
  {
    path: "/usr",
    name: "用户",
    component: () => import("@/views/usr/List.vue"),
  },
];
