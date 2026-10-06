/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxwOaTemplateInput as WxwOaTemplateInputType,
  WxwOaTemplateModel as WxwOaTemplateModelType,
  WxwOaTemplateSearch as WxwOaTemplateSearchType,
  WxwOaTemplateFieldComment as WxwOaTemplateFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 审批模板 */
  interface WxwOaTemplateModel extends WxwOaTemplateModelType {
  }
  
  /** 审批模板 */
  interface WxwOaTemplateInput extends WxwOaTemplateInputType {
  }
  
  /** 审批模板 */
  interface WxwOaTemplateSearch extends WxwOaTemplateSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 审批模板 */
  interface WxwOaTemplateFieldComment extends WxwOaTemplateFieldCommentType {
  }
  
}

export const wxwOaTemplateFields = [
  // ID
  "id",
  // 模板名称
  "lbl",
  // 模板ID
  "template_id",
  // 业务类型
  "business_type",
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
  // 所属组织
  "org_id",
  "org_id_lbl",
  "is_deleted",
];

export const wxwOaTemplateQueryField = `
  ${ wxwOaTemplateFields.join(" ") }
`;
