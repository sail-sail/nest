

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  cronJobLogDetailQueryField,
} from "./Model.ts";

async function setLblById(
  model?: CronJobLogDetailModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputCronJobLogDetail(
  model?: CronJobLogDetailInput,
) {
  const input: CronJobLogDetailInput = {
    // ID
    id: model?.id,
    // 定时任务日志
    cron_job_log_id: model?.cron_job_log_id,
    // 日志明细
    lbl: model?.lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 定时任务日志明细 列表
 */
export async function findAllCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCronJobLogDetail: CronJobLogDetailModel[];
  } = await query({
    query: `
      query($search: CronJobLogDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCronJobLogDetail(search: $search, page: $page, sort: $sort) {
          ${ cronJobLogDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllCronJobLogDetail;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个定时任务日志明细
 */
export async function findOneCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCronJobLogDetail?: CronJobLogDetailModel;
  } = await query({
    query: `
      query($search: CronJobLogDetailSearch, $sort: [SortInput!]) {
        findOneCronJobLogDetail(search: $search, sort: $sort) {
          ${ cronJobLogDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneCronJobLogDetail;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找 定时任务日志明细 总数
 */
export async function findCountCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCronJobLogDetail: Query["findCountCronJobLogDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobLogDetailSearch) {
        findCountCronJobLogDetail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCronJobLogDetail;
  return count;
}

/**
 * 根据 id 查找 定时任务日志明细
 */
export async function findByIdCronJobLogDetail(
  id?: CronJobLogDetailId,
  opt?: GqlOpt,
): Promise<CronJobLogDetailModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdCronJobLogDetail?: CronJobLogDetailModel;
  } = await query({
    query: `
      query($id: CronJobLogDetailId!) {
        findByIdCronJobLogDetail(id: $id) {
          ${ cronJobLogDetailQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdCronJobLogDetail;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找 定时任务日志明细
 */
export async function findByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
  opt?: GqlOpt,
): Promise<CronJobLogDetailModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: CronJobLogDetailModel[] = [ ];
  try {
    const data: {
      findByIdsCronJobLogDetail: CronJobLogDetailModel[];
    } = await query({
      query: `
        query($ids: [CronJobLogDetailId!]!) {
          findByIdsCronJobLogDetail(ids: $ids) {
            ${ cronJobLogDetailQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsCronJobLogDetail;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除 定时任务日志明细
 */
export async function deleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsCronJobLogDetail: Mutation["deleteByIdsCronJobLogDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobLogDetailId!]!) {
        deleteByIdsCronJobLogDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCronJobLogDetail;
  return res;
}

/**
 * 根据 ids 还原 定时任务日志明细
 */
export async function revertByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsCronJobLogDetail: Mutation["revertByIdsCronJobLogDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobLogDetailId!]!) {
        revertByIdsCronJobLogDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCronJobLogDetail;
  return res;
}

/**
 * 根据 ids 彻底删除 定时任务日志明细
 */
export async function forceDeleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsCronJobLogDetail: Mutation["forceDeleteByIdsCronJobLogDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobLogDetailId!]!) {
        forceDeleteByIdsCronJobLogDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCronJobLogDetail;
  return res;
}

export async function findAllCronJobLog(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCronJobLog: CronJobLogModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobLogSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCronJobLog(search: $search, page: $page, sort: $sort) {
          id
          
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const cron_job_log_models = data.findAllCronJobLog;
  return cron_job_log_models;
}

export async function getListCronJobLog() {
  const data = await findAllCronJobLog(
    undefined,
    undefined,
    [
      {
        prop: "create_time",
        order: "descending",
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
export function useExportExcelCronJobLogDetail() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: CronJobLogDetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: CronJobLogDetailSearch, $sort: [SortInput!]) {
            findAllCronJobLogDetail(search: $search, page: null, sort: $sort) {
              ${ cronJobLogDetailQueryField }
            }
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAllCronJobLogDetail) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "定时任务日志明细";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/cron/cron_job_log_detail.xlsx`,
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

export function getPagePathCronJobLogDetail() {
  return "/cron/cron_job_log_detail";
}

/** 新增时的默认值 */
export async function getDefaultInputCronJobLogDetail() {
  const defaultInput: CronJobLogDetailInput = {
  };
  return defaultInput;
}
