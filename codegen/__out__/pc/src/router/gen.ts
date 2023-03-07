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
    path: "/dept",
    component: Layout1,
    children: [
      {
        path: "",
        name: "部门",
        component: () => import("@/views/dept/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/dict",
    component: Layout1,
    children: [
      {
        path: "",
        name: "系统字典",
        component: () => import("@/views/dict/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/dict_detail",
    component: Layout1,
    children: [
      {
        path: "",
        name: "系统字典明细",
        component: () => import("@/views/dict_detail/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/dictbiz",
    component: Layout1,
    children: [
      {
        path: "",
        name: "业务字典",
        component: () => import("@/views/dictbiz/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/dictbiz_detail",
    component: Layout1,
    children: [
      {
        path: "",
        name: "业务字典明细",
        component: () => import("@/views/dictbiz_detail/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/i18n",
    component: Layout1,
    children: [
      {
        path: "",
        name: "国际化",
        component: () => import("@/views/i18n/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/lang",
    component: Layout1,
    children: [
      {
        path: "",
        name: "语言",
        component: () => import("@/views/lang/List.vue"),
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
    path: "/options",
    component: Layout1,
    children: [
      {
        path: "",
        name: "系统选项",
        component: () => import("@/views/options/List.vue"),
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
