
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  jobQueryField,
} from "./Model.ts";

async function setLblById(
  model?: JobModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputJob(
  model?: JobInput,
) {
  const input: JobInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
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
 * 根据搜索条件查找 任务 列表
 */
export async function findAllJob(
  search?: JobSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllJob: JobModel[];
  } = await query({
    query: `
      query($search: JobSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllJob(search: $search, page: $page, sort: $sort) {
          ${ jobQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllJob;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个任务
 */
export async function findOneJob(
  search?: JobSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneJob?: JobModel;
  } = await query({
    query: `
      query($search: JobSearch, $sort: [SortInput!]) {
        findOneJob(search: $search, sort: $sort) {
          ${ jobQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneJob;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找 任务 总数
 */
export async function findCountJob(
  search?: JobSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountJob: Query["findCountJob"];
  } = await query({
    query: /* GraphQL */ `
      query($search: JobSearch) {
        findCountJob(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountJob;
  return count;
}

/**
 * 创建 任务
 */
export async function createJob(
  input: JobInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<JobId> {
  const ids = await createsJob(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 任务
 */
export async function createsJob(
  inputs: JobInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<JobId[]> {
  inputs = inputs.map(intoInputJob);
  const data: {
    createsJob: Mutation["createsJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [JobInput!]!, $unique_type: UniqueType) {
        createsJob(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsJob;
  return ids;
}

/**
 * 根据 id 修改 任务
 */
export async function updateByIdJob(
  id: JobId,
  input: JobInput,
  opt?: GqlOpt,
): Promise<JobId> {
  input = intoInputJob(input);
  const data: {
    updateByIdJob: Mutation["updateByIdJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: JobId!, $input: JobInput!) {
        updateByIdJob(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: JobId = data.updateByIdJob;
  return id2;
}

/**
 * 根据 id 查找 任务
 */
export async function findByIdJob(
  id?: JobId,
  opt?: GqlOpt,
): Promise<JobModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdJob?: JobModel;
  } = await query({
    query: `
      query($id: JobId!) {
        findByIdJob(id: $id) {
          ${ jobQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdJob;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找 任务
 */
export async function findByIdsJob(
  ids: JobId[],
  opt?: GqlOpt,
): Promise<JobModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: JobModel[] = [ ];
  try {
    const data: {
      findByIdsJob: JobModel[];
    } = await query({
      query: `
        query($ids: [JobId!]!) {
          findByIdsJob(ids: $ids) {
            ${ jobQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsJob;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除 任务
 */
export async function deleteByIdsJob(
  ids: JobId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsJob: Mutation["deleteByIdsJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [JobId!]!) {
        deleteByIdsJob(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsJob;
  return res;
}

/**
 * 根据 ids 启用或禁用 任务
 */
export async function enableByIdsJob(
  ids: JobId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsJob: Mutation["enableByIdsJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [JobId!]!, $is_enabled: Int!) {
        enableByIdsJob(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsJob;
  return res;
}

/**
 * 根据 ids 锁定或解锁 任务
 */
export async function lockByIdsJob(
  ids: JobId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsJob: Mutation["lockByIdsJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [JobId!]!, $is_locked: Int!) {
        lockByIdsJob(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsJob;
  return res;
}

/**
 * 根据 ids 还原 任务
 */
export async function revertByIdsJob(
  ids: JobId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsJob: Mutation["revertByIdsJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [JobId!]!) {
        revertByIdsJob(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsJob;
  return res;
}

/**
 * 根据 ids 彻底删除 任务
 */
export async function forceDeleteByIdsJob(
  ids: JobId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsJob: Mutation["forceDeleteByIdsJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [JobId!]!) {
        forceDeleteByIdsJob(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsJob;
  return res;
}

/**
 * 下载 任务 导入模板
 */
export function useDownloadImportTemplateJob() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsJob {
            code
            lbl
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "任务";
      const buffer = await workerFn(
        `${ location.origin }/import_template/cron/job.xlsx`,
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
export function useExportExcelJob() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: JobSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: JobSearch, $sort: [SortInput!]) {
            findAllJob(search: $search, page: null, sort: $sort) {
              ${ jobQueryField }
            }
            getDict(codes: [
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
      for (const model of data.findAllJob) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "任务";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/cron/job.xlsx`,
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
 * 批量导入 任务
 */
export async function importModelsJob(
  inputs: JobInput[],
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
      await createsJob(
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
 * 查找 任务 order_by 字段的最大值
 */
export async function findLastOrderByJob(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByJob: Query["findLastOrderByJob"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByJob
      }
    `,
  }, opt);
  const res = data.findLastOrderByJob;
  return res;
}

export function getPagePathJob() {
  return "/cron/job";
}

/** 新增时的默认值 */
export async function getDefaultInputJob() {
  const defaultInput: JobInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
