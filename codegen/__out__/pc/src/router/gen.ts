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
    path: "/base/data_permit",
    component: Layout1,
    children: [
      {
        path: "",
        name: "数据权限",
        component: () => import("@/views/base/data_permit/TreeList.vue"),
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
    path: "/base/domain",
    component: Layout1,
    children: [
      {
        path: "",
        name: "域名",
        component: () => import("@/views/base/domain/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/base/field_permit",
    component: Layout1,
    children: [
      {
        path: "",
        name: "字段权限",
        component: () => import("@/views/base/field_permit/TreeList.vue"),
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
        component: () => import("@/views/base/i18n/TreeList.vue"),
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
    path: "/base/login_log",
    component: Layout1,
    children: [
      {
        path: "",
        name: "登录日志",
        component: () => import("@/views/base/login_log/List.vue"),
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
    path: "/base/optbiz",
    component: Layout1,
    children: [
      {
        path: "",
        name: "业务选项",
        component: () => import("@/views/base/optbiz/List.vue"),
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
    path: "/base/org",
    component: Layout1,
    children: [
      {
        path: "",
        name: "组织",
        component: () => import("@/views/base/org/List.vue"),
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
        name: "按钮权限",
        component: () => import("@/views/base/permit/TreeList.vue"),
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
  {
    path: "/submail/sms_app",
    component: Layout1,
    children: [
      {
        path: "",
        name: "短信应用",
        component: () => import("@/views/submail/sms_app/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/submail/sms_send_record",
    component: Layout1,
    children: [
      {
        path: "",
        name: "短信发送记录",
        component: () => import("@/views/submail/sms_send_record/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
];
