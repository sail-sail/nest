import { defineConfig } from "../config";

export default defineConfig({
  role: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单",
        ORDINAL_POSITION: 5,
        require: false,
        search: true,
        minWith: 50,
        foreignKey: {
          showType: "dialog",
        },
      },
    ],
  },
  tenant: {
    opts: {
      cache: true,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单",
        ORDINAL_POSITION: 6,
        require: false,
        search: true,
        minWith: 50,
        foreignKey: {
          showType: "dialog",
        },
      },
    ],
  },
  usr: {
    opts: {
      cache: true,
      ignoreCodegen: false,
      unique: [ "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "username",
        require: true,
        search: true,
        sortable: true,
        minWith: 140,
      },
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
        sortable: true,
        minWith: 140,
      },
      {
        COLUMN_NAME: "password",
        minWith: 140,
        isPassword: true,
      },
      {
        COLUMN_NAME: "role_ids",
        COLUMN_COMMENT: "角色",
        ORDINAL_POSITION: 5,
        require: false,
        search: true,
        minWith: 140,
      },
    ],
  },
  menu: {
    opts: {
      cache: true,
      defaultSort: {
        prop: "order_by",
        order: "ascending",
      },
      unique: [ "menu_id", "lbl" ],
    },
    columns: [
      {
        COLUMN_NAME: "menu_id",
        require: false,
        search: true,
        sortable: true,
        minWith: 140,
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
    ]
  },
  permit: {
    opts: {
      cache: true,
      unique: [ "menu_id", "lbl" ],
    },
  },
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
        minWith: 120,
      },
      {
        COLUMN_NAME: "state",
        require: true,
        search: true,
        minWith: 55,
      },
      {
        COLUMN_NAME: "type",
        require: true,
        search: true,
        minWith: 55,
      },
      {
        COLUMN_NAME: "result",
        minWith: 140,
      },
      {
        COLUMN_NAME: "begin_time",
        search: true,
        sortable: true,
        minWith: 110,
      },
      {
        COLUMN_NAME: "end_time",
        sortable: true,
        minWith: 110,
      },
      {
        COLUMN_NAME: "create_usr_id",
        ignoreCodegen: false,
        onlyCodegenNest: true,
        foreignKey: {
          table: "usr",
        },
      },
    ]
  },
  // 选项
  option: {
    opts: {
      cache: true,
      unique: [ "key" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        search: true,
      },
      {
        COLUMN_NAME: "key",
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "value",
        search: true,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
});
