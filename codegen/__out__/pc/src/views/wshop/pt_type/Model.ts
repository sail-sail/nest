/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  PtTypeInput as PtTypeInputType,
  PtTypeModel as PtTypeModelType,
  PtTypeSearch as PtTypeSearchType,
  PtTypeFieldComment as PtTypeFieldCommentType,
} from "#/types";

declare global {
  
  /** 产品类别 */
  interface PtTypeModel extends PtTypeModelType {
    /** 图标 */
    img_lbl: string;
  }
  
  /** 产品类别 */
  interface PtTypeInput extends PtTypeInputType {
  }
  
  /** 产品类别 */
  interface PtTypeSearch extends PtTypeSearchType {
    is_deleted?: 0 | 1;
  }
  
  /** 产品类别 */
  interface PtTypeFieldComment extends PtTypeFieldCommentType {
  }
  
}

export const ptTypeFields = [
  // ID
  "id",
  // 图标
  "img",
  // 名称
  "lbl",
  // 首页显示
  "is_home",
  "is_home_lbl",
  // 推荐
  "is_recommend",
  "is_recommend_lbl",
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
];

export const ptTypeQueryField = `
  ${ ptTypeFields.join(" ") }
`;
