import { defineConfig } from "../../config";

export default defineConfig({
  // 角色
  base_role: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "code_seq",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "code",
        align: "center",
        width: 120,
        readonly: true,
        readonlyPlaceholder: "(自动生成)",
        autoCode: {
          prefix: "JS",
          seq: "code_seq",
          seqPadStart0: 3,
        },
      },
      {
        COLUMN_NAME: "lbl",
        align: "center",
      },
      {
        COLUMN_NAME: "home_url",
        width: 180,
      },
      {
        COLUMN_NAME: "menu_ids",
        require: false,
        COLUMN_COMMENT: "菜单权限",
        search: true,
        foreignKey: {
          showType: "dialog",
        },
      },
      {
        COLUMN_NAME: "permit_ids",
        require: false,
        COLUMN_COMMENT: "按钮权限",
        foreignKey: {
          showType: "dialog",
        },
      },
      {
        COLUMN_NAME: "data_permit_ids",
        require: false,
        COLUMN_COMMENT: "数据权限",
        foreignKey: {
          showType: "dialog",
          mod: "base",
          table: "data_permit",
          column: "id",
          multiple: true,
          notSetIdByLbl: true,
        },
      },
      {
        COLUMN_NAME: "field_permit_ids",
        require: false,
        COLUMN_COMMENT: "字段权限",
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
  // 租户
  base_tenant: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        fixed: "left",
      },
      {
        COLUMN_NAME: "domain_ids",
        COLUMN_COMMENT: "所属域名",
        require: true,
        align: "left",
        width: 280,
        foreignKey: {
          hasSelectAdd: true,
        },
      },
      {
        COLUMN_NAME: "menu_ids",
        require: false,
        COLUMN_COMMENT: "菜单权限",
        search: true,
        foreignKey: {
          showType: "dialog",
        },
      },
      {
        COLUMN_NAME: "title",
        width: 160,
      },
      {
        COLUMN_NAME: "info",
        width: 180,
        align: "left",
      },
      {
        COLUMN_NAME: "lang_id",
        align: "center",
        modelLabel: "lang_id_lbl",
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
      uniques: [
        [ "lbl" ],
      ],
    },
    columns: [
      {
        COLUMN_NAME: "protocol",
        width: 100,
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        width: 280,
        fixed: "left",
      },
      {
        COLUMN_NAME: "is_locked",
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
      uniques: [
        [ "lbl" ],
        [ "username" ],
      ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "img",
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        align: "center",
        fixed: "left",
      },
      {
        COLUMN_NAME: "username",
        align: "center",
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
        COLUMN_NAME: "role_ids",
        COLUMN_COMMENT: "所属角色",
        search: true,
        width: 280,
        align: "left",
      },
      {
        COLUMN_NAME: "dept_ids",
        COLUMN_COMMENT: "所属部门",
        search: true,
        width: 240,
        align: "left",
      },
      {
        COLUMN_NAME: "org_ids",
        require: false,
        COLUMN_COMMENT: "所属组织",
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
        COLUMN_NAME: "default_org_id",
        require: false,
        width: 240,
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
        COLUMN_NAME: "type",
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
  // 登录日志
  base_login_log: {
    opts: {
      noAdd: true,
      noEdit: true,
      noImport: true,
      noExport: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "type",
        align: "center",
        require: true,
        search: true,
        width: 100,
      },
      {
        COLUMN_NAME: "username",
        align: "center",
        require: true,
        search: true,
        width: 140,
      },
      {
        COLUMN_NAME: "is_succ",
        width: 100,
        search: true,
      },
      {
        COLUMN_NAME: "ip",
        width: 140,
        search: true,
      },
      {
        COLUMN_NAME: "create_time",
        COLUMN_COMMENT: "登录时间",
        search: true,
      },
    ],
  },
  // 菜单
  base_menu: {
    opts: {
      cache: true,
      uniques: [
        [ "parent_id", "lbl" ],
      ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      list_tree: true,
    },
    columns: [
      {
        COLUMN_NAME: "parent_id",
        require: false,
        search: true,
        sortable: true,
        foreignKey: {
          table: "menu",
          column: "id",
          lbl: "lbl",
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
        },
        fixed: "left",
      },
      {
        COLUMN_NAME: "lbl",
        width: 180,
        require: true,
        search: true,
        align: "left",
        fixed: "left",
      },
      {
        COLUMN_NAME: "route_path",
        align: "left",
        width: 240,
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
      uniques: [
        [ "code" ],
        [ "lbl" ],
      ],
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
      uniques: [
        [ "lang_id", "menu_id", "code" ],
      ],
      list_tree: "menu_id",
    },
    columns: [
      {
        COLUMN_NAME: "lang_id",
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "menu_id",
        search: true,
        require: false,
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
  // 按钮权限
  base_permit: {
    opts: {
      cache: true,
      uniques: [
        [ "menu_id", "code" ],
      ],
      sys_fields: [
        "menu_id",
        "code",
      ],
      list_tree: "menu_id",
      noAdd: true,
      noDelete: true,
      noExport: true,
      noForceDelete: true,
    },
    columns: [
      {
        COLUMN_NAME: "menu_id",
        require: true,
        search: true,
        foreignKey: {
          mod: "base",
          table: "menu",
        },
        readonly: true,
      },
      {
        COLUMN_NAME: "code",
        require: true,
        search: true,
        width: 160,
        align: "left",
        fixed: false,
        readonly: true,
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 160,
        align: "left",
        fixed: false,
      },
      {
        COLUMN_NAME: "order_by",
        readonly: true,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  // 数据权限
  base_data_permit: {
    opts: {
      cache: true,
      uniques: [
        [ "menu_id", "scope" ],
      ],
      sys_fields: [
        "menu_id",
        "scope",
      ],
      list_tree: "menu_id",
    },
    columns: [
      {
        COLUMN_NAME: "menu_id",
        require: true,
        search: true,
        foreignKey: {
          mod: "base",
          table: "menu",
        },
      },
      {
        COLUMN_NAME: "scope",
        require: true,
        search: true,
        width: 140,
        align: "center",
      },
      {
        COLUMN_NAME: "type",
        require: true,
        width: 140,
        align: "center",
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
  // 字段权限
  base_field_permit: {
    opts: {
      cache: true,
      uniques: [
        [ "menu_id", "code" ],
      ],
      sys_fields: [
        "menu_id",
        "code",
      ],
      list_tree: "menu_id",
      noAdd: true,
      noDelete: true,
      noExport: true,
      noForceDelete: true,
    },
    columns: [
      {
        COLUMN_NAME: "menu_id",
        require: true,
        search: true,
        foreignKey: {
          mod: "base",
          table: "menu",
        },
      },
      {
        COLUMN_NAME: "code",
        require: true,
        search: true,
        width: 160,
        align: "left",
        fixed: false,
        readonly: true,
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        width: 160,
        align: "left",
        fixed: false,
      },
      {
        COLUMN_NAME: "order_by",
        readonly: true,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  // 系统选项
  base_options: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl", "ky" ],
      ],
      sys_fields: [
        "lbl",
        "ky",
      ],
      isRealData: false,
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        search: true,
        width: 280,
        align: "left",
        fixed: "left",
      },
      {
        COLUMN_NAME: "ky",
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
  // 业务选项
  base_optbiz: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl", "ky" ],
      ],
      sys_fields: [
        "lbl",
        "ky",
      ],
      isRealData: false,
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        search: true,
        width: 280,
        align: "left",
        fixed: "left",
      },
      {
        COLUMN_NAME: "ky",
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
      noExport: true,
      defaultSort: {
        prop: "create_time",
        order: "descending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "module",
        width: 120,
        noList: true,
      },
      {
        COLUMN_NAME: "module_lbl",
        search: true,
        width: 180,
      },
      {
        COLUMN_NAME: "method",
        width: 120,
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
        width: 180,
        fixed: false,
        align: "center",
      },
      {
        COLUMN_NAME: "time",
      },
      {
        COLUMN_NAME: "old_data",
        align: "left",
        width: 100,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "new_data",
        align: "left",
        width: 100,
        noAdd: true,
        noEdit: true,
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
  // 组织
  base_org: {
    opts: {
      cache: true,
      uniques: [
        [ "lbl" ],
      ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
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
      uniques: [
        [ "parent_id", "lbl" ],
      ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      list_tree: true,
    },
    columns: [
      {
        COLUMN_NAME: "parent_id",
        require: false,
        foreignKey: {
          mod: "base",
          table: "dept",
          column: "id",
          lbl: "lbl",
          defaultSort: {
            prop: "order_by",
            order: "ascending",
          },
        },
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
        COLUMN_NAME: "usr_ids",
        COLUMN_COMMENT: "部门负责人",
        width: 200,
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
        COLUMN_NAME: "org_id",
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
      uniques: [
        [ "code" ],
        [ "lbl" ],
      ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      sys_fields: [
        "code",
        "type",
        "is_enabled",
      ],
      inlineForeignTabs: [
        {
          mod: "base",
          table: "dict_detail",
          label: "系统字典明细",
          column: "dict_id",
        },
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
            label: "系统字典明细",
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
        COLUMN_NAME: "is_add",
        onlyCodegenDeno: true,
        onlyCodegenDenoButApi: true,
      },
      {
        COLUMN_NAME: "is_enabled",
        isSwitch: false,
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
      uniques: [
        [ "dict_id", "lbl" ],
      ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      sys_fields: [
        "val",
      ],
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
        COLUMN_NAME: "is_enabled",
        isSwitch: false,
      },
      {
        COLUMN_NAME: "order_by",
      },
      {
        COLUMN_NAME: "rem",
        width: 220,
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
  // 业务字典
  base_dictbiz: {
    opts: {
      cache: true,
      uniques: [
        [ "code" ],
        [ "lbl" ],
      ],
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      inlineForeignTabs: [
        {
          mod: "base",
          table: "dictbiz_detail",
          label: "业务字典明细",
          column: "dictbiz_id",
        },
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
        COLUMN_NAME: "is_add",
        onlyCodegenDeno: true,
        onlyCodegenDenoButApi: true,
      },
      {
        COLUMN_NAME: "type",
        require: true,
        width: 100,
      },
      {
        COLUMN_NAME: "is_enabled",
        isSwitch: false,
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
  // 业务字典明细
  base_dictbiz_detail: {
    opts: {
      cache: true,
      uniques: [
        [ "dictbiz_id", "lbl" ],
      ],
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
        COLUMN_NAME: "is_enabled",
        isSwitch: false,
      },
      {
        COLUMN_NAME: "order_by",
      },
      {
        COLUMN_NAME: "rem",
        width: 220,
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
