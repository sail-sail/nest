/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  ProcessDefInput as ProcessDefInputType,
  ProcessDefModel as ProcessDefModelType,
  ProcessDefSearch as ProcessDefSearchType,
  ProcessDefFieldComment as ProcessDefFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 流程定义 */
  interface ProcessDefModel extends ProcessDefModelType {
  }
  
  /** 流程定义 */
  interface ProcessDefInput extends ProcessDefInputType {
  }
  
  /** 流程定义 */
  interface ProcessDefSearch extends ProcessDefSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 流程定义 */
  interface ProcessDefFieldComment extends ProcessDefFieldCommentType {
  }
  
}

export const processDefFields = [
  // ID
  "id",
  // 编码
  "code",
  // 流程名称
  "lbl",
  // 关联业务
  "biz_code",
  "biz_code_lbl",
  // 当前生效版本
  "current_revision_id",
  "current_revision_id_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 流程描述
  "description",
  // 备注
  "rem",
  // 流程图
  "graph_json",
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

export const processDefQueryField = `
  ${ processDefFields.join(" ") }
`;
