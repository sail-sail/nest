import type {
  MessageReceiverInput as MessageReceiverInputType,
  MessageReceiverModel as MessageReceiverModelType,
  MessageReceiverSearch as MessageReceiverSearchType,
  MessageReceiverFieldComment as MessageReceiverFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathMessageReceiver() {
  return "/base/message_receiver";
}

export function getTableNameMessageReceiver() {
  return "base_message_receiver";
}

declare const messageReceiverId: unique symbol;

declare global {
  
  /** 消息接收人 */
  type MessageReceiverId = Distinct<string, typeof messageReceiverId>;
  
  /** 消息接收人 */
  interface MessageReceiverSearch extends MessageReceiverSearchType {
    auth_usr_id?: UsrId | null;
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface MessageReceiverModel extends MessageReceiverModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
  }

  interface MessageReceiverInput extends MessageReceiverInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    update_time_save_null?: boolean | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface MessageReceiverFieldComment extends MessageReceiverFieldCommentType {
  }
  
}

/** 消息接收人 前端允许排序的字段 */
export const canSortInApiMessageReceiver = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 消息接收人 检测字段是否允许前端排序 */
export function checkSortMessageReceiver(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortMessageReceiver: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiMessageReceiver;
    if (!canSortInApiMessageReceiver[prop]) {
      throw new Error(`checkSortMessageReceiver: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputMessageReceiver(
  input?: MessageReceiverInput,
) {
  
  if (!input) {
    return;
  }
}
