import {
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

import {
  Cron,
} from "@hexagon/croner";

import {
  findAllCronJob,
} from "/gen/cron/cron_job/cron_job.dao.ts";

import {
  runJob,
} from "../job/job.dao.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

const cronJobs: {
  id: CronJobId;
  cron: string;
  job: Cron;
}[] = [ ];

async function newCron(
  job_id: JobId,
  cron_job_id: CronJobId,
  cron: string,
  tenant_id: TenantId,
) {
  try {
    const job = new Cron(cron, async () => {
      const context = newContext();
      context.notVerifyToken = true;
      await runInAsyncHooks(context, async () => {
        try {
          await runJob(job_id, cron_job_id, cron, tenant_id);
        } catch (err) {
          console.error(err);
        }
      });
    });
    return job;
  } catch (err0) {
    const err = err0 as Error;
    const errMsg: string = err.message || "";
    if (errMsg.startsWith("CronPattern: ")) {
      throw await ns(`{0} 不是有效的Cron表达式`, cron);
    }
    throw err;
  }
}

export async function refreshCronJobs() {
  const cron_jobModels = await findAllCronJob({
    is_enabled: [ 1 ],
  });
  for (const cronJob of cronJobs) {
    const has = cron_jobModels.some((item) => item.id === cronJob.id);
    if (!has) {
      cronJob.job.stop();
      cronJobs.splice(cronJobs.indexOf(cronJob), 1);
    }
  }
  for (const cron_jobModel of cron_jobModels) {
    const cron_job_id = cron_jobModel.id;
    const job_id = cron_jobModel.job_id;
    const cron = cron_jobModel.cron;
    const tenant_id = cron_jobModel.tenant_id;
    const cronJob = cronJobs.find((item) => item.id === cron_job_id);
    if (!cronJob) {
      const job = await newCron(job_id, cron_job_id, cron, tenant_id);
      cronJobs.push({ id: cron_job_id, cron, job });
      return;
    }
    if (cronJob.cron !== cron) {
      cronJob.job.stop();
      cronJob.job = await newCron(job_id, cron_job_id, cron, tenant_id);
    }
  }
}
