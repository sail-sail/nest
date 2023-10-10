import { defineConfig } from "../config";

export default defineConfig({
  // 工资条
  hrm_payslip: {
    opts: {
      uniques: [
        [ "pay_month", "lbl" ],
      ],
      defaultSort: {
        prop: "pay_month",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "pay_month",
        require: true,
        search: true,
        sortable: true,
        width: 120,
        fixed: "left",
        isMonth: true,
        COLUMN_DEFAULT: "start_of_month",
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        width: 140,
        align: "center",
        fixed: "left",
      },
      {
        COLUMN_NAME: "job_num",
        width: 120,
      },
      {
        COLUMN_NAME: "company",
        align: "left",
        width: 280,
      },
      {
        COLUMN_NAME: "gross_pay",
        width: 100,
        align: "right",
        isEncrypt: true,
      },
      {
        COLUMN_NAME: "social_security",
        width: 100,
        align: "right",
        isEncrypt: true,
      },
      {
        COLUMN_NAME: "individual_tax",
        width: 100,
        align: "right",
        isEncrypt: true,
      },
      {
        COLUMN_NAME: "self_pay",
        width: 100,
        align: "right",
        isEncrypt: true,
      },
      {
        COLUMN_NAME: "net_pay",
        width: 100,
        align: "right",
        isEncrypt: true,
      },
      {
        COLUMN_NAME: "is_send",
        search: true,
        isSwitch: false,
      },
      {
        COLUMN_NAME: "is_confirm",
        search: true,
        isSwitch: false,
      },
      {
        COLUMN_NAME: "is_locked",
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