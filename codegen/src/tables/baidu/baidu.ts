import { defineConfig } from "../../config.ts";

export default defineConfig({
  // 百度应用
  baidu_baidu_app: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
        [ "appid" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
      },
      {
        COLUMN_NAME: "appid",
        width: 120,
        require: true,
      },
      {
        COLUMN_NAME: "api_key",
        width: 120,
        require: true,
      },
      {
        COLUMN_NAME: "secret_key",
        width: 120,
        require: true,
      },
      {
        COLUMN_NAME: "aes_key",
        width: 120,
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
  // 百度接口凭据
  baidu_baidu_app_token: {
    opts: {
      cache: true,
      uniques: [
        [ "baidu_app_id" ],
      ],
      onlyCodegenDeno: true,
    },
    columns: [
      {
        COLUMN_NAME: "baidu_app_id",
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
});
