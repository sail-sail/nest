import type {
  Mutation,
} from "#/types";

/**
 * 发送企微工资条
 */
export async function sendMsgWxw(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    sendMsgWxw: Mutation["sendMsgWxw"];
  } = await query({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        sendMsgWxw(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const num = data.sendMsgWxw;
  return num;
}
