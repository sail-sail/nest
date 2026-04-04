/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  TaskInput as TaskInputType,
  TaskModel as TaskModelType,
  TaskSearch as TaskSearchType,
  TaskFieldComment as TaskFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 审批任务 */
  interface TaskModel extends TaskModelType {
  }
  
  /** 审批任务 */
  interface TaskInput extends TaskInputType {
  }
  
  /** 审批任务 */
  interface TaskSearch extends TaskSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 审批任务 */
  interface TaskFieldComment extends TaskFieldCommentType {
  }
  
}

export const taskFields = [
  // ID
  "id",
  // 任务标题
  "lbl",
  // 流程实例
  "process_inst_id",
  "process_inst_id_lbl",
  // 节点实例
  "node_inst_id",
  "node_inst_id_lbl",
  // 处理人
  "assignee_usr_id",
  "assignee_usr_id_lbl",
  // 任务状态
  "status",
  "status_lbl",
  // 审批动作
  "action",
  "action_lbl",
  // 审批意见
  "opinion",
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

export const taskQueryField = `
  ${ taskFields.join(" ") }
`;
