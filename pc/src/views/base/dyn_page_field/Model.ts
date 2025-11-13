/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DynPageFieldInput as DynPageFieldInputType,
  DynPageFieldModel as DynPageFieldModelType,
  DynPageFieldSearch as DynPageFieldSearchType,
  DynPageFieldFieldComment as DynPageFieldFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 动态页面字段 */
  interface DynPageFieldModel extends DynPageFieldModelType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _attrs: Record<string, any>;
  }
  
  /** 动态页面字段 */
  interface DynPageFieldInput extends DynPageFieldInputType {
  }
  
  /** 动态页面字段 */
  interface DynPageFieldSearch extends DynPageFieldSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 动态页面字段 */
  interface DynPageFieldFieldComment extends DynPageFieldFieldCommentType {
  }
  
}

export const dynPageFieldFields = [
  // ID
  "id",
  // 编码
  "code",
  // 动态页面
  "dyn_page_id",
  "dyn_page_id_lbl",
  // 名称
  "lbl",
  // 类型
  "type",
  // 属性
  "attrs",
  // 必填
  "is_required",
  "is_required_lbl",
  // 宽度
  "width",
  // 对齐方式
  "align",
  "align_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  "is_deleted",
];

export const dynPageFieldQueryField = `
  ${ dynPageFieldFields.join(" ") }
`;
