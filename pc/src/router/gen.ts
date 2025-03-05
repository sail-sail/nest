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
    path: "/base/icon",
    component: Layout1,
    children: [
      {
        path: "",
        name: "图标库",
        component: () => import("@/views/base/icon/List.vue"),
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
    path: "/wshop/card",
    component: Layout1,
    children: [
      {
        path: "",
        name: "会员卡",
        component: () => import("@/views/wshop/card/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wshop/card_consume",
    component: Layout1,
    children: [
      {
        path: "",
        name: "会员卡消费记录",
        component: () => import("@/views/wshop/card_consume/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wshop/card_recharge",
    component: Layout1,
    children: [
      {
        path: "",
        name: "会员卡充值记录",
        component: () => import("@/views/wshop/card_recharge/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wshop/order",
    component: Layout1,
    children: [
      {
        path: "",
        name: "订单",
        component: () => import("@/views/wshop/order/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wshop/pt",
    component: Layout1,
    children: [
      {
        path: "",
        name: "产品",
        component: () => import("@/views/wshop/pt/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wshop/pt_type",
    component: Layout1,
    children: [
      {
        path: "",
        name: "产品类别",
        component: () => import("@/views/wshop/pt_type/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wshop/recharge_rule",
    component: Layout1,
    children: [
      {
        path: "",
        name: "充值赠送规则",
        component: () => import("@/views/wshop/recharge_rule/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wshop/wxapp_config",
    component: Layout1,
    children: [
      {
        path: "",
        name: "小程序配置",
        component: () => import("@/views/wshop/wxapp_config/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wx/pay_transactions_jsapi",
    component: Layout1,
    children: [
      {
        path: "",
        name: "微信JSAPI下单",
        component: () => import("@/views/wx/pay_transactions_jsapi/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wx/wx_app",
    component: Layout1,
    children: [
      {
        path: "",
        name: "小程序设置",
        component: () => import("@/views/wx/wx_app/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wx/wx_pay",
    component: Layout1,
    children: [
      {
        path: "",
        name: "微信支付设置",
        component: () => import("@/views/wx/wx_pay/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wx/wx_pay_notice",
    component: Layout1,
    children: [
      {
        path: "",
        name: "微信支付通知",
        component: () => import("@/views/wx/wx_pay_notice/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wx/wx_usr",
    component: Layout1,
    children: [
      {
        path: "",
        name: "小程序用户",
        component: () => import("@/views/wx/wx_usr/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wx/wxo_app",
    component: Layout1,
    children: [
      {
        path: "",
        name: "公众号设置",
        component: () => import("@/views/wx/wxo_app/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
  {
    path: "/wx/wxo_usr",
    component: Layout1,
    children: [
      {
        path: "",
        name: "公众号用户",
        component: () => import("@/views/wx/wxo_usr/List.vue"),
        props: (route) => route.query,
      },
    ],
  },
];
