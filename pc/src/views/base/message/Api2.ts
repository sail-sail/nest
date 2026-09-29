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
