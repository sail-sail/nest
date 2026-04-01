import { defineConfig } from "../../config.ts";

export default defineConfig({
  // 流程定义
  bpm_process_def: {
    opts: {
      uniques: [
        ["code"],
        ["lbl"],
      ],
      hasSelectInput: true,
    },
    columns: [
      {
        COLUMN_NAME: "code_seq",
        onlyCodegenDeno: true,
      },
      {
        COLUMN_NAME: "code",
        align: "center",
        search: false,
        width: 120,
        readonly: true,
        readonlyPlaceholder: "(自动生成)",
        autoCode: {
          prefix: "BPM",
          seq: "code_seq",
          seqPadStart0: 4,
        },
      },
      {
        COLUMN_NAME: "lbl",
        width: 200,
        align: "center",
      },
      {
        COLUMN_NAME: "menu_id",
        modelLabel: "menu_id_lbl",
        foreignKey: {
          mod: "base",
          table: "menu",
        },
        width: 160,
        align: "center",
      },
      {
        COLUMN_NAME: "current_revision_id",
        modelLabel: "current_revision_id_lbl",
        foreignKey: {
          mod: "bpm",
          table: "process_revision",
          selectType: "selectInput",
          isSearchBySelectInput: true,
        },
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "is_enabled",
      },
      {
        COLUMN_NAME: "order_by",
      },
      {
        COLUMN_NAME: "description",
        width: 300,
        isTextarea: true,
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
  // 流程版本
  bpm_process_revision: {
    opts: {
      defaultSort: {
        prop: "process_version",
        order: "descending",
      },
      detailCustomDialogType: "medium",
      detailFormCols: 3,
    },
    columns: [
      {
        COLUMN_NAME: "process_def_id",
        modelLabel: "process_def_id_lbl",
        search: true,
        foreignKey: {
          selectType: "selectInput",
          isSearchByLbl: true,
        },
      },
      {
        COLUMN_NAME: "lbl",
        width: 200,
        align: "center",
        fixed: false,
        readonly: true,
        readonlyPlaceholder: "(自动生成)",
      },
      {
        COLUMN_NAME: "process_version",
        width: 100,
        align: "center",
        readonly: true,
        readonlyPlaceholder: "(自动生成)",
      },
      {
        COLUMN_NAME: "graph_json",
        width: 100,
      },
      {
        COLUMN_NAME: "publish_time",
        noAdd: true,
        noEdit: true,
        search: true,
      },
      {
        COLUMN_NAME: "publish_usr_id",
        modelLabel: "publish_usr_id_lbl",
        foreignKey: {
          mod: "base",
          table: "usr",
          selectType: "selectInput",
          isSearchByLbl: true,
        },
        noAdd: true,
        noEdit: true,
        search: true,
      },
    ],
  },
  // 流程实例
  bpm_process_inst: {
    opts: {
    },
    columns: [
      {
        COLUMN_NAME: "lbl",
        width: 250,
      },
      {
        COLUMN_NAME: "process_def_id",
        modelLabel: "process_def_id_lbl",
        search: true,
      },
      {
        COLUMN_NAME: "process_revision_id",
        modelLabel: "process_revision_id_lbl",
        noList: true,
      },
      {
        COLUMN_NAME: "status",
        search: true,
        width: 100,
      },
      {
        COLUMN_NAME: "menu_id",
        modelLabel: "menu_id_lbl",
        foreignKey: {
          mod: "base",
          table: "menu",
        },
        width: 160,
        noDetail: true,
      },
      {
        COLUMN_NAME: "form_data_id",
        notForeignKeyById: true,
        noList: true,
        noDetail: true,
      },
      {
        COLUMN_NAME: "start_usr_id",
        modelLabel: "start_usr_id_lbl",
        foreignKey: {
          mod: "base",
          table: "usr",
        },
        search: true,
      },
      {
        COLUMN_NAME: "start_dept_id",
        modelLabel: "start_dept_id_lbl",
        foreignKey: {
          mod: "base",
          table: "dept",
        },
        search: true,
      },
      {
        COLUMN_NAME: "current_node_ids",
        notForeignKeyById: true,
        noList: true,
        noDetail: true,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "current_node_lbls",
        width: 200,
        noAdd: true,
        noEdit: true,
      },
      {
        COLUMN_NAME: "duration_seconds",
        width: 120,
        noAdd: true,
        noEdit: true,
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
  // 节点实例
  bpm_node_inst: {
    columns: [
      {
        COLUMN_NAME: "process_inst_id",
        modelLabel: "process_inst_id_lbl",
        search: true,
      },
      {
        COLUMN_NAME: "node_id",
        notForeignKeyById: true,
        width: 160,
      },
      {
        COLUMN_NAME: "node_type",
        width: 100,
      },
      {
        COLUMN_NAME: "status",
        search: true,
        width: 100,
      },
      {
        COLUMN_NAME: "duration_seconds",
        width: 120,
        noAdd: true,
        noEdit: true,
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
  // 任务
  bpm_task: {
    columns: [
      {
        COLUMN_NAME: "lbl",
        width: 250,
      },
      {
        COLUMN_NAME: "process_inst_id",
        modelLabel: "process_inst_id_lbl",
        search: true,
      },
      {
        COLUMN_NAME: "node_inst_id",
        modelLabel: "node_inst_id_lbl",
        noList: true,
      },
      {
        COLUMN_NAME: "assignee_usr_id",
        modelLabel: "assignee_usr_id_lbl",
        foreignKey: {
          mod: "base",
          table: "usr",
        },
        search: true,
      },
      {
        COLUMN_NAME: "status",
        search: true,
        width: 100,
      },
      {
        COLUMN_NAME: "action",
        width: 100,
      },
      {
        COLUMN_NAME: "opinion",
        width: 300,
        noList: true,
      },
      {
        COLUMN_NAME: "duration_seconds",
        width: 120,
        noAdd: true,
        noEdit: true,
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
  // 转交记录
  bpm_transfer: {
    columns: [
      {
        COLUMN_NAME: "task_id",
        modelLabel: "task_id_lbl",
      },
      {
        COLUMN_NAME: "from_usr_id",
        modelLabel: "from_usr_id_lbl",
        foreignKey: {
          mod: "base",
          table: "usr",
        },
      },
      {
        COLUMN_NAME: "to_usr_id",
        modelLabel: "to_usr_id_lbl",
        foreignKey: {
          mod: "base",
          table: "usr",
        },
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
  // 流程日志
  bpm_log: {
    opts: {
      defaultSort: {
        prop: "log_time",
        order: "ascending",
      },
    },
    columns: [
      {
        COLUMN_NAME: "process_inst_id",
        modelLabel: "process_inst_id_lbl",
        search: true,
      },
      {
        COLUMN_NAME: "node_inst_id",
        modelLabel: "node_inst_id_lbl",
        noList: true,
      },
      {
        COLUMN_NAME: "task_id",
        modelLabel: "task_id_lbl",
        noList: true,
      },
      {
        COLUMN_NAME: "action",
        width: 100,
        search: true,
      },
      {
        COLUMN_NAME: "usr_id",
        modelLabel: "usr_id_lbl",
        foreignKey: {
          mod: "base",
          table: "usr",
        },
        search: true,
      },
      {
        COLUMN_NAME: "opinion",
        width: 300,
      },
      {
        COLUMN_NAME: "node_label",
        width: 150,
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
