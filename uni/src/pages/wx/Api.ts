import type {
  Query,
  Mutation,
  MutationBindWxUsrArgs,
} from "#/types";

export async function checkBindWxUsr() {
  const res: {
    checkBindWxUsr: Query["checkBindWxUsr"],
  } = await query({
    query: /* GraphQL */ `
      query {
        checkBindWxUsr
      }
    `,
  });
  const data = res.checkBindWxUsr;
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
          usr_id
          username
          tenant_id
          org_id
          authorization
          lang
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
