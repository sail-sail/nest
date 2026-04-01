/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  ProcessRevisionInput as ProcessRevisionInputType,
  ProcessRevisionModel as ProcessRevisionModelType,
  ProcessRevisionSearch as ProcessRevisionSearchType,
  ProcessRevisionFieldComment as ProcessRevisionFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 流程版本 */
  interface ProcessRevisionModel extends ProcessRevisionModelType {
  }
  
  /** 流程版本 */
  interface ProcessRevisionInput extends ProcessRevisionInputType {
  }
  
  /** 流程版本 */
  interface ProcessRevisionSearch extends ProcessRevisionSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 流程版本 */
  interface ProcessRevisionFieldComment extends ProcessRevisionFieldCommentType {
  }
  
}

export const processRevisionFields = [
  // ID
  "id",
  // 流程定义
  "process_def_id",
  "process_def_id_lbl",
  // 名称
  "lbl",
  // 版本号
  "process_version",
  // 流程图
  "graph_json",
  // 发布时间
  "publish_time",
  "publish_time_lbl",
  // 发布人
  "publish_usr_id",
  "publish_usr_id_lbl",
  "is_deleted",
];

export const processRevisionQueryField = `
  ${ processRevisionFields.join(" ") }
`;
