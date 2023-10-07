import type {
  Mutation,
} from "#/types";

/**
 * 企微发送条
 */
export async function sendMsgWxw(
  host: string,
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    sendMsgWxw: Mutation["sendMsgWxw"];
  } = await query({
    query: /* GraphQL */ `
      mutation($host: String!, $ids: [String!]!) {
        sendMsgWxw(host: $host, ids: $ids)
      }
    `,
    variables: {
      host,
      ids,
    },
  }, opt);
  const num = data.sendMsgWxw;
  return num;
}
