import { defineConfig } from "../../config";

export default defineConfig({
  // 小程序设置
  wx_wx_app: {
    opts: {
      cache: true,
      uniques: [
        [ "code" ],
        [ "lbl" ],
        [ "appid" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "code",
        width: 140,
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        align: "center",
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
        width: 260,
        align: "left",
        noList: true,
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
        COLUMN_NAME: "appid",
      },
      {
        COLUMN_NAME: "appsecret",
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
  // 小程序用户
  wx_wx_usr: {
    opts: {
      cache: true,
      uniques: [
        [ "openid" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        search: true,
        width: 280,
        fixed: "left",
      },
      {
        COLUMN_NAME: "usr_id",
        width: 240,
        modelLabel: "usr_id_lbl",
      },
      {
        COLUMN_NAME: "appid",
        require: true,
        search: true,
        width: 160,
      },
      {
        COLUMN_NAME: "nick_name",
        width: 140,
      },
      {
        COLUMN_NAME: "avatar_img",
        isPublicAtt: true,
      },
      {
        COLUMN_NAME: "mobile",
        width: 120,
      },
      {
        COLUMN_NAME: "openid",
        width: 240,
      },
      {
        COLUMN_NAME: "unionid",
        width: 180,
      },
      {
        COLUMN_NAME: "gender",
        width: 80,
      },
      {
        COLUMN_NAME: "city",
        width: 100,
      },
      {
        COLUMN_NAME: "province",
        width: 100,
      },
      {
        COLUMN_NAME: "country",
        width: 100,
      },
      {
        COLUMN_NAME: "language",
        width: 100,
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
  // 公众号设置
  wx_wxo_app: {
    opts: {
      cache: true,
      uniques: [
        [ "code" ],
        [ "lbl" ],
        [ "appid" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "code",
        align: "center",
        width: 140,
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
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
        width: 260,
        align: "left",
        noList: true,
      },
      {
        COLUMN_NAME: "token",
        width: 140,
        align: "left",
      },
      {
        COLUMN_NAME: "encoding_aes_key",
        width: 140,
        align: "left",
        noList: true,
      },
      {
        COLUMN_NAME: "encoding_type",
        width: 140,
      },
      {
        COLUMN_NAME: "scope",
        width: 140,
      },
      {
        COLUMN_NAME: "domain_id",
        width: 240,
        align: "left",
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
  // 公众号接口凭据
  wx_wxo_app_token: {
    opts: {
      cache: true,
      uniques: [
        [ "wxo_app_id" ],
      ],
      onlyCodegenDeno: true,
    },
    columns: [
      {
        COLUMN_NAME: "wxo_app_id",
      },
      {
        COLUMN_NAME: "appid",
      },
      {
        COLUMN_NAME: "appsecret",
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
  // 公众号用户
  wx_wxo_usr: {
    opts: {
      cache: true,
      uniques: [
        [ "openid" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        search: true,
        fixed: "left",
      },
      {
        COLUMN_NAME: "head_img",
        isPublicAtt: true,
      },
      {
        COLUMN_NAME: "usr_id",
        width: 240,
        modelLabel: "usr_id_lbl",
      },
      {
        COLUMN_NAME: "appid",
        require: true,
        search: true,
        width: 160,
      },
      {
        COLUMN_NAME: "openid",
        width: 240,
      },
      {
        COLUMN_NAME: "unionid",
        width: 180,
      },
      {
        COLUMN_NAME: "sex",
        width: 120,
        align: "center",
      },
      {
        COLUMN_NAME: "province",
        width: 120,
      },
      {
        COLUMN_NAME: "city",
        width: 120,
      },
      {
        COLUMN_NAME: "country",
        width: 120,
      },
      {
        COLUMN_NAME: "privilege",
        onlyCodegenDeno: true,
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
  // 微信支付设置
  wx_wx_pay: {
    opts: {
      cache: true,
      uniques: [
        [ "appid" ],
        [ "notify_url" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        align: "center",
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
        COLUMN_NAME: "serial_no",
        width: 140,
        noList: true,
      },
      {
        COLUMN_NAME: "public_key",
        isAtt: true,
        width: 80,
      },
      {
        COLUMN_NAME: "private_key",
        isAtt: true,
        width: 80,
      },
      {
        COLUMN_NAME: "v3_key",
        align: "left",
        width: 180,
        noList: true,
      },
      {
        COLUMN_NAME: "payer_client_ip",
        align: "center",
        width: 180,
      },
      {
        COLUMN_NAME: "notify_url",
        align: "left",
        width: 200,
        require: true,
        readonly: true,
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
      noRevert: true,
      noForceDelete: true,
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
        width: 200,
      },
      {
        COLUMN_NAME: "out_trade_no",
        width: 260,
      },
      {
        COLUMN_NAME: "transaction_id",
        search: true,
        width: 250,
        notForeignKeyById: true,
        foreignPage: {
          routeName: "微信支付通知",
          tabNameField: "transaction_id",
          query: {
            transaction_id: "transaction_id",
            showBuildIn: "1",
          },
        },
      },
      {
        COLUMN_NAME: "trade_state",
        width: 120,
        search: true,
      },
      {
        COLUMN_NAME: "trade_state_desc",
        width: 160,
      },
      {
        COLUMN_NAME: "success_time",
        width: 150,
        search: true,
        sortable: true,
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
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "notify_url",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "receipt",
        width: 100,
      },
      {
        COLUMN_NAME: "profit_sharing",
        width: 100,
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
        onlyCodegenDeno: true,
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
      noRevert: true,
      noForceDelete: true,
      defaultSort: {
        prop: "success_time",
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
        width: 260,
      },
      {
        COLUMN_NAME: "transaction_id",
        search: true,
        width: 250,
        notForeignKeyById: true,
        foreignPage: {
          routeName: "微信JSAPI下单",
          tabNameField: "transaction_id",
          query: {
            transaction_id: "transaction_id",
            showBuildIn: "1",
          },
        },
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
        search: true,
        sortable: true,
      },
      {
        COLUMN_NAME: "total",
        width: 90,
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
