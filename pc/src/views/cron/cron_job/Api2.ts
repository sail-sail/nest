import type {
  Mutation,
} from "#/types";

export async function runCronJob(
  id: CronJobId,
  opt?: GqlOpt,
) {
  const data: {
    runCronJob: Mutation["runCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: CronJobId!) {
        runCronJob(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.runCronJob;
  return res;
}
