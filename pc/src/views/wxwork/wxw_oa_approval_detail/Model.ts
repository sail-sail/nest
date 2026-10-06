/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxwOaApprovalDetailInput as WxwOaApprovalDetailInputType,
  WxwOaApprovalDetailModel as WxwOaApprovalDetailModelType,
  WxwOaApprovalDetailSearch as WxwOaApprovalDetailSearchType,
  WxwOaApprovalDetailFieldComment as WxwOaApprovalDetailFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 审批申请详情 */
  interface WxwOaApprovalDetailModel extends WxwOaApprovalDetailModelType {
  }
  
  /** 审批申请详情 */
  interface WxwOaApprovalDetailInput extends WxwOaApprovalDetailInputType {
  }
  
  /** 审批申请详情 */
  interface WxwOaApprovalDetailSearch extends WxwOaApprovalDetailSearchType {
  }
  
  /** 审批申请详情 */
  interface WxwOaApprovalDetailFieldComment extends WxwOaApprovalDetailFieldCommentType {
  }
  
}

export const wxwOaApprovalDetailFields = [
  // ID
  "id",
  // 审批编号
  "sp_no",
  // 审批申请类型名称
  "sp_name",
  // 审批申请状态
  "sp_status",
  "sp_status_lbl",
  // 模板ID
  "template_id",
  // 审批申请提交时间
  "apply_time",
  "apply_time_lbl",
  // 申请人
  "applyer_userid",
  // 批量申请人
  "batch_applyer_userid",
  // 原始数据
  "raw_data",
  // 所属组织
  "org_id",
  "org_id_lbl",
];

export const wxwOaApprovalDetailQueryField = `
  ${ wxwOaApprovalDetailFields.join(" ") }
`;
