import { RouteRecordRaw } from "vue-router";
import Layout1 from "@/layout/layout1/index.vue";

export const routesGen: Array<RouteRecordRaw> = [
  {
    path: "/background_task",
    component: Layout1,
    children: [
      {
        path: "",
        name: "后台任务",
        component: () => import("@/views/background_task/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/menu",
    component: Layout1,
    children: [
      {
        path: "",
        name: "菜单",
        component: () => import("@/views/menu/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/operation_record",
    component: Layout1,
    children: [
      {
        path: "",
        name: "操作记录",
        component: () => import("@/views/operation_record/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/option",
    component: Layout1,
    children: [
      {
        path: "",
        name: "选项",
        component: () => import("@/views/option/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/permit",
    component: Layout1,
    children: [
      {
        path: "",
        name: "权限",
        component: () => import("@/views/permit/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/role",
    component: Layout1,
    children: [
      {
        path: "",
        name: "角色",
        component: () => import("@/views/role/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/tenant",
    component: Layout1,
    children: [
      {
        path: "",
        name: "租户",
        component: () => import("@/views/tenant/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/usr",
    component: Layout1,
    children: [
      {
        path: "",
        name: "用户",
        component: () => import("@/views/usr/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
];
