import { defineConfig } from "../../config.ts";

export default defineConfig({
  
  // 时序数据库
  tsdb_tsdb_app: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "type",
        width: 150,
      },
      {
        COLUMN_NAME: "protocol",
        width: 100,
      },
      {
        COLUMN_NAME: "hostname",
        require: true,
        search: true,
        width: 220,
      },
      {
        COLUMN_NAME: "port",
        width: 100,
      },
      {
        COLUMN_NAME: "database",
        require: true,
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "token",
        require: true,
        noList: true,
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
  
});