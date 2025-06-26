/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DictDetailInput as DictDetailInputType,
  DictDetailModel as DictDetailModelType,
  DictDetailSearch as DictDetailSearchType,
  DictDetailFieldComment as DictDetailFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 系统字典明细 */
  interface DictDetailModel extends DictDetailModelType {
  }
  
  /** 系统字典明细 */
  interface DictDetailInput extends DictDetailInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }
  
  /** 系统字典明细 */
  interface DictDetailSearch extends DictDetailSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 系统字典明细 */
  interface DictDetailFieldComment extends DictDetailFieldCommentType {
  }
  
}

export const dictDetailFields = [
  // ID
  "id",
  // 系统字典
  "dict_id",
  "dict_id_lbl",
  // 名称
  "lbl",
  // 值
  "val",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
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
  "is_sys",
];

export const dictDetailQueryField = `
  ${ dictDetailFields.join(" ") }
`;
