import { defineConfig } from "./config";

export default defineConfig({
  role: {
    opts: {
      cache: true,
    },
    columns: [
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单",
        ORDINAL_POSITION: 5,
        require: false,
        search: true,
        minWith: 140,
      },
    ],
  },
  tenant: {
    opts: {
      cache: true,
    },
    columns: [
      {
        COLUMN_NAME: "menu_ids",
        COLUMN_COMMENT: "菜单",
        ORDINAL_POSITION: 6,
        require: false,
        search: true,
        minWith: 140,
      },
    ],
  },
  usr: {
    opts: {
      cache: true,
      ignoreCodegen: false,
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
    },
  },
});
