import { defineConfig } from "../config";

export default defineConfig({
  // 企业微信应用
  wxwork_wxw_app: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
        [ "corpid", "agentid" ],
        [ "corpsecret" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        width: 300,
      },
      {
        COLUMN_NAME: "corpid",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "agentid",
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "corpsecret",
        width: 220,
        isEncrypt: true,
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
    ],
  },
  // 企业微信应用接口凭据
  wxwork_wxw_app_token: {
    opts: {
      cache: true,
      uniques: [
        [ "wxw_app_id" ],
        [ "access_token" ],
      ],
      onlyCodegenDeno: true,
    },
    columns: [
      {
        COLUMN_NAME: "wxw_app_id",
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
  // 企业微信用户
  wxwork_wxw_usr: {
    opts: {
      cache: true,
      uniques: [
        [ "wxw_app_id", "userid" ],
        [ "wxw_app_id", "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "wxw_app_id",
      },
      {
        COLUMN_NAME: "lbl",
      },
      {
        COLUMN_NAME: "userid",
      },
      {
        COLUMN_NAME: "mobile",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "gender",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "email",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "biz_email",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "direct_leader",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "position",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "avatar",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "thumb_avatar",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "qr_code",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
});
