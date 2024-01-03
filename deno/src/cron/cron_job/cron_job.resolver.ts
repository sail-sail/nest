import type {
  CronJobId,
} from "/gen/cron/cron_job/cron_job.model.ts";

/**
 * 手动执行定时任务
 */
export async function runCronJob(
  id: CronJobId,
) {
  const {
    runCronJob,
  } = await import("./cron_job.service.ts");
  
  const res = await runCronJob(id);
  return res;
}
