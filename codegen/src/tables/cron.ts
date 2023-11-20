import { defineConfig } from "../config";

export default defineConfig({
  // 任务
  cron_job: {
    opts: {
      cache: true,
      uniques: [
        [ "code" ],
        [ "lbl" ],
      ],
      sys_fields: [
        "code",
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
  // 定时任务
  cron_cron_job: {
    opts: {
      cache: true,
      uniques: [
        [ "job_id", "cron" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "job_id",
        width: 140,
        require: true,
        search: true,
        foreignTabs: [
          {
            mod: "cron",
            table: "cron_job_log",
            label: "任务执行日志",
            column: "job_id",
          },
        ],
      },
      {
        COLUMN_NAME: "cron",
        width: 140,
        require: true,
      },
      {
        COLUMN_NAME: "timezone",
        width: 80,
        require: true,
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
  // 任务执行日志
  cron_cron_job_log: {
    opts: {
      noAdd: true,
      noEdit: true,
    },
    columns: [
      {
        COLUMN_NAME: "cron_job_id",
        width: 140,
        foreignKey: {
          showType: "dialog",
        },
      },
      {
        COLUMN_NAME: "exec_state",
        width: 100,
      },
      {
        COLUMN_NAME: "exec_result",
        width: 220,
      },
      {
        COLUMN_NAME: "begin_time",
        width: 160,
      },
      {
        COLUMN_NAME: "end_time",
        width: 160,
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "create_time",
      },
    ],
  },
});
