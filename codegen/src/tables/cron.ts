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
    },
    columns: [
      {
        COLUMN_NAME: "code",
        width: 140,
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
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "code",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "lbl",
      },
      {
        COLUMN_NAME: "cron",
        width: 140,
      },
      {
        COLUMN_NAME: "timezone",
        width: 80,
      },
      {
        COLUMN_NAME: "job_id",
        width: 140,
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
        COLUMN_NAME: "exec_count",
        width: 100,
      },
      {
        COLUMN_NAME: "prev_time",
        width: 160,
      },
      {
        COLUMN_NAME: "next_time",
        width: 160,
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
