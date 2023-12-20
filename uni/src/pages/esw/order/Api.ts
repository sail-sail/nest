import type {
  Mutation,
  PayNowInput,
} from "#/types";

/** 立即购买 */
export async function payNow(
  input: PayNowInput,
  opt?: GqlOpt,
) {
  const res: {
    payNow: Mutation["payNow"];
  } = await query({
    query: /* GraphQL */ `
      mutation($input: PayNowInput!) {
        payNow(input: $input)
      }
    `,
    variables: {
      input,
    },
  }, opt);
  const data = res.payNow;
  return data;
}
