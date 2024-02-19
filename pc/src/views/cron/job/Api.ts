import {
  UniqueType,
} from "#/types";

import type {
  JobId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  JobSearch,
  JobInput,
  JobModel,
} from "#/types";

async function setLblById(
  model?: JobModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找任务列表
 * @param {JobSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: JobSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllJob: Query["findAllJob"];
  } = await query({
    query: /* GraphQL */ `
      query($search: JobSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllJob(search: $search, page: $page, sort: $sort) {
          id
          code
          lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
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
  const models = data.findAllJob;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个任务
 * @param {JobSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: JobSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneJob: Query["findOneJob"];
  } = await query({
    query: /* GraphQL */ `
      query($search: JobSearch, $sort: [SortInput!]) {
        findOneJob(search: $search, sort: $sort) {
          id
          code
          lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
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
 * 根据搜索条件查找任务总数
 * @param {JobSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
 * 创建任务
 * @param {JobInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: JobInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<JobId> {
  const data: {
    createJob: Mutation["createJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: JobInput!, $unique_type: UniqueType) {
        createJob(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: JobId = data.createJob;
  return id;
}

/**
 * 根据 id 修改任务
 * @param {JobId} id
 * @param {JobInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: JobId,
  model: JobInput,
  opt?: GqlOpt,
): Promise<JobId> {
  const data: {
    updateByIdJob: Mutation["updateByIdJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: JobId!, $model: JobInput!) {
        updateByIdJob(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: JobId = data.updateByIdJob;
  return id2;
}

/**
 * 根据 id 查找任务
 * @param {JobId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: JobId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdJob: Query["findByIdJob"];
  } = await query({
    query: /* GraphQL */ `
      query($id: JobId!) {
        findByIdJob(id: $id) {
          id
          code
          lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
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
 * 根据 ids 删除任务
 * @param {JobId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: JobId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用任务
 * @param {JobId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: JobId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁任务
 * @param {JobId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: JobId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原任务
 * @param {JobId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: JobId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除任务
 * @param {JobId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: JobId[],
  opt?: GqlOpt,
) {
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
 * 下载导入模板
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
      const sheetName = await nsAsync("任务");
      const buffer = await workerFn(
        `${ location.origin }/import_template/cron/job.xlsx`,
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
    search?: JobSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: JobSearch, $sort: [SortInput!]) {
            findAllJob(search: $search, sort: $sort) {
              id
              code
              lbl
              is_locked
              is_locked_lbl
              is_enabled
              is_enabled_lbl
              order_by
              rem
              create_usr_id
              create_usr_id_lbl
              create_time
              create_time_lbl
              update_usr_id
              update_usr_id_lbl
              update_time
              update_time_lbl
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
      try {
        const sheetName = await nsAsync("任务");
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

/**
 * 批量导入
 * @param {JobInput[]} models
 */
export async function importModels(
  models: JobInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  for (let i = 0; i < models.length; i++) {
    if (isCancel.value) {
      break;
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
    
    const item = models[i];
    
    opt = opt || { };
    opt.showErrMsg = false;
    opt.notLoading = true;
    
    try {
      await create(
        item,
        UniqueType.Update,
        opt,
      );
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 任务 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: JobInput = {
    is_locked: 1,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
