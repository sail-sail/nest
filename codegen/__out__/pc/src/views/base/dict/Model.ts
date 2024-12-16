/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
} from "#/types";

import {
  dictDetailFields,
} from "@/views/base/dict_detail/Model";

declare global {
  
  interface DictModel extends DictModelType {
  }

  interface DictInput extends DictInputType {
    /** 系统字段 */
    is_sys?: number;
  }

  interface DictSearch extends DictSearchType {
  }

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
  // 锁定
  "is_locked",
  "is_locked_lbl",
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
