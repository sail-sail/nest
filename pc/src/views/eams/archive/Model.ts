/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  ArchiveInput as ArchiveInputType,
  ArchiveModel as ArchiveModelType,
  ArchiveSearch as ArchiveSearchType,
  ArchiveFieldComment as ArchiveFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 全宗设置 */
  interface ArchiveModel extends ArchiveModelType {
  }
  
  /** 全宗设置 */
  interface ArchiveInput extends ArchiveInputType {
  }
  
  /** 全宗设置 */
  interface ArchiveSearch extends ArchiveSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 全宗设置 */
  interface ArchiveFieldComment extends ArchiveFieldCommentType {
  }
  
}

export const archiveFields = [
  // ID
  "id",
  // 编号
  "code",
  // 名称
  "lbl",
  // 关联单位
  "company_id",
  "company_id_lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
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

export const archiveQueryField = `
  ${ archiveFields.join(" ") }
`;
