import type {
  Mutation,
} from "#/types"

/**
 * 企微同步
 */
export async function wxwSyncUsr(
  opt?: GqlOpt,
) {
  const data: {
    wxwSyncUsr: Mutation["wxwSyncUsr"];
  } = await query({
    query: /* GraphQL */ `
      mutation {
        wxwSyncUsr
      }
    `,
    variables: {
    },
  }, opt);
  const res = data.wxwSyncUsr;
  return res;
}
