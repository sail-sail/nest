import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  publish,
} from "/lib/websocket/websocket.dao.ts";

import {
  createReturnMessage,
} from "./message.dao.ts";

import {
  createsMessageReceiver,
  findCountMessageReceiver,
} from "/gen/base/message_receiver/message_receiver.dao.ts";

import type {
  UniqueType,
} from "/gen/types.ts";

import "./message.model.ts";
import "/gen/base/message_receiver/message_receiver.model.ts";

export interface Options {
  is_debug?: boolean;
  uniqueType?: UniqueType;
  hasDataPermit?: boolean;
  is_silent_mode?: boolean;
}

export async function getCurrentUserUnreadMessageCount(
  options?: Options,
): Promise<number> {
  const usr_id = await get_usr_id(false);

  const search: MessageReceiverSearch = {
    receiver_usr_id: [usr_id],
    is_read: [0],
  };

  return await findCountMessageReceiver(search, options);
}

export async function sendMessage(
  input: MessageInput,
  receiver_usr_ids: UsrId[],
  options?: Options,
): Promise<MessageModel> {
  const sender_usr_id = await get_usr_id(false);
  const receiver_inputs: MessageReceiverInput[] = [];

  const message_input: MessageInput = {
    ...input,
  };
  message_input.sender_usr_id = sender_usr_id;
  message_input.route_path = message_input.route_path ?? "/base/message";
  message_input.route_query = message_input.route_query ?? "";
  message_input.is_sys_msg = message_input.is_sys_msg ?? 0;
  message_input.is_pinned = message_input.is_pinned ?? 0;

  const title = message_input.title ?? "";
  const content = message_input.content ?? "";
  const route_path = message_input.route_path ?? "";
  const route_query = message_input.route_query ?? "";
  const tenant_id = message_input.tenant_id;

  const message = await createReturnMessage(message_input, options);

  for (const receiver_usr_id of receiver_usr_ids) {
    receiver_inputs.push({
      message_id: message.id,
      receiver_usr_id,
      is_read: 0,
      tenant_id,
    });
  }

  if (receiver_inputs.length > 0) {
    await createsMessageReceiver(receiver_inputs, options);
  }

  const payload = {
    messageId: message.id,
    title,
    content,
    routePath: route_path,
    routeQuery: route_query,
    receiverUsrIds: receiver_usr_ids,
  };

  await publish({
    topic: `${sender_usr_id}/message`,
    payload,
  });

  return message;
}
