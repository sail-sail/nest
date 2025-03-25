import {
  updateByIdBackgroundTask,
  createBackgroundTask,
} from "/gen/base/background_task/background_task.dao.ts";

import dayjs from "dayjs";

import {
  BackgroundTaskState,
  BackgroundTaskType,
} from "/gen/types.ts";

const timeoutObj = Symbol("timeoutObj");

// deno-lint-ignore no-explicit-any
async function handelResult(data: any, id: BackgroundTaskId) {
  if (typeof data === "object" && !(data instanceof String)) {
    data = JSON.stringify(data);
  }
  const dateNow = new Date();
  const end_time = dayjs(dateNow).format("YYYY-MM-DD HH:mm:ss");
  await updateByIdBackgroundTask(
    id,
    {
      state: BackgroundTaskState.Success,
      end_time,
      result: data,
    },
  );
}

async function handelErr(err: Error, id: BackgroundTaskId) {
  const errMsg = err.message || err.toString();
  const dateNow = new Date();
  const end_time = dayjs(dateNow).format("YYYY-MM-DD HH:mm:ss");
  await updateByIdBackgroundTask(
    id,
    {
      state: BackgroundTaskState.Fail,
      end_time,
      err_msg: errMsg,
    },
  );
}

export function backgroundTaskWrap(
  taskResult: { lbl: string, type?: BackgroundTaskType },
  // deno-lint-ignore no-explicit-any
  func: (...args: any[]) => Promise<any>,
) {
  const timeoutPrm = new Promise((resolve) => setTimeout(() => resolve(timeoutObj), 30000));
  // deno-lint-ignore no-explicit-any
  return async (...args: any[]) => {
    const dateNow = new Date();
    const begin_time = dayjs(dateNow).format("YYYY-MM-DD HH:mm:ss");
    const result = func(...args);
    const result2 = await Promise.race([ result, timeoutPrm ]);
    if (result2 === timeoutObj) {
      taskResult = taskResult || { };
      taskResult.type = taskResult.type || BackgroundTaskType.Text;
      const id: BackgroundTaskId = await createBackgroundTask(
        {
          lbl: taskResult.lbl || "",
          type: taskResult.type,
          state: BackgroundTaskState.Running,
          begin_time,
          end_time: undefined,
        },
      );
      (async function() {
        try {
          const data = await Promise.resolve(result);
          await handelResult(data, id);
        } catch (err0) {
          const err = err0 as Error;
          await handelErr(err, id);
        }
      })();
    }
  };
}
