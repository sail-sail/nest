import {
  validateOption as validateOptionJob,
  validateIsEnabled as validateIsEnabledJob,
  findById as findByIdJob,
} from "/gen/cron/job/job.dao.ts";

import {
  create as createCronJobLog,
  updateById as updateByIdCronJobLog,
  updateTenantById as updateTenantByIdCronJobLog,
} from "/gen/cron/cron_job_log/cron_job_log.dao.ts";

import dayjs from "dayjs";

export async function runJob(
  job_id: string,
  cron_job_id: string,
  cron: string,
  tenant_id: string,
) {
  const begin_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const id = await createCronJobLog({
    cron_job_id,
    begin_time,
  });
  await updateTenantByIdCronJobLog(
    id,
    tenant_id,
  );
  let exec_result: string | undefined | void;
  try {
    const jobModel = await validateOptionJob(
      await findByIdJob(job_id),
    );
    await validateIsEnabledJob(jobModel);
    console.log(`cron_job begin: ${ jobModel.code }: ${ cron }`);
    const code = jobModel.code;
    if (code === "test") {
      exec_result = await test();
    }
    exec_result = exec_result || "";
    const end_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    await updateByIdCronJobLog(
      id,
      {
        exec_state: "success",
        exec_result,
        end_time,
      },
    );
  } catch (err) {
    console.log(`cron_job end: ${ job_id }: ${ cron }`);
    const end_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const exec_result = err.toString();
    await updateByIdCronJobLog(
      id,
      {
        exec_state: "fail",
        exec_result,
        end_time,
      },
    );
    throw err;
  }
  return exec_result || "";
}

async function test() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("test");
}
