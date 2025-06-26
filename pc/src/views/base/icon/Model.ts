/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  IconInput as IconInputType,
  IconModel as IconModelType,
  IconSearch as IconSearchType,
  IconFieldComment as IconFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 图标库 */
  interface IconModel extends IconModelType {
    /** 图标 */
    img_lbl: string;
  }
  
  /** 图标库 */
  interface IconInput extends IconInputType {
  }
  
  /** 图标库 */
  interface IconSearch extends IconSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 图标库 */
  interface IconFieldComment extends IconFieldCommentType {
  }
  
}

export const iconFields = [
  // ID
  "id",
  // 图标
  "img",
  // 编码
  "code",
  // 名称
  "lbl",
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
];

export const iconQueryField = `
  ${ iconFields.join(" ") }
`;
