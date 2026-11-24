import { mutation } from "@/utils/graphql";

/** 标记消息为已读 */
export async function markMessageReceiverAsRead(
  id: MessageReceiverId,
  opt?: GqlOpt,
): Promise<boolean> {
  const res: {
    markMessageReceiverAsRead: boolean;
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: MessageReceiverId!) {
        markMessageReceiverAsRead(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);

  return res.markMessageReceiverAsRead;
}

/** 按消息ID标记已读, 企微消息会同时把关联的站内消息标记已读 */
export async function markMyMessageReadByMessageId(
  messageId: MessageId,
  opt?: GqlOpt,
): Promise<boolean> {
  const res: {
    markMyMessageReadByMessageId: boolean;
  } = await mutation({
    query: /* GraphQL */ `
      mutation($messageId: MessageId!) {
        markMyMessageReadByMessageId(message_id: $messageId)
      }
    `,
    variables: {
      messageId,
    },
  }, opt);

  return res.markMyMessageReadByMessageId;
}
