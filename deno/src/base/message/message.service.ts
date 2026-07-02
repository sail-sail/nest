import "/gen/base/message/message.model.ts";
import "/gen/base/usr/usr.model.ts";

import {
  getCurrentUserUnreadMessageCount,
  sendMessage as sendMessageDao2,
} from "/gen/base/message/message.dao2.ts";

export async function getMyUnreadMessageCount(): Promise<number> {
  return await getCurrentUserUnreadMessageCount();
}

export async function sendMessage(
  input: MessageInput,
  receiver_usr_ids: UsrId[],
): Promise<MessageModel> {
  return await sendMessageDao2(input, receiver_usr_ids);
}
