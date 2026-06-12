/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  CompCnfInput as CompCnfInputType,
  CompCnfModel as CompCnfModelType,
  CompCnfSearch as CompCnfSearchType,
  CompCnfFieldComment as CompCnfFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 组件配置 */
  interface CompCnfModel extends CompCnfModelType {
  }
  
  /** 组件配置 */
  interface CompCnfInput extends CompCnfInputType {
  }
  
  /** 组件配置 */
  interface CompCnfSearch extends CompCnfSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 组件配置 */
  interface CompCnfFieldComment extends CompCnfFieldCommentType {
  }
  
}

export const compCnfFields = [
  // ID
  "id",
  // 分组
  "group",
  // 名称
  "lbl",
  // 类型
  "type",
  "type_lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
  // 值
  "val",
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

export const compCnfQueryField = `
  ${ compCnfFields.join(" ") }
`;
