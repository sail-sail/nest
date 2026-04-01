/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  NodeInstInput as NodeInstInputType,
  NodeInstModel as NodeInstModelType,
  NodeInstSearch as NodeInstSearchType,
  NodeInstFieldComment as NodeInstFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 节点实例 */
  interface NodeInstModel extends NodeInstModelType {
  }
  
  /** 节点实例 */
  interface NodeInstInput extends NodeInstInputType {
  }
  
  /** 节点实例 */
  interface NodeInstSearch extends NodeInstSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 节点实例 */
  interface NodeInstFieldComment extends NodeInstFieldCommentType {
  }
  
}

export const nodeInstFields = [
  // ID
  "id",
  // 流程实例
  "process_inst_id",
  "process_inst_id_lbl",
  // 节点ID
  "node_id",
  // 节点类型
  "node_type",
  "node_type_lbl",
  // 节点状态
  "status",
  "status_lbl",
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

export const nodeInstQueryField = `
  ${ nodeInstFields.join(" ") }
`;
