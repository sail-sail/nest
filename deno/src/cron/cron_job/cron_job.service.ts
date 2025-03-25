import {
  runJob,
} from "/src/cron/job/job.dao.ts";

import {
  findByIdCronJob,
  validateOptionCronJob,
} from "/gen/cron/cron_job/cron_job.dao.ts";

/**
 * 手动执行定时任务
 */
export async function runCronJob(
  id: CronJobId,
) {
  const cronJobModel = await validateOptionCronJob(
    await findByIdCronJob(id),
  );
  
  const cron_job_id = cronJobModel.id;
  const job_id = cronJobModel.job_id;
  const cron = cronJobModel.cron;
  const tenant_id = cronJobModel.tenant_id;
  
  const res = await runJob(job_id, cron_job_id, cron, tenant_id);
  return res;
}
