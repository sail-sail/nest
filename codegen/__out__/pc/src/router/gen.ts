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
        meta: {
          name: "后台任务",
        },
      },
    ],
  },
  {
    path: "/base/data_permit",
    component: Layout1,
    children: [
      {
        path: "",
        name: "数据权限TreeList",
        component: () => import("@/views/base/data_permit/TreeList.vue"),
        props: (route) => route.query,
        meta: {
          name: "数据权限",
        },
      },
    ],
  },
  {
    path: "/base/dept",
    component: Layout1,
    children: [
      {
        path: "",
        name: "部门TreeList",
        component: () => import("@/views/base/dept/TreeList.vue"),
        props: (route) => route.query,
        meta: {
          name: "部门",
        },
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
        meta: {
          name: "系统字典",
        },
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
        meta: {
          name: "系统字典明细",
        },
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
        meta: {
          name: "业务字典",
        },
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
        meta: {
          name: "业务字典明细",
        },
      },
    ],
  },
  {
    path: "/base/domain",
    component: Layout1,
    children: [
      {
        path: "",
        name: "域名",
        component: () => import("@/views/base/domain/List.vue"),
        props: (route) => route.query,
        meta: {
          name: "域名",
        },
      },
    ],
  },
  {
    path: "/base/field_permit",
    component: Layout1,
    children: [
      {
        path: "",
        name: "字段权限TreeList",
        component: () => import("@/views/base/field_permit/TreeList.vue"),
        props: (route) => route.query,
        meta: {
          name: "字段权限",
        },
      },
    ],
  },
  {
    path: "/base/i18n",
    component: Layout1,
    children: [
      {
        path: "",
        name: "国际化TreeList",
        component: () => import("@/views/base/i18n/TreeList.vue"),
        props: (route) => route.query,
        meta: {
          name: "国际化",
        },
      },
    ],
  },
  {
    path: "/base/icon",
    component: Layout1,
    children: [
      {
        path: "",
        name: "图标库",
        component: () => import("@/views/base/icon/List.vue"),
        props: (route) => route.query,
        meta: {
          name: "图标库",
        },
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
        meta: {
          name: "语言",
        },
      },
    ],
  },
  {
    path: "/base/login_log",
    component: Layout1,
    children: [
      {
        path: "",
        name: "登录日志",
        component: () => import("@/views/base/login_log/List.vue"),
        props: (route) => route.query,
        meta: {
          name: "登录日志",
        },
      },
    ],
  },
  {
    path: "/base/menu",
    component: Layout1,
    children: [
      {
        path: "",
        name: "菜单TreeList",
        component: () => import("@/views/base/menu/TreeList.vue"),
        props: (route) => route.query,
        meta: {
          name: "菜单",
        },
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
        meta: {
          name: "操作记录",
        },
      },
    ],
  },
  {
    path: "/base/optbiz",
    component: Layout1,
    children: [
      {
        path: "",
        name: "业务选项",
        component: () => import("@/views/base/optbiz/List.vue"),
        props: (route) => route.query,
        meta: {
          name: "业务选项",
        },
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
        meta: {
          name: "系统选项",
        },
      },
    ],
  },
  {
    path: "/base/org",
    component: Layout1,
    children: [
      {
        path: "",
        name: "组织",
        component: () => import("@/views/base/org/List.vue"),
        props: (route) => route.query,
        meta: {
          name: "组织",
        },
      },
    ],
  },
  {
    path: "/base/permit",
    component: Layout1,
    children: [
      {
        path: "",
        name: "按钮权限TreeList",
        component: () => import("@/views/base/permit/TreeList.vue"),
        props: (route) => route.query,
        meta: {
          name: "按钮权限",
        },
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
        meta: {
          name: "角色",
        },
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
        meta: {
          name: "租户",
        },
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
        meta: {
          name: "用户",
        },
      },
    ],
  },
  {
    path: "/eams/archive",
    component: Layout1,
    children: [
      {
        path: "",
        name: "全宗设置",
        component: () => import("@/views/eams/archive/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/eams/company",
    component: Layout1,
    children: [
      {
        path: "",
        name: "单位",
        component: () => import("@/views/eams/company/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
];
