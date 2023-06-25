import { RouteRecordRaw } from "vue-router";
import Layout1 from "@/layout/layout1/index.vue";

export const routesGen: Array<RouteRecordRaw> = [
  {
    path: "/base/background_task",
    component: Layout1,
    children: [
      {
        path: "",
        name: "后台任务",
        component: () => import("@/views/base/background_task/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/dept",
    component: Layout1,
    children: [
      {
        path: "",
        name: "部门",
        component: () => import("@/views/base/dept/TreeList.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/dict",
    component: Layout1,
    children: [
      {
        path: "",
        name: "系统字典",
        component: () => import("@/views/base/dict/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/dict_detail",
    component: Layout1,
    children: [
      {
        path: "",
        name: "系统字典明细",
        component: () => import("@/views/base/dict_detail/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/dictbiz",
    component: Layout1,
    children: [
      {
        path: "",
        name: "业务字典",
        component: () => import("@/views/base/dictbiz/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/dictbiz_detail",
    component: Layout1,
    children: [
      {
        path: "",
        name: "业务字典明细",
        component: () => import("@/views/base/dictbiz_detail/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/i18n",
    component: Layout1,
    children: [
      {
        path: "",
        name: "国际化",
        component: () => import("@/views/base/i18n/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/lang",
    component: Layout1,
    children: [
      {
        path: "",
        name: "语言",
        component: () => import("@/views/base/lang/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/menu",
    component: Layout1,
    children: [
      {
        path: "",
        name: "菜单",
        component: () => import("@/views/base/menu/TreeList.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/operation_record",
    component: Layout1,
    children: [
      {
        path: "",
        name: "操作记录",
        component: () => import("@/views/base/operation_record/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/options",
    component: Layout1,
    children: [
      {
        path: "",
        name: "系统选项",
        component: () => import("@/views/base/options/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/permit",
    component: Layout1,
    children: [
      {
        path: "",
        name: "权限",
        component: () => import("@/views/base/permit/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/role",
    component: Layout1,
    children: [
      {
        path: "",
        name: "角色",
        component: () => import("@/views/base/role/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/tenant",
    component: Layout1,
    children: [
      {
        path: "",
        name: "租户",
        component: () => import("@/views/base/tenant/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/usr",
    component: Layout1,
    children: [
      {
        path: "",
        name: "用户",
        component: () => import("@/views/base/usr/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
];
