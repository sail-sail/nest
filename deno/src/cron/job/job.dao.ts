import {
  validateOption as validateOptionJob,
  validateIsEnabled as validateIsEnabledJob,
  findById as findByIdJob,
} from "/gen/cron/job/job.dao.ts";

import {
  create as createCronJobLog,
  updateById as updateByIdCronJobLog,
} from "/gen/cron/cron_job_log/cron_job_log.dao.ts";

import {
  create as createCronJobLogDetail,
} from "/gen/cron/cron_job_log_detail/cron_job_log_detail.dao.ts";

import dayjs from "dayjs";

import type {
  JobId,
} from "/gen/cron/job/job.model.ts";

import type {
  CronJobId,
} from "/gen/cron/cron_job/cron_job.model.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import {
  CronJobLogExecState,
} from "/gen/types.ts";

import type {
  CronJobLogId,
} from "/gen/cron/cron_job_log/cron_job_log.model.ts";

export async function runJob(
  job_id: JobId,
  cron_job_id: CronJobId,
  cron: string,
  tenant_id: TenantId,
) {
  const begin_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const id = await createCronJobLog({
    cron_job_id,
    begin_time,
    exec_result: "",
    tenant_id,
  });
  let exec_result: string | undefined | void;
  try {
    const job_model = await validateOptionJob(
      await findByIdJob(job_id),
    );
    await validateIsEnabledJob(job_model);
    console.log(`cron_job begin: ${ job_model.code }: ${ cron }`);
    const code = job_model.code;
    if (code === "test") {
      exec_result = await test(id, tenant_id);
    }
    exec_result = exec_result || "";
    const end_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    await updateByIdCronJobLog(
      id,
      {
        exec_state: CronJobLogExecState.Success,
        exec_result,
        end_time,
      },
    );
  } catch (err) {
    const end_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const exec_result = err.message || err.toString();
    await updateByIdCronJobLog(
      id,
      {
        exec_state: CronJobLogExecState.Fail,
        exec_result,
        end_time,
      },
    );
    throw err;
  } finally {
    console.log(`cron_job end: ${ job_id }: ${ cron }`);
  }
  return exec_result || "";
}

async function test(
  cron_job_log_id: CronJobLogId,
  tenant_id: TenantId,
) {
  await createCronJobLogDetail({
    lbl: "测试日志",
    cron_job_log_id,
    tenant_id,
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("test");
}
