import { defineConfig } from "../../config";

export default defineConfig({
  // 单位
  eams_company: {
    opts: {
      cache: true,
      uniques: [
        [ "code" ],
        [ "lbl" ],
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
  // 全宗设置
  eams_archive: {
    opts: {
      cache: true,
      uniques: [
        [ "code" ],
        [ "lbl" ],
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
      },
      {
        COLUMN_NAME: "company_id",
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
});