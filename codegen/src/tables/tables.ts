import { defineConfig } from "../config";

export default defineConfig({
  // 角色
  base_role: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        align: "left",
        width: 240,
        fixed: "left",
      },
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单",
        require: false,
        search: true,
        width: 80,
        foreignKey: {
          showType: "dialog",
        },
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
  // 租户
  base_tenant: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        align: "left",
        width: 140,
        fixed: "left",
      },
      {
        COLUMN_NAME: "domain_ids",
        COLUMN_COMMENT: "所属域名",
        require: true,
        align: "left",
        width: 280,
      },
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单权限",
        search: true,
        width: 80,
        foreignKey: {
          showType: "dialog",
          selectType: "tree",
        },
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
  // 域名
  base_domain: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        align: "left",
        width: 280,
        fixed: "left",
      },
      {
        COLUMN_NAME: "is_default",
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
  // 用户
  base_usr: {
    opts: {
      cache: true,
      ignoreCodegen: false,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "img",
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        sortable: true,
        align: "left",
        width: 140,
        fixed: "left",
      },
      {
        COLUMN_NAME: "username",
        require: true,
        search: true,
        sortable: true,
        width: 140,
        align: "left",
      },
      {
        COLUMN_NAME: "password",
        noList: true,
        isPassword: true,
      },
      {
        COLUMN_NAME: "default_org_id",
        width: 140,
        require: true,
        foreignKey: {
          table: "org",
          column: "id",
          lbl: "lbl",
          multiple: false,
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
        },
        align: "left",
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
      },
      {
        COLUMN_NAME: "org_ids",
        COLUMN_COMMENT: "拥有组织",
        require: false,
        search: true,
        width: 280,
        align: "left",
        foreignKey: {
          mod: "base",
          table: "org",
          column: "id",
          lbl: "lbl",
          multiple: true,
          type: "many2many",
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
          selectType: "select",
        },
      },
      {
        COLUMN_NAME: "role_ids",
        COLUMN_COMMENT: "拥有角色",
        require: false,
        search: true,
        width: 280,
        align: "left",
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  // 菜单
  base_menu: {
    opts: {
      cache: true,
      unique: [ "parent_id", "lbl" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      list_tree: true,
    },
    columns: [
      {
        COLUMN_NAME: "type",
        search: true,
        width: 80,
        fixed: "left",
      },
      {
        COLUMN_NAME: "parent_id",
        require: false,
        search: true,
        sortable: true,
        width: 140,
        foreignKey: {
          table: "menu",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "tree",
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
        },
        align: "left",
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        width: 160,
        require: true,
        search: true,
        align: "left",
        fixed: "left",
      },
      {
        COLUMN_NAME: "route_path",
        align: "left",
        width: 200,
      },
      {
        COLUMN_NAME: "route_query",
        align: "left",
        width: 160,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "tenant_ids",
        COLUMN_COMMENT: "所在租户",
        width: 180,
        align: "left",
        many2many: {
          mod: "base",
          table: "tenant_menu",
        },
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
    ]
  },
  base_background_task: {
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
        width: 140,
        align: "left",
        fixed: "left",
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
        align: "left",
        width: 140,
      },
      {
        COLUMN_NAME: "err_msg",
        align: "left",
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
    ]
  },
  // 语言
  base_lang: {
    opts: {
      cache: true,
      unique: [ "code" ],
    },
    columns: [
      {
        COLUMN_NAME: "code",
        require: true,
        search: true,
        width: 140,
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 140,
        align: "left",
        fixed: "left",
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
  // 国际化
  base_i18n: {
    opts: {
      cache: true,
      unique: [ "lang_id", "menu_id", "code" ],
    },
    columns: [
      {
        COLUMN_NAME: "lang_id",
        require: true,
        search: true,
        width: 120,
      },
      {
        COLUMN_NAME: "menu_id",
        search: true,
        align: "left",
        width: 160,
      },
      {
        COLUMN_NAME: "code",
        require: true,
        search: true,
        align: "left",
        width: 300,
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        align: "left",
        width: 300,
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
  // 权限
  base_permit: {
    opts: {
      cache: true,
      unique: [ "role_id", "menu_id", "code" ],
    },
    columns: [
      {
        COLUMN_NAME: "role_id",
        require: true,
        search: true,
        width: 160,
        align: "left",
      },
      {
        COLUMN_NAME: "menu_id",
        require: true,
        search: true,
        width: 160,
        align: "left",
        foreignKey: {
          mod: "base",
          table: "menu",
          selectType: "selectInput",
        },
      },
      {
        COLUMN_NAME: "code",
        require: true,
        search: true,
        width: 160,
        align: "left",
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 160,
        align: "left",
      },
      {
        COLUMN_NAME: "is_visible",
        require: true,
        width: 60,
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
  // 系统选项
  base_options: {
    opts: {
      cache: true,
      unique: [ "ky" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        search: true,
        width: 140,
        align: "left",
        fixed: "left",
      },
      {
        COLUMN_NAME: "ky",
        require: true,
        search: true,
        width: 140,
        align: "left",
      },
      {
        COLUMN_NAME: "val",
        search: true,
        width: 140,
        align: "left",
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
        COLUMN_NAME: "version",
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
  // 操作记录
  base_operation_record: {
    opts: {
      noAdd: true,
      noEdit: true,
      noImport: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "module",
        width: 120,
      },
      {
        COLUMN_NAME: "module_lbl",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "method",
        width: 120,
      },
      {
        COLUMN_NAME: "method_lbl",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "lbl",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "old_data",
        align: "left",
        width: 280,
      },
      {
        COLUMN_NAME: "new_data",
        align: "left",
        width: 280,
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "create_usr_id",
      },
      {
        COLUMN_NAME: "create_time",
        search: true,
      },
      {
        COLUMN_NAME: "update_usr_id",
      },
      {
        COLUMN_NAME: "update_time",
      },
    ],
  },
  // 组织
  base_org: {
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
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 180,
        align: "left",
        fixed: "left",
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
  // 部门
  base_dept: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      list_tree: true,
    },
    columns: [
      {
        COLUMN_NAME: "parent_id",
        foreignKey: {
          mod: "base",
          table: "dept",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "tree",
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
        },
        width: 140,
        align: "left",
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 180,
        align: "left",
        fixed: "left",
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
  // 系统字典
  base_dict: {
    opts: {
      cache: true,
      unique: [ "code" ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      sys_fields: [
        "code",
        "type",
        "is_enabled",
      ],
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
            mod: "base",
            table: "dict_detail",
            label: "系统字典",
            column: "dict_id",
          },
        ],
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        align: "left",
        require: true,
        search: true,
        width: 240,
        fixed: "left",
      },
      {
        COLUMN_NAME: "type",
        require: true,
        width: 100,
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
  // 系统字典明细
  base_dict_detail: {
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
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        align: "left",
        require: true,
        search: true,
        width: 240,
        fixed: "left",
      },
      {
        COLUMN_NAME: "val",
        align: "left",
        require: true,
        search: true,
        width: 240,
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "order_by",
        sortable: true,
        width: 100,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  // 业务字典
  base_dictbiz: {
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
            mod: "base",
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
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "is_enabled",
        width: 60,
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "order_by",
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
  // 业务字典明细
  base_dictbiz_detail: {
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
    ],
  },
});
