
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  cronJobQueryField,
} from "./Model.ts";

async function setLblById(
  model?: CronJobModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputCronJob(
  model?: CronJobInput,
) {
  const input: CronJobInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 任务
    job_id: model?.job_id,
    job_id_lbl: model?.job_id_lbl,
    // Cron表达式
    cron: model?.cron,
    // 时区
    timezone: model?.timezone,
    timezone_lbl: model?.timezone_lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 定时任务 列表
 */
export async function findAllCronJob(
  search?: CronJobSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCronJob: CronJobModel[];
  } = await query({
    query: `
      query($search: CronJobSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCronJob(search: $search, page: $page, sort: $sort) {
          ${ cronJobQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllCronJob;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 定时任务
 */
export async function findOneCronJob(
  search?: CronJobSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneCronJob?: CronJobModel;
  } = await query({
    query: `
      query($search: CronJobSearch, $sort: [SortInput!]) {
        findOneCronJob(search: $search, sort: $sort) {
          ${ cronJobQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneCronJob;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 定时任务, 如果不存在则抛错
 */
export async function findOneOkCronJob(
  search?: CronJobSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkCronJob?: CronJobModel;
  } = await query({
    query: `
      query($search: CronJobSearch, $sort: [SortInput!]) {
        findOneOkCronJob(search: $search, sort: $sort) {
          ${ cronJobQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkCronJob;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 定时任务 总数
 */
export async function findCountCronJob(
  search?: CronJobSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCronJob: Query["findCountCronJob"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobSearch) {
        findCountCronJob(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCronJob;
  return count;
}

/**
 * 创建 定时任务
 */
export async function createCronJob(
  input: CronJobInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CronJobId> {
  const ids = await createsCronJob(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 定时任务
 */
export async function createsCronJob(
  inputs: CronJobInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CronJobId[]> {
  inputs = inputs.map(intoInputCronJob);
  const data: {
    createsCronJob: Mutation["createsCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [CronJobInput!]!, $unique_type: UniqueType) {
        createsCronJob(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsCronJob;
  return ids;
}

/**
 * 根据 id 修改 定时任务
 */
export async function updateByIdCronJob(
  id: CronJobId,
  input: CronJobInput,
  opt?: GqlOpt,
): Promise<CronJobId> {
  input = intoInputCronJob(input);
  const data: {
    updateByIdCronJob: Mutation["updateByIdCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: CronJobId!, $input: CronJobInput!) {
        updateByIdCronJob(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: CronJobId = data.updateByIdCronJob;
  return id2;
}

/**
 * 根据 id 查找 定时任务
 */
export async function findByIdCronJob(
  id: CronJobId,
  opt?: GqlOpt,
): Promise<CronJobModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdCronJob?: CronJobModel;
  } = await query({
    query: `
      query($id: CronJobId!) {
        findByIdCronJob(id: $id) {
          ${ cronJobQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdCronJob;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 定时任务, 如果不存在则抛错
 */
export async function findByIdOkCronJob(
  id: CronJobId,
  opt?: GqlOpt,
): Promise<CronJobModel> {
  
  const data: {
    findByIdOkCronJob: CronJobModel;
  } = await query({
    query: `
      query($id: CronJobId!) {
        findByIdOkCronJob(id: $id) {
          ${ cronJobQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkCronJob;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 定时任务
 */
export async function findByIdsCronJob(
  ids: CronJobId[],
  opt?: GqlOpt,
): Promise<CronJobModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsCronJob: CronJobModel[];
  } = await query({
    query: `
      query($ids: [CronJobId!]!) {
        findByIdsCronJob(ids: $ids) {
          ${ cronJobQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsCronJob;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 定时任务, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCronJob(
  ids: CronJobId[],
  opt?: GqlOpt,
): Promise<CronJobModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkCronJob: CronJobModel[];
  } = await query({
    query: `
      query($ids: [CronJobId!]!) {
        findByIdsOkCronJob(ids: $ids) {
          ${ cronJobQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkCronJob;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 定时任务
 */
export async function deleteByIdsCronJob(
  ids: CronJobId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsCronJob: Mutation["deleteByIdsCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobId!]!) {
        deleteByIdsCronJob(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCronJob;
  return res;
}

/**
 * 根据 ids 启用或禁用 定时任务
 */
export async function enableByIdsCronJob(
  ids: CronJobId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsCronJob: Mutation["enableByIdsCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobId!]!, $is_enabled: Int!) {
        enableByIdsCronJob(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsCronJob;
  return res;
}

/**
 * 根据 ids 锁定或解锁 定时任务
 */
export async function lockByIdsCronJob(
  ids: CronJobId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsCronJob: Mutation["lockByIdsCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobId!]!, $is_locked: Int!) {
        lockByIdsCronJob(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsCronJob;
  return res;
}

/**
 * 根据 ids 还原 定时任务
 */
export async function revertByIdsCronJob(
  ids: CronJobId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsCronJob: Mutation["revertByIdsCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobId!]!) {
        revertByIdsCronJob(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCronJob;
  return res;
}

/**
 * 根据 ids 彻底删除 定时任务
 */
export async function forceDeleteByIdsCronJob(
  ids: CronJobId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsCronJob: Mutation["forceDeleteByIdsCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CronJobId!]!) {
        forceDeleteByIdsCronJob(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCronJob;
  return res;
}

export async function findAllJob(
  search?: JobSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllJob: JobModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: JobSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllJob(search: $search, page: $page, sort: $sort) {
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
  const job_models = data.findAllJob;
  return job_models;
}

export async function getListJob() {
  const data = await findAllJob(
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
 * 下载 定时任务 导入模板
 */
export function useDownloadImportTemplateCronJob() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsCronJob {
            lbl
            job_id_lbl
            cron
            timezone_lbl
            order_by
            rem
          }
          findAllJob {
            id
            lbl
          }
          getDict(codes: [
            "cron_job_timezone",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "定时任务";
      const buffer = await workerFn(
        `${ location.origin }/import_template/cron/cron_job.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName}导入`);
    } catch (err) {
      ElMessage.error("下载失败");
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
export function useExportExcelCronJob() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: CronJobSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: CronJobSearch, $sort: [SortInput!]) {
            findAllCronJob(search: $search, page: null, sort: $sort) {
              ${ cronJobQueryField }
            }
            findAllJob {
              lbl
            }
            getDict(codes: [
              "cron_job_timezone",
              "is_locked",
              "is_enabled",
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
      for (const model of data.findAllCronJob) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "定时任务";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/cron/cron_job.xlsx`,
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

/**
 * 批量导入 定时任务
 */
export async function importModelsCronJob(
  inputs: CronJobInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  opt = opt || { };
  opt.showErrMsg = false;
  opt.notLoading = true;
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  const len = inputs.length;
  const inputsArr = splitCreateArr(inputs);
  
  let i = 0;
  for (const inputs of inputsArr) {
    if (isCancel.value) {
      break;
    }
    
    i += inputs.length;
    
    try {
      await createsCronJob(
        inputs,
        UniqueType.Update,
        opt,
      );
      succNum += inputs.length;
    } catch (err) {
      failNum += inputs.length;
      failErrMsgs.push(`批量导入第 ${ i + 1 - inputs.length } 至 ${ i + 1 } 行时失败: ${ err }`);
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 定时任务 order_by 字段的最大值
 */
export async function findLastOrderByCronJob(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByCronJob: Query["findLastOrderByCronJob"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByCronJob
      }
    `,
  }, opt);
  const res = data.findLastOrderByCronJob;
  return res;
}

export function getPagePathCronJob() {
  return "/cron/cron_job";
}

/** 新增时的默认值 */
export async function getDefaultInputCronJob() {
  const defaultInput: CronJobInput = {
    timezone: "Asia/Shanghai",
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
