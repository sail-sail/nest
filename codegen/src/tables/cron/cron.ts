import { defineConfig } from "../../config.ts";

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
        align: "center",
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        width: 320,
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
        COLUMN_NAME: "seq",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "lbl",
        width: 320,
        foreignTabs: [
          {
            mod: "cron",
            table: "cron_job_log",
            label: "任务执行日志",
            column: "cron_job_id",
          },
        ],
        foreignTabsDialogType: "default",
      },
      {
        COLUMN_NAME: "job_id",
        require: true,
        search: true,
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
  // 定时任务日志
  cron_cron_job_log: {
    opts: {
      noAdd: true,
      noEdit: true,
    },
    columns: [
      {
        COLUMN_NAME: "cron_job_id",
        foreignKey: {
          showType: "dialog",
        },
        search: true,
      },
      {
        COLUMN_NAME: "exec_state",
        width: 100,
        search: true,
        foreignTabs: [
          {
            mod: "cron",
            table: "cron_job_log_detail",
            label: "任务执行日志明细",
            column: "cron_job_log_id",
          },
        ],
        foreignTabsDialogType: "default",
      },
      {
        COLUMN_NAME: "exec_result",
        width: 280,
      },
      {
        COLUMN_NAME: "begin_time",
        width: 160,
        search: true,
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
  // 定时任务日志明细
  cron_cron_job_log_detail: {
    opts: {
      noAdd: true,
      noEdit: true,
    },
    columns: [
      {
        COLUMN_NAME: "cron_job_log_id",
        foreignKey: {
          showType: "dialog",
        },
      },
      {
        COLUMN_NAME: "lbl",
        minWidth: 420,
        search: true,
      },
      {
        COLUMN_NAME: "create_time",
        search: true,
      },
    ],
  },
});
