import { defineConfig } from "../config";

export default defineConfig({
  // 微信小程序
  wx_wx_app: {
    opts: {
      cache: true,
      uniques: [
        [ "appid" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "appid",
        require: true,
        search: true,
        width: 160,
      },
      {
        COLUMN_NAME: "appsecret",
        require: true,
        search: true,
        width: 260,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
      },
      {
        COLUMN_NAME: "order_by",
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "create_usr_id",
      },
      {
        COLUMN_NAME: "create_time",
      },
      {
        COLUMN_NAME: "update_usr_id",
      },
      {
        COLUMN_NAME: "update_time",
      },
    ],
  },
  // 小程序接口凭据
  wx_wx_app_token: {
    opts: {
      cache: true,
      uniques: [
        [ "wx_app_id" ],
      ],
      onlyCodegenDeno: true,
    },
    columns: [
      {
        COLUMN_NAME: "wx_app_id",
      },
      {
        COLUMN_NAME: "access_token",
      },
      {
        COLUMN_NAME: "token_time",
      },
      {
        COLUMN_NAME: "expires_in",
      },
    ],
  },
  // 微信支付
  wx_wx_pay: {
    opts: {
      cache: true,
      uniques: [
        [ "appid" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "appid",
        require: true,
        search: true,
        width: 160,
      },
      {
        COLUMN_NAME: "mchid",
        width: 140,
      },
      {
        COLUMN_NAME: "publicKey",
        isAtt: true,
        width: 80,
      },
      {
        COLUMN_NAME: "privateKey",
        isAtt: true,
        width: 80,
      },
      {
        COLUMN_NAME: "key",
        align: "left",
        width: 180,
      },
      {
        COLUMN_NAME: "payer_client_ip",
        align: "left",
        width: 180,
      },
      {
        COLUMN_NAME: "notify_url",
        align: "left",
        width: 200,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
      },
      {
        COLUMN_NAME: "order_by",
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "create_usr_id",
      },
      {
        COLUMN_NAME: "create_time",
      },
      {
        COLUMN_NAME: "update_usr_id",
      },
      {
        COLUMN_NAME: "update_time",
      },
    ],
  },
  // 微信JSAPI下单
  wx_pay_transactions_jsapi: {
    opts: {
      noAdd: true,
      noEdit: true,
      noDelete: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "appid",
        align: "left",
        width: 160,
      },
      {
        COLUMN_NAME: "mchid",
        width: 140,
      },
      {
        COLUMN_NAME: "description",
        align: "left",
        width: 200,
      },
      {
        COLUMN_NAME: "out_trade_no",
        width: 260,
      },
      {
        COLUMN_NAME: "transaction_id",
        search: true,
        width: 240,
        notForeignKeyById: true,
      },
      {
        COLUMN_NAME: "trade_state",
        width: 120,
      },
      {
        COLUMN_NAME: "trade_state_desc",
        width: 160,
      },
      {
        COLUMN_NAME: "success_time",
        width: 150,
      },
      {
        COLUMN_NAME: "time_expire",
        width: 150,
      },
      {
        COLUMN_NAME: "attach",
        align: "left",
        width: 150,
      },
      {
        COLUMN_NAME: "attach2",
        align: "left",
        width: 120,
      },
      {
        COLUMN_NAME: "notify_url",
        align: "left",
        width: 200,
      },
      {
        COLUMN_NAME: "support_fapiao",
        width: 140,
      },
      {
        COLUMN_NAME: "total_fee",
        align: "right",
        width: 120,
      },
      {
        COLUMN_NAME: "currency",
        width: 100,
      },
      {
        COLUMN_NAME: "openid",
        align: "left",
        width: 240,
      },
      {
        COLUMN_NAME: "prepay_id",
        align: "left",
        width: 180,
        notForeignKeyById: true,
      },
      {
        COLUMN_NAME: "create_usr_id",
      },
      {
        COLUMN_NAME: "create_time",
      },
      {
        COLUMN_NAME: "update_usr_id",
      },
      {
        COLUMN_NAME: "update_time",
      },
    ],
  },
  // 微信支付结果通知
  wx_wx_pay_notice: {
    opts: {
      noAdd: true,
      noEdit: true,
      noDelete: true,
      defaultSort: {
        prop: "transaction_id",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "appid",
        width: 160,
      },
      {
        COLUMN_NAME: "mchid",
        width: 140,
      },
      {
        COLUMN_NAME: "openid",
        search: true,
        width: 240,
      },
      {
        COLUMN_NAME: "out_trade_no",
        width: 140,
      },
      {
        COLUMN_NAME: "transaction_id",
        search: true,
        width: 140,
        notForeignKeyById: true,
      },
      {
        COLUMN_NAME: "trade_type",
        width: 120,
      },
      {
        COLUMN_NAME: "trade_state",
        width: 120,
      },
      {
        COLUMN_NAME: "trade_state_desc",
        width: 160,
      },
      {
        COLUMN_NAME: "bank_type",
        width: 120,
      },
      {
        COLUMN_NAME: "attach",
        width: 120,
      },
      {
        COLUMN_NAME: "success_time",
        width: 150,
      },
      {
        COLUMN_NAME: "total",
        width: 80,
      },
      {
        COLUMN_NAME: "payer_total",
        width: 140,
      },
      {
        COLUMN_NAME: "currency",
        width: 120,
      },
      {
        COLUMN_NAME: "payer_currency",
        width: 140,
      },
      {
        COLUMN_NAME: "device_id",
        width: 140,
        notForeignKeyById: true,
      },
      {
        COLUMN_NAME: "rem",
        width: 100,
      },
      {
        COLUMN_NAME: "raw",
        width: 140,
      },
      {
        COLUMN_NAME: "create_usr_id",
      },
      {
        COLUMN_NAME: "create_time",
      },
      {
        COLUMN_NAME: "update_usr_id",
      },
      {
        COLUMN_NAME: "update_time",
      },
    ],
  },
});