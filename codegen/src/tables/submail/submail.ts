import { defineConfig } from "../../config";

export default defineConfig({
  // 短信设置
  submail_sms_app: {
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
        align: "center",
      },
      {
        COLUMN_NAME: "appid",
        align: "center",
        width: 120,
      },
      {
        COLUMN_NAME: "appkey",
        width: 280,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
      },
      {
        COLUMN_NAME: "is_paused",
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
  // 短信发送记录
  submail_sms_send_record: {
    opts: {
      noEdit: true,
      noAdd: true,
      noImport: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "sms_app_id",
        modelLabel: "sms_app_id_lbl",
      },
      {
        COLUMN_NAME: "send_to",
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "content",
        width: 320,
        align: "left",
      },
      {
        COLUMN_NAME: "status",
        width: 100,
        modelLabel: "status_lbl",
      },
      {
        COLUMN_NAME: "send_time",
      },
      {
        COLUMN_NAME: "tag",
        width: 100,
        align: "center",
      },
      {
        COLUMN_NAME: "msg",
        width: 200,
        align: "left",
      },
      {
        COLUMN_NAME: "create_usr_id",
      },
      {
        COLUMN_NAME: "create_time",
        search: true,
      },
    ],
  },
});
