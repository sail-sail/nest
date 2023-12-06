import type {
  Query,
  Mutation,
  MutationBindWxUsrArgs,
} from "#/types";

export async function checkBind() {
  const res: {
    checkBind: Query["checkBind"],
  } = await query({
    query: /* GraphQL */ `
      query {
        checkBind
      }
    `,
  });
  const data = res.checkBind;
  return data;
}

export async function bindWxUsr(
  input: MutationBindWxUsrArgs["input"],
  opt?: GqlOpt,
) {
  const res: {
    bindWxUsr: Mutation["bindWxUsr"],
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: LoginInput!) {
        bindWxUsr(input: $input) {
          authorization
          org_id
        }
      }
    `,
    variables: {
      input,
    },
  }, opt);
  const data = res.bindWxUsr;
  return data;
}
