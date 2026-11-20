import { useContext } from "/lib/context.ts";
import "/gen/base/usr/usr.model.ts";

export async function getMyUnreadMessageCount() {
  const {
    getMyUnreadMessageCount,
  } = await import("./message.service.ts");

  return await getMyUnreadMessageCount();
}

export async function sendMessage(
  input: MessageInput,
  receiver_usr_ids: UsrId[],
) {
  const {
    sendMessage,
  } = await import("./message.service.ts");

  const context = useContext();
  context.is_tran = true;

  return await sendMessage(input, receiver_usr_ids);
}

export async function markMessageReceiverAsRead(id: MessageReceiverId) {
  const {
    markMessageReceiverAsRead: markMessageReceiverAsReadService,
  } = await import("./message.service.ts");

  const context = useContext();
  context.is_tran = true;

  return await markMessageReceiverAsReadService(id);
}

/** 按消息ID标记当前用户已读(企微消息会联动关联的站内消息) */
export async function markMyMessageReadByMessageId(message_id: MessageId) {
  const {
    markMyMessageReadByMessageId: markMyMessageReadByMessageIdService,
  } = await import("./message.service.ts");

  const context = useContext();
  context.is_tran = true;

  return await markMyMessageReadByMessageIdService(message_id);
}
