import {
  validateOption as validateOptionJob,
  validateIsEnabled as validateIsEnabledJob,
  findById as findByIdJob,
} from "/gen/cron/job/job.dao.ts";

import {
  create as createCronJobLog,
} from "/gen/cron/cron_job_log/cron_job_log.dao.ts";

import dayjs from "dayjs";

export async function runJob(
  job_id: string,
  cron: string,
) {
  const begin_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const jobModel = await validateOptionJob(
      await findByIdJob(job_id),
    );
    await validateIsEnabledJob(jobModel);
    console.log(`cron_job begin: ${ jobModel.code }: ${ cron }`);
    const code = jobModel.code;
    if (code === "test") {
      await test();
    }
    const end_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    await createCronJobLog({
      cron_job_id: job_id,
      exec_state: "success",
      exec_result: "成功",
      begin_time,
      end_time,
    });
  } catch (err) {
    console.log(`cron_job end: ${ job_id }: ${ cron }`);
    const end_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    await createCronJobLog({
      cron_job_id: job_id,
      exec_state: "success",
      exec_result: "成功",
      begin_time,
      end_time,
    });
    throw err;
  }
}

async function test() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("test");
}
