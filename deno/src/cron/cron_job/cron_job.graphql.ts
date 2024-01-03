import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./cron_job.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`
  
type Mutation {
  "手动执行定时任务"
  runCronJob(
    "定时任务ID"
    id: CronJobId!,
  ): String!
}
  
`);
