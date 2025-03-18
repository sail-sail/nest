

import {
  CronJobLogExecState,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  cronJobLogQueryField,
} from "./Model";

async function setLblById(
  model?: CronJobLogModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: CronJobLogInput,
) {
  const input: CronJobLogInput = {
    // ID
    id: model?.id,
    // 定时任务
    cron_job_id: model?.cron_job_id,
    cron_job_id_lbl: model?.cron_job_id_lbl,
    // 执行状态
    exec_state: model?.exec_state,
    exec_state_lbl: model?.exec_state_lbl,
    // 执行结果
    exec_result: model?.exec_result,
    // 开始时间
    begin_time: model?.begin_time,
    begin_time_lbl: model?.begin_time_lbl,
    begin_time_save_null: model?.begin_time_save_null,
    // 结束时间
    end_time: model?.end_time,
    end_time_lbl: model?.end_time_lbl,
    end_time_save_null: model?.end_time_save_null,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找定时任务日志列表
 */
export async function findAll(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCronJobLog: CronJobLogModel[];
  } = await query({
    query: `
      query($search: CronJobLogSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCronJobLog(search: $search, page: $page, sort: $sort) {
          ${ cronJobLogQueryField }
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
 * 根据条件查找第一个定时任务日志
 */
export async function findOne(
  search?: CronJobLogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCronJobLog?: CronJobLogModel;
  } = await query({
    query: `
      query($search: CronJobLogSearch, $sort: [SortInput!]) {
        findOneCronJobLog(search: $search, sort: $sort) {
          ${ cronJobLogQueryField }
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
 * 根据搜索条件查找定时任务日志总数
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
 * 根据 id 查找定时任务日志
 */
export async function findById(
  id?: CronJobLogId,
  opt?: GqlOpt,
): Promise<CronJobLogModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdCronJobLog?: CronJobLogModel;
  } = await query({
    query: `
      query($id: CronJobLogId!) {
        findByIdCronJobLog(id: $id) {
          ${ cronJobLogQueryField }
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
 * 根据 ids 查找定时任务日志
 */
export async function findByIds(
  ids: CronJobLogId[],
  opt?: GqlOpt,
): Promise<CronJobLogModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: CronJobLogModel[] = [ ];
  try {
    const data: {
      findByIdsCronJobLog: CronJobLogModel[];
    } = await query({
      query: `
        query($ids: [CronJobLogId!]!) {
          findByIdsCronJobLog(ids: $ids) {
            ${ cronJobLogQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsCronJobLog;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除定时任务日志
 */
export async function deleteByIds(
  ids: CronJobLogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原定时任务日志
 */
export async function revertByIds(
  ids: CronJobLogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除定时任务日志
 */
export async function forceDeleteByIds(
  ids: CronJobLogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
    findAllCronJob: CronJobModel[];
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
 * 导出Excel
 */
export function useExportExcel() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: CronJobLogSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: CronJobLogSearch, $sort: [SortInput!]) {
            findAllCronJobLog(search: $search, page: null, sort: $sort) {
              ${ cronJobLogQueryField }
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
      for (const model of data.findAllCronJobLog) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "定时任务日志";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/cron/cron_job_log.xlsx`,
          {
            sheetName,
            columns,
            data,
          },
        );
        saveAsExcel(buffer, sheetName);
      } catch (err) {
        ElMessage.error("导出失败");
        throw err;
      }
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

export function getPagePath() {
  return "/cron/cron_job_log";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CronJobLogInput = {
    exec_state: CronJobLogExecState.Running,
  };
  return defaultInput;
}
