import { defineConfig } from "../config";

export default defineConfig({
  // 微信配置
  base_wx_app: {
    opts: {
      cache: true,
      unique: [ "appid" ],
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "appid",
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "appsecret",
        require: true,
        search: true,
      },
      {
        COLUMN_NAME: "access_token",
      },
      {
        COLUMN_NAME: "token_time",
        width: 100,
      },
      {
        COLUMN_NAME: "expires_in",
        width: 100,
      },
      {
        COLUMN_NAME: "rem",
      },
    ],
  },
  base_wx_usr: {
    opts: {
      cache: true,
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        require: false,
        search: true,
        sortable: false,
        minWidth: 140,
      },
      {
        COLUMN_NAME: "name",
        require: false,
        search: true,
        sortable: false,
        minWidth: 140,
      },
      {
        COLUMN_NAME: "mobile",
        require: false,
        search: true,
        sortable: true,
        minWidth: 140,
      },
      {
        COLUMN_NAME: "openid",
        require: false,
        search: true,
        sortable: false,
        minWidth: 140,
      },
      {
        COLUMN_NAME: "gender",
        dict: "gender",
      },
      {
        COLUMN_NAME: "is_admin",
      },
      {
        COLUMN_NAME: "rem",
        require: false,
        search: true,
        sortable: false,
        minWidth: 140,
      },
    ],
  },
  // 停车场
  sps_parking: {
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
        COLUMN_NAME: "city",
        require: false,
        search: true,
        sortable: true,
        width: 140,
        align: "left",
      },
      {
        COLUMN_NAME: "addr",
        require: true,
        search: true,
        sortable: true,
        width: 140,
        align: "left",
      },
      {
        COLUMN_NAME: "tags",
        COLUMN_COMMENT: "标签",
        require: false,
        search: true,
        width: 280,
        align: "left",
      },
      {
        COLUMN_NAME: "images",
        COLUMN_COMMENT: "图片",
        require: false,
        search: true,
        isImg: true,
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
  // 相机
  // sps_camera: {
  //   opts: {
  //     cache: true,
  //     unique: [ "lbl" ],
  //   },
  //   columns: [
  //     {
  //       COLUMN_NAME: "lbl",
  //       require: true,
  //       search: true,
  //       align: "left",
  //       width: 240,
  //       fixed: "left",
  //     },
  //     {
  //       COLUMN_NAME: "is_enabled",
  //     },
  //     {
  //       COLUMN_NAME: "rem",
  //     },
  //     {
  //       COLUMN_NAME: "create_usr_id",
  //     },
  //     {
  //       COLUMN_NAME: "create_time",
  //     },
  //     {
  //       COLUMN_NAME: "update_usr_id",
  //     },
  //     {
  //       COLUMN_NAME: "update_time",
  //     },
  //   ]
  // },
  // 相机
  sps_camera: {
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
        COLUMN_NAME: "parking_id",
        foreignKey: {
          table: "parking",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
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
        COLUMN_NAME: "ip",
      },
      {
        COLUMN_NAME: "sn",
      },
      {
        COLUMN_NAME: "online_status",
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
  // 停车位
  sps_parking_space: {
    opts: {
      cache: true,
      unique: [ "lbl", "parking_id" ],
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
        COLUMN_NAME: "parking_id",
        foreignKey: {
          table: "parking",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
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
        COLUMN_NAME: "camera_id",
        foreignKey: {
          table: "camera",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
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
        COLUMN_NAME: "space_position",
      },
      {
        COLUMN_NAME: "space_car_no",
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
  
  // 地锁
  sps_parking_lock: {
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
        COLUMN_NAME: "parking_space_id",
        foreignKey: {
          table: "parking_space",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
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
        COLUMN_NAME: "lock_status",
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
    ]
  },
  
  // 地锁记录表
  sps_lock_record: {
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
        COLUMN_NAME: "lbl",
        require: false,
        search: true,
        align: "left",
        width: 240,
        fixed: "left",
      },
      {
        COLUMN_NAME: "parking_lock_id",
        foreignKey: {
          table: "parking_lock",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
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
        COLUMN_NAME: "lock_car_no",
      },
      {
        COLUMN_NAME: "lock_time",
      },
      {
        COLUMN_NAME: "unlock_time",
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
  // 用户车辆
  sps_usr_cars: {
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
        COLUMN_NAME: "wx_usr_id",
        foreignKey: {
          mod: "base",
          table: "wx_usr",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
          defaultSort: {
            prop: "create_time",
            order: "descending",
          },
        },
        width: 140,
        align: "left",
        fixed: "left",
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
  
  // 订单
  sps_order: {
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
        COLUMN_NAME: "parking_lock_id",
        foreignKey: {
          table: "parking_lock",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
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
        COLUMN_NAME: "lock_car_no",
      },
      {
        COLUMN_NAME: "lock_time",
      },
      {
        COLUMN_NAME: "unlock_time",
      },
      {
        COLUMN_NAME: "order_amount",
        align: "right",
      },
      {
        COLUMN_NAME: "pay_amount",
        align: "right",
      },
      {
        COLUMN_NAME: "pay_wx_usr_id",
        foreignKey: {
          mod: "base",
          table: "wx_usr",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
          defaultSort: {
            prop: "create_time",
            order: "descending",
          },
        },
        width: 140,
        align: "left",
        fixed: "left",
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
    ]
  },
  
  // 相机
  sps_parking_list: {
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
        COLUMN_NAME: "parking_id",
        foreignKey: {
          table: "parking",
          column: "id",
          lbl: "lbl",
          multiple: false,
          selectType: "select",
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
        COLUMN_NAME: "list_type",
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
    ]
  },
});