/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
} from "#/types.ts";

import {
  dictDetailFields,
} from "@/views/base/dict_detail/Model";

declare global {
  
  /** 系统字典 */
  interface DictModel extends DictModelType {
  }
  
  /** 系统字典 */
  interface DictInput extends DictInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }
  
  /** 系统字典 */
  interface DictSearch extends DictSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 系统字典 */
  interface DictFieldComment extends DictFieldCommentType {
  }
  
}

export const dictFields = [
  // ID
  "id",
  // 编码
  "code",
  // 名称
  "lbl",
  // 数据类型
  "type",
  "type_lbl",
  // 可新增
  "is_add",
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

export const dictQueryField = `
  ${ dictFields.join(" ") }
  dict_detail {
    ${ dictDetailFields.join(" ") }
  }
`;
