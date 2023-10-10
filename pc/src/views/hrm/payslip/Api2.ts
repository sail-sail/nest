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

/**
 * 一键发送企微工资条
 */
export async function sendMsgWxwOneKey(
  host: string,
  opt?: GqlOpt,
) {
  const data: {
    sendMsgWxwOneKey: Mutation["sendMsgWxwOneKey"];
  } = await query({
    query: /* GraphQL */ `
      mutation($host: String!) {
        sendMsgWxwOneKey(host: $host)
      }
    `,
    variables: {
      host,
    },
  }, opt);
  const num = data.sendMsgWxwOneKey;
  return num;
}
