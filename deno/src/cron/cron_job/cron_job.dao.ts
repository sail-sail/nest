import {
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

import { Cron } from "croner";

import {
  findAll as findAllCronJob,
} from "/gen/cron/cron_job/cron_job.dao.ts";

import {
  runJob,
} from "../job/job.dao.ts";

import type {
  JobId,
} from "/gen/cron/job/job.model.ts";

import type {
  CronJobId,
} from "/gen/cron/cron_job/cron_job.model.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

const cronJobs: {
  id: CronJobId;
  cron: string;
  job: Cron;
}[] = [ ];

function newCron(
  job_id: JobId,
  cron_job_id: CronJobId,
  cron: string,
  tenant_id: TenantId,
) {
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
  cron_jobModels.forEach((cron_jobModel) => {
    const cron_job_id = cron_jobModel.id;
    const job_id = cron_jobModel.job_id;
    const cron = cron_jobModel.cron;
    const tenant_id = cron_jobModel.tenant_id;
    const cronJob = cronJobs.find((item) => item.id === cron_job_id);
    if (!cronJob) {
      const job = newCron(job_id, cron_job_id, cron, tenant_id);
      cronJobs.push({ id: cron_job_id, cron, job });
      return;
    }
    if (cronJob.cron !== cron) {
      cronJob.job.stop();
      cronJob.job = newCron(job_id, cron_job_id, cron, tenant_id);
    }
  });
}
