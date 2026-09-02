import type {
  MessageInput as MessageInputType,
  MessageModel as MessageModelType,
  MessageSearch as MessageSearchType,
  MessageFieldComment as MessageFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathMessage() {
  return "/base/message";
}

export function getTableNameMessage() {
  return "base_message";
}

declare const messageId: unique symbol;

declare global {
  
  /** 消息 */
  type MessageId = Distinct<string, typeof messageId>;
  
  /** 消息 */
  interface MessageSearch extends MessageSearchType {
    auth_usr_id?: UsrId | null;
    /** 跳转参数 */
    route_query?: string;
    route_query_like?: string;
    /** 系统消息 */
    is_sys_msg?: number[] | null;
    /** 置顶 */
    is_pinned?: number[] | null;
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface MessageModel extends MessageModelType {
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

  interface MessageInput extends MessageInputType {
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

  interface MessageFieldComment extends MessageFieldCommentType {
  }
  
}

/** 消息 前端允许排序的字段 */
export const canSortInApiMessage = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 消息 检测字段是否允许前端排序 */
export function checkSortMessage(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortMessage: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiMessage;
    if (!canSortInApiMessage[prop]) {
      throw new Error(`checkSortMessage: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputMessage(
  input?: MessageInput,
) {
  
  if (!input) {
    return;
  }
}
