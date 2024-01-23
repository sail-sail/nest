import type {
  CronJobLogId,
} from "@/typings/ids";

import {
  CronJobLogExecState,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  CronJobLogSearch,
  CronJobLogInput,
  CronJobLogModel,
} from "#/types";

import type {
  CronJobSearch,
} from "#/types";

async function setLblById(
  model?: CronJobLogModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找任务执行日志列表
 * @param {CronJobLogSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCronJobLog: Query["findAllCronJobLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobLogSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCronJobLog(search: $search, page: $page, sort: $sort) {
          id
          cron_job_id
          cron_job_id_lbl
          exec_state
          exec_state_lbl
          exec_result
          begin_time
          begin_time_lbl
          end_time
          end_time_lbl
          rem
          create_time
          create_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllCronJobLog;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个任务执行日志
 * @param {CronJobLogSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: CronJobLogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCronJobLog: Query["findOneCronJobLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobLogSearch, $sort: [SortInput!]) {
        findOneCronJobLog(search: $search, sort: $sort) {
          id
          cron_job_id
          cron_job_id_lbl
          exec_state
          exec_state_lbl
          exec_result
          begin_time
          begin_time_lbl
          end_time
          end_time_lbl
          rem
          create_time
          create_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneCronJobLog;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找任务执行日志总数
 * @param {CronJobLogSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: CronJobLogSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCronJobLog: Query["findCountCronJobLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobLogSearch) {
        findCountCronJobLog(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCronJobLog;
  return count;
}

/**
 * 根据 id 查找任务执行日志
 * @param {CronJobLogId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: CronJobLogId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCronJobLog: Query["findByIdCronJobLog"];
  } = await query({
    query: /* GraphQL */ `
      query($id: CronJobLogId!) {
        findByIdCronJobLog(id: $id) {
          id
          cron_job_id
          cron_job_id_lbl
          exec_state
          exec_state_lbl
          exec_result
          begin_time
          begin_time_lbl
          end_time
          end_time_lbl
          rem
          create_time
          create_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdCronJobLog;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除任务执行日志
 * @param {CronJobLogId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: CronJobLogId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsCronJobLog: Mutation["deleteByIdsCronJobLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobLogId!]!) {
        deleteByIdsCronJobLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCronJobLog;
  return res;
}

/**
 * 根据 ids 还原任务执行日志
 * @param {CronJobLogId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: CronJobLogId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsCronJobLog: Mutation["revertByIdsCronJobLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobLogId!]!) {
        revertByIdsCronJobLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCronJobLog;
  return res;
}

/**
 * 根据 ids 彻底删除任务执行日志
 * @param {CronJobLogId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: CronJobLogId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsCronJobLog: Mutation["forceDeleteByIdsCronJobLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobLogId!]!) {
        forceDeleteByIdsCronJobLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCronJobLog;
  return res;
}

export async function findAllCronJob(
  search?: CronJobSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCronJob: Query["findAllCronJob"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCronJob(search: $search, page: $page, sort: $sort) {
          id
          lbl
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllCronJob;
  return res;
}

export async function getCronJobList() {
  const data = await findAllCronJob(
    {
      is_enabled: [ 1 ],
    },
    undefined,
    [
      {
        prop: "order_by",
        order: "ascending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

/**
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsCronJobLog {
            cron_job_id_lbl
            exec_state_lbl
            exec_result
            begin_time_lbl
            end_time_lbl
            rem
          }
          findAllCronJob {
            id
            lbl
          }
          getDict(codes: [
            "cron_job_log_exec_state",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/cron/cron_job_log.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("任务执行日志") }${ await nsAsync("导入") }`);
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 导出Excel
 */
export function useExportExcel(routePath: string) {
  const {
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: CronJobLogSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: CronJobLogSearch, $sort: [SortInput!]) {
          findAllCronJobLog(search: $search, sort: $sort) {
            id
            cron_job_id
            cron_job_id_lbl
            exec_state
            exec_state_lbl
            exec_result
            begin_time
            begin_time_lbl
            end_time
            end_time_lbl
            rem
            create_time
            create_time_lbl
          }
          getFieldCommentsCronJobLog {
            cron_job_id_lbl
            exec_state_lbl
            exec_result
            begin_time_lbl
            end_time_lbl
            rem
            create_time_lbl
          }
          findAllCronJob {
            lbl
          }
          getDict(codes: [
            "cron_job_log_exec_state",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
        search,
        sort,
      },
    }, opt);
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/cron/cron_job_log.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("任务执行日志"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
      throw err;
    }
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CronJobLogInput = {
    exec_state: CronJobLogExecState.Running,
  };
  return defaultInput;
}
