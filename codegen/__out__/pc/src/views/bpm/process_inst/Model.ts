/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  ProcessInstInput as ProcessInstInputType,
  ProcessInstModel as ProcessInstModelType,
  ProcessInstSearch as ProcessInstSearchType,
  ProcessInstFieldComment as ProcessInstFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 流程实例 */
  interface ProcessInstModel extends ProcessInstModelType {
  }
  
  /** 流程实例 */
  interface ProcessInstInput extends ProcessInstInputType {
  }
  
  /** 流程实例 */
  interface ProcessInstSearch extends ProcessInstSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 流程实例 */
  interface ProcessInstFieldComment extends ProcessInstFieldCommentType {
  }
  
}

export const processInstFields = [
  // ID
  "id",
  // 实例标题
  "lbl",
  // 流程定义
  "process_def_id",
  "process_def_id_lbl",
  // 流程版本
  "process_revision_id",
  "process_revision_id_lbl",
  // 状态
  "status",
  "status_lbl",
  // 关联业务
  "biz_code",
  "biz_code_lbl",
  // 业务数据ID
  "form_data_id",
  // 发起人
  "start_usr_id",
  "start_usr_id_lbl",
  // 发起人部门
  "start_dept_id",
  "start_dept_id_lbl",
  // 当前活跃节点
  "current_node_ids",
  // 当前节点名称
  "current_node_lbls",
  // 总耗时(秒)
  "duration_seconds",
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

export const processInstQueryField = `
  ${ processInstFields.join(" ") }
`;
