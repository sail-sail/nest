import type {
  SmsSendRecordInput as SmsSendRecordInputType,
  SmsSendRecordModel as SmsSendRecordModelType,
  SmsSendRecordSearch as SmsSendRecordSearchType,
  SmsSendRecordFieldComment as SmsSendRecordFieldCommentType,
  // 状态
  SmsSendRecordStatus,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/submail/sms_send_record";

declare const smsSendRecordId: unique symbol;

declare global {
  
  /** 短信发送记录 */
  type SmsSendRecordId = Distinct<string, typeof smsSendRecordId>;
  
  /** 短信发送记录 */
  interface SmsSendRecordSearch extends SmsSendRecordSearchType {
    /** 内容 */
    content?: string;
    content_like?: string;
    /** 状态 */
    status?: SmsSendRecordStatus[];
    /** 发送时间 */
    send_time?: [(string|undefined|null), (string|undefined|null)];
    /** 标签 */
    tag?: string;
    tag_like?: string;
    /** 消息 */
    msg?: string;
    msg_like?: string;
    tenant_id?: TenantId | null;
  }

  interface SmsSendRecordModel extends SmsSendRecordModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    tenant_id: TenantId;
  }

  interface SmsSendRecordInput extends SmsSendRecordInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface SmsSendRecordFieldComment extends SmsSendRecordFieldCommentType {
  }
  
}

/** 短信发送记录 前端允许排序的字段 */
export const canSortInApiSmsSendRecord = {
  // 创建时间
  "create_time": true,
};

/** 短信发送记录 检测字段是否允许前端排序 */
export function checkSortSmsSendRecord(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortSmsSendRecord: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiSmsSendRecord;
    if (!canSortInApiSmsSendRecord[prop]) {
      throw new Error(`checkSortSmsSendRecord: ${ JSON.stringify(item) }`);
    }
  }
}
