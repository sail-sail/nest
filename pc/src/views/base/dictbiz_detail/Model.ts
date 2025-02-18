/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DictbizDetailInput as DictbizDetailInputType,
  DictbizDetailModel as DictbizDetailModelType,
  DictbizDetailSearch as DictbizDetailSearchType,
  DictbizDetailFieldComment as DictbizDetailFieldCommentType,
} from "#/types";

declare global {
  
  /** 业务字典明细 */
  interface DictbizDetailModel extends DictbizDetailModelType {
  }
  
  /** 业务字典明细 */
  interface DictbizDetailInput extends DictbizDetailInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }
  
  /** 业务字典明细 */
  interface DictbizDetailSearch extends DictbizDetailSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 业务字典明细 */
  interface DictbizDetailFieldComment extends DictbizDetailFieldCommentType {
  }
  
}

export const dictbizDetailFields = [
  // ID
  "id",
  // 业务字典
  "dictbiz_id",
  "dictbiz_id_lbl",
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

export const dictbizDetailQueryField = `
  ${ dictbizDetailFields.join(" ") }
`;
