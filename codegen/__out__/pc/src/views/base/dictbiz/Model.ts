/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DictbizInput as DictbizInputType,
  DictbizModel as DictbizModelType,
  DictbizSearch as DictbizSearchType,
  DictbizFieldComment as DictbizFieldCommentType,
} from "#/types";

import {
  dictbizDetailFields,
} from "@/views/base/dictbiz_detail/Model";

declare global {
  
  /** 业务字典 */
  interface DictbizModel extends DictbizModelType {
  }
  
  /** 业务字典 */
  interface DictbizInput extends DictbizInputType {
    /** 系统字段 */
    is_sys?: number;
  }
  
  /** 业务字典 */
  interface DictbizSearch extends DictbizSearchType {
    is_deleted?: 0 | 1;
  }
  
  /** 业务字典 */
  interface DictbizFieldComment extends DictbizFieldCommentType {
  }
  
}

export const dictbizFields = [
  // ID
  "id",
  // 编码
  "code",
  // 名称
  "lbl",
  // 可新增
  "is_add",
  // 数据类型
  "type",
  "type_lbl",
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

export const dictbizQueryField = `
  ${ dictbizFields.join(" ") }
  dictbiz_detail {
    ${ dictbizDetailFields.join(" ") }
  }
`;
