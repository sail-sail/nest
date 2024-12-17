/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  CompanyInput as CompanyInputType,
  CompanyModel as CompanyModelType,
  CompanySearch as CompanySearchType,
  CompanyFieldComment as CompanyFieldCommentType,
} from "#/types";

declare global {
  
  interface CompanyModel extends CompanyModelType {
  }

  interface CompanyInput extends CompanyInputType {
  }

  interface CompanySearch extends CompanySearchType {
  }

  interface CompanyFieldComment extends CompanyFieldCommentType {
  }
  
}

export const companyFields = [
  // ID
  "id",
  // 编号
  "code",
  // 名称
  "lbl",
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

export const companyQueryField = `
  ${ companyFields.join(" ") }
`;
