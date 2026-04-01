/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  TransferInput as TransferInputType,
  TransferModel as TransferModelType,
  TransferSearch as TransferSearchType,
  TransferFieldComment as TransferFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 转交记录 */
  interface TransferModel extends TransferModelType {
  }
  
  /** 转交记录 */
  interface TransferInput extends TransferInputType {
  }
  
  /** 转交记录 */
  interface TransferSearch extends TransferSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 转交记录 */
  interface TransferFieldComment extends TransferFieldCommentType {
  }
  
}

export const transferFields = [
  // ID
  "id",
  // 原任务
  "task_id",
  "task_id_lbl",
  // 转出人
  "from_usr_id",
  "from_usr_id_lbl",
  // 接收人
  "to_usr_id",
  "to_usr_id_lbl",
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

export const transferQueryField = `
  ${ transferFields.join(" ") }
`;
