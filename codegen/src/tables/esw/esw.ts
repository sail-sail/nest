import { defineConfig } from "../../config";

export default defineConfig({
  // 会员卡
  esw_card: {
    opts: {
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "seq_lbl",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "lbl",
        align: "center",
        width: 140,
        readonly: true,
        readonlyPlaceholder: "(自动生成)",
      },
      {
        COLUMN_NAME: "usr_id",
        width: 180,
      },
      {
        COLUMN_NAME: "grade",
        width: 100,
      },
      {
        COLUMN_NAME: "name",
        width: 120,
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "mobile",
        width: 120,
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "balance",
        width: 100,
      },
      {
        COLUMN_NAME: "give_balance",
        width: 100,
      },
      {
        COLUMN_NAME: "integral",
        width: 100,
        sortable: true,
      },
      {
        COLUMN_NAME: "growth_amt",
        width: 100,
        readonly: true,
        sortable: true,
      },
      {
        COLUMN_NAME: "is_default",
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
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
  // 会员卡充值记录
  esw_card_recharge: {
    opts: {
      noAdd: true,
      noEdit: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "transaction_id",
        notForeignKeyById: true,
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "card_id",
        width: 180,
        fixed: "left",
      },
      {
        COLUMN_NAME: "usr_id",
        width: 180,
        fixed: "left",
      },
      {
        COLUMN_NAME: "amt",
        width: 100,
      },
      {
        COLUMN_NAME: "give_amt",
        width: 100,
      },
      {
        COLUMN_NAME: "balance",
        width: 120,
      },
      {
        COLUMN_NAME: "give_balance",
        width: 120,
      },
      {
        COLUMN_NAME: "integral",
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
  // 充值赠送规则
  esw_recharge_rule: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
      },
      {
        COLUMN_NAME: "amt",
        require: true,
        width: 120,
      },
      {
        COLUMN_NAME: "give_amt",
        require: true,
        width: 120,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
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
  // 会员卡消费记录
  esw_card_consume: {
    opts: {
      noAdd: true,
      noEdit: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "transaction_id",
        notForeignKeyById: true,
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "card_id",
        width: 180,
        fixed: "left",
      },
      {
        COLUMN_NAME: "usr_id",
        width: 180,
        fixed: "left",
      },
      {
        COLUMN_NAME: "amt",
        width: 100,
      },
      {
        COLUMN_NAME: "give_amt",
        width: 100,
      },
      {
        COLUMN_NAME: "balance",
        width: 100,
      },
      {
        COLUMN_NAME: "give_balance",
        width: 120,
      },
      {
        COLUMN_NAME: "integral",
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
  // 产品类别
  esw_pt_type: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "img",
        align: "center",
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        align: "center",
      },
      {
        COLUMN_NAME: "is_home",
        width: 80,
      },
      {
        COLUMN_NAME: "is_recommend",
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
  // 产品
  esw_pt: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "img",
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
      },
      {
        COLUMN_NAME: "pt_type_ids",
        COLUMN_COMMENT: "产品类别",
        width: 160,
      },
      {
        COLUMN_NAME: "price",
      },
      {
        COLUMN_NAME: "original_price",
      },
      {
        COLUMN_NAME: "is_new",
      },
      {
        COLUMN_NAME: "introduct",
        align: "left",
        width: 280,
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
        COLUMN_NAME: "detail",
        align: "left",
        width: 180,
        isTextarea: true,
      },
      {
        COLUMN_NAME: "detail_top_img",
      },
      {
        COLUMN_NAME: "detail_bottom_img",
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
  // 订单
  esw_order: {
    opts: {
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "seq_lbl",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "lbl",
        align: "center",
        width: 140,
        readonly: true,
        readonlyPlaceholder: "(自动生成)",
      },
      {
        COLUMN_NAME: "status",
        width: 120,
        require: true,
      },
      {
        COLUMN_NAME: "usr_id",
        width: 180,
        require: true,
      },
      {
        COLUMN_NAME: "card_id",
        width: 180,
        require: true,
        foreignKey: {
          selectType: "selectInput",
        },
      },
      {
        COLUMN_NAME: "price",
        width: 120,
        require: true,
      },
      {
        COLUMN_NAME: "type",
        width: 120,
        require: true,
      },
      {
        COLUMN_NAME: "amt",
        width: 100,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "give_amt",
        width: 100,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "balance",
        width: 120,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "give_balance",
        width: 120,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "integral",
        width: 100,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
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
  // 小程序配置
  esw_wxapp_config: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
      sys_fields: [
        "lbl",
      ],
    },
    columns: [
      {
        COLUMN_NAME: "img",
        fixed: "left",
        width: 200,
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
