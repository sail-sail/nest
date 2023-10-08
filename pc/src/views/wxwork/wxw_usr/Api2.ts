import type {
  Mutation,
} from "#/types"

/**
 * 企微同步
 */
export async function wxwSyncUsr(
  host: string,
  opt?: GqlOpt,
) {
  const data: {
    wxwSyncUsr: Mutation["wxwSyncUsr"];
  } = await query({
    query: /* GraphQL */ `
      mutation($host: String!) {
        wxwSyncUsr(host: $host)
      }
    `,
    variables: {
      host,
    },
  }, opt);
  const res = data.wxwSyncUsr;
  return res;
}
