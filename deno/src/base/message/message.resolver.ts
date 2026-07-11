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
