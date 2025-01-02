

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  cronJobLogDetailQueryField,
} from "./Model";

async function setLblById(
  model?: CronJobLogDetailModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找定时任务日志明细列表
 */
export async function findAll(
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
export async function findOne(
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
 * 根据搜索条件查找定时任务日志明细总数
 */
export async function findCount(
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
 * 根据 id 查找定时任务日志明细
 */
export async function findById(
  id: CronJobLogDetailId,
  opt?: GqlOpt,
) {
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
 * 根据 ids 删除定时任务日志明细
 */
export async function deleteByIds(
  ids: CronJobLogDetailId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原定时任务日志明细
 */
export async function revertByIds(
  ids: CronJobLogDetailId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除定时任务日志明细
 */
export async function forceDeleteByIds(
  ids: CronJobLogDetailId[],
  opt?: GqlOpt,
) {
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
  const res = data.findAllCronJobLog;
  return res;
}

export async function getCronJobLogList() {
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
 * 下载定时任务日志明细导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
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
          getFieldCommentsCronJobLogDetail {
            cron_job_log_id_lbl
            lbl
          }
          findAllCronJobLog {
            id
            
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("定时任务日志明细");
      const buffer = await workerFn(
        `${ location.origin }/import_template/cron/cron_job_log_detail.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName }${ await nsAsync("导入") }`);
    } catch (err) {
      ElMessage.error(await nsAsync("下载失败"));
      throw err;
    }
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
    nsAsync,
  } = useI18n(routePath);
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
        const sheetName = await nsAsync("定时任务日志明细");
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
        ElMessage.error(await nsAsync("导出失败"));
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
  return "/cron/cron_job_log_detail";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CronJobLogDetailInput = {
  };
  return defaultInput;
}
