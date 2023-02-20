import { defineConfig } from "../config";

export default defineConfig({
  // 角色
  role: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 140,
      },
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单",
        ORDINAL_POSITION: 5,
        require: false,
        search: true,
        minWidth: 50,
        foreignKey: {
          showType: "dialog",
        },
      },
      {
        COLUMN_NAME: "rem",
        width: 180,
      },
      {
        COLUMN_NAME: "is_enabled",
        require: true,
        width: 80,
      },
    ],
  },
  // 租户
  tenant: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 140,
      },
      {
        COLUMN_NAME: "host",
        require: true,
        width: 280,
      },
      {
        COLUMN_NAME: "expiration",
        width: 140,
      },
      {
        COLUMN_NAME: "max_usr_num",
        width: 100,
      },
      {
        COLUMN_NAME: "order_by",
        width: 100,
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单",
        ORDINAL_POSITION: 6,
        require: false,
        search: true,
        minWidth: 50,
        foreignKey: {
          showType: "dialog",
        },
      },
      {
        COLUMN_NAME: "rem",
        width: 180,
      },
    ],
  },
  // 用户
  usr: {
    opts: {
      cache: true,
      ignoreCodegen: false,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        sortable: true,
        width: 140,
      },
      {
        COLUMN_NAME: "username",
        require: true,
        search: true,
        sortable: true,
        width: 140,
      },
      {
        COLUMN_NAME: "password",
        noList: true,
        isPassword: true,
      },
      {
        COLUMN_NAME: "default_dept_id",
        width: 140,
        foreignKey: {
          table: "dept",
          column: "id",
          lbl: "lbl",
          multiple: false,
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
        },
      },
      {
        COLUMN_NAME: "is_locked",
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "is_enabled",
        require: true,
        width: 80,
      },
      {
        COLUMN_NAME: "dept_ids",
        COLUMN_COMMENT: "拥有部门",
        ORDINAL_POSITION: 7,
        require: false,
        search: true,
        width: 140,
      },
      {
        COLUMN_NAME: "role_ids",
        COLUMN_COMMENT: "拥有角色",
        ORDINAL_POSITION: 8,
        require: false,
        search: true,
        width: 140,
      },
      {
        COLUMN_NAME: "rem",
        width: 140,
      },
    ],
  },
  // 菜单
  menu: {
    opts: {
      cache: true,
      unique: [ "menu_id", "lbl" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "type",
        search: true,
        width: 100,
      },
      {
        COLUMN_NAME: "menu_id",
        require: false,
        search: true,
        sortable: true,
        width: 140,
        foreignKey: {
          table: "menu",
          column: "id",
          lbl: "lbl",
          multiple: false,
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
        },
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        align: "left",
        width: 140,
      },
      {
        COLUMN_NAME: "route_path",
        align: "left",
      },
      {
        COLUMN_NAME: "route_query",
        align: "left",
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "order_by",
        width: 100,
      },
      {
        COLUMN_NAME: "rem",
        width: 180,
      },
    ]
  },
  // permit: {
  //   opts: {
  //     cache: true,
  //     unique: [ "menu_id", "lbl" ],
  //   },
  // },
  background_task: {
    opts: {
      noAdd: true,
      noEdit: true,
      noImport: true,
      noExport: true,
      filterDataByCreateUsr: true,
      defaultSort: {
        prop: "begin_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "state",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "type",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "result",
        width: 140,
      },
      {
        COLUMN_NAME: "err_msg",
        width: 160,
      },
      {
        COLUMN_NAME: "begin_time",
        search: true,
        sortable: true,
        width: 180,
      },
      {
        COLUMN_NAME: "end_time",
        sortable: true,
        width: 180,
      },
      {
        COLUMN_NAME: "create_usr_id",
        ignoreCodegen: false,
        onlyCodegenDeno: true,
        foreignKey: {
          table: "usr",
        },
      },
      {
        COLUMN_NAME: "rem",
        width: 180,
      },
    ]
  },
  // 选项
  option: {
    opts: {
      cache: true,
      unique: [ "ky" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        search: true,
      },
      {
        COLUMN_NAME: "ky",
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "val",
        search: true,
      },
      {
        COLUMN_NAME: "is_enabled",
        require: true,
        width: 60,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  // 操作记录
  operation_record: {
    opts: {
      noAdd: true,
      noEdit: true,
      noImport: true,
    },
    columns: [
      {
        COLUMN_NAME: "mod",
        noList: true,
      },
      {
        COLUMN_NAME: "mod_lbl",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "method",
        noList: true,
      },
      {
        COLUMN_NAME: "method_lbl",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "lbl",
        search: true,
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "create_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "create_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
      {
        COLUMN_NAME: "update_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "update_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
    ],
  },
  // 部门
  dept: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "parent_id",
        foreignKey: {
          table: "dept",
          column: "id",
          lbl: "lbl",
        },
        width: 120,
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 180,
        fixed: "left",
      },
      {
        COLUMN_NAME: "order_by",
        sortable: true,
        width: 100,
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "is_locked",
        noAdd: true,
        noEdit: true,
        width: 100,
      },
      {
        COLUMN_NAME: "create_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "create_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
      {
        COLUMN_NAME: "update_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "update_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
    ],
  },
  // 系统字典
  dict: {
    opts: {
      cache: true,
      unique: [ "code" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "code",
        align: "left",
        require: true,
        search: true,
        width: 240,
        foreignTabs: [
          {
            table: "dict_detail",
            label: "系统字典",
            column: "dict_id",
          },
        ],
      },
      {
        COLUMN_NAME: "lbl",
        align: "left",
        require: true,
        search: true,
        width: 240,
      },
      {
        COLUMN_NAME: "type",
        require: true,
        width: 100,
      },
      {
        COLUMN_NAME: "order_by",
        sortable: true,
        width: 100,
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "rem",
        width: 120,
      },
      {
        COLUMN_NAME: "is_locked",
        noAdd: true,
        noEdit: true,
        width: 100,
      },
      {
        COLUMN_NAME: "create_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "create_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
      {
        COLUMN_NAME: "update_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "update_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
    ],
  },
  // 系统字典明细
  dict_detail: {
    opts: {
      cache: true,
      unique: [ "dict_id", "lbl" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "dict_id",
        align: "left",
        require: true,
        search: true,
        width: 240,
      },
      {
        COLUMN_NAME: "lbl",
        align: "left",
        require: true,
        search: true,
        width: 240,
      },
      {
        COLUMN_NAME: "val",
        align: "left",
        require: true,
        search: true,
        width: 240,
      },
      {
        COLUMN_NAME: "order_by",
        sortable: true,
        width: 100,
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "rem",
        width: 120,
      },
      {
        COLUMN_NAME: "is_locked",
        noAdd: true,
        noEdit: true,
        width: 100,
      },
    ],
  },
  // 业务字典
  dictbiz: {
    opts: {
      cache: true,
      unique: [ "code" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "code",
        align: "left",
        require: true,
        search: true,
        width: 240,
        foreignTabs: [
          {
            table: "dictbiz_detail",
            label: "业务字典",
            column: "dictbiz_id",
          },
        ],
      },
      {
        COLUMN_NAME: "lbl",
        align: "left",
        require: true,
        search: true,
        width: 240,
      },
      {
        COLUMN_NAME: "type",
        require: true,
        width: 100,
      },
      {
        COLUMN_NAME: "order_by",
        sortable: true,
        width: 100,
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "is_locked",
        noAdd: true,
        noEdit: true,
        width: 100,
      },
      {
        COLUMN_NAME: "create_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "create_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
      {
        COLUMN_NAME: "update_usr_id",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        foreignKey: {
          table: "usr",
          column: "id",
          lbl: "lbl",
        },
        width: 100,
      },
      {
        COLUMN_NAME: "update_time",
        ignoreCodegen: false,
        noAdd: true,
        noEdit: true,
        width: 140,
      },
    ],
  },
  // 业务字典明细
  dictbiz_detail: {
    opts: {
      cache: true,
      unique: [ "dictbiz_id", "lbl" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "dictbiz_id",
        align: "left",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "lbl",
        align: "left",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "val",
        align: "left",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "order_by",
        sortable: true,
        width: 100,
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "is_locked",
        noAdd: true,
        noEdit: true,
        width: 100,
      },
    ],
  },
});
