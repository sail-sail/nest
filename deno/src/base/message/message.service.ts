import "/gen/base/message/message.model.ts";
import "/gen/base/message_receiver/message_receiver.model.ts";
import "/gen/base/usr/usr.model.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  getCurrentUserUnreadMessageCount,
  sendMessage as sendMessageDao2,
} from "/gen/base/message/message.dao2.ts";

import {
  findByIdMessageReceiver,
  updateByIdMessageReceiver,
} from "/gen/base/message_receiver/message_receiver.dao.ts";

export async function getMyUnreadMessageCount(): Promise<number> {
  return await getCurrentUserUnreadMessageCount();
}

export async function sendMessage(
  input: MessageInput,
  receiver_usr_ids: UsrId[],
): Promise<MessageModel> {
  return await sendMessageDao2(input, receiver_usr_ids);
}

export async function markMessageReceiverAsRead(id: MessageReceiverId): Promise<boolean> {
  if (!id) {
    return false;
  }

  const usr_id = await get_usr_id(false);
  const receiver_model = await findByIdMessageReceiver(id, {
    is_debug: false,
  });

  if (!receiver_model) {
    return false;
  }

  if (receiver_model.receiver_usr_id !== usr_id) {
    return false;
  }

  if (receiver_model.is_read === 1) {
    return true;
  }

  const read_time = new Date().toISOString().slice(0, 19).replace("T", " ");
  const updated_id = await updateByIdMessageReceiver(
    id,
    {
      is_read: 1,
      read_time,
    },
    {
      is_debug: false,
    },
  );

  return Boolean(updated_id);
}
