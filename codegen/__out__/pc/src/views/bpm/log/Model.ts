/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  LogInput as LogInputType,
  LogModel as LogModelType,
  LogSearch as LogSearchType,
  LogFieldComment as LogFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 流程日志 */
  interface LogModel extends LogModelType {
  }
  
  /** 流程日志 */
  interface LogInput extends LogInputType {
  }
  
  /** 流程日志 */
  interface LogSearch extends LogSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 流程日志 */
  interface LogFieldComment extends LogFieldCommentType {
  }
  
}

export const logFields = [
  // ID
  "id",
  // 流程实例
  "process_inst_id",
  "process_inst_id_lbl",
  // 节点实例
  "node_inst_id",
  // 关联任务
  "task_id",
  "task_id_lbl",
  // 动作
  "action",
  "action_lbl",
  // 操作人
  "usr_id",
  "usr_id_lbl",
  // 意见
  "opinion",
  // 节点名称
  "node_label",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const logQueryField = `
  ${ logFields.join(" ") }
`;
