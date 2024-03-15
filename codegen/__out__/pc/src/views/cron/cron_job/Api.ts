import {
  UniqueType,
} from "#/types";

import type {
  CronJobId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  CronJobSearch,
  CronJobInput,
  CronJobModel,
} from "#/types";

import type {
  JobSearch,
} from "#/types";

async function setLblById(
  model?: CronJobModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: CronJobInput = {
    id: model?.id,
    lbl: model?.lbl,
    job_id: model?.job_id,
    job_id_lbl: model?.job_id_lbl,
    cron: model?.cron,
    timezone: model?.timezone,
    timezone_lbl: model?.timezone_lbl,
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    order_by: model?.order_by,
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找定时任务列表
 * @param {CronJobSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
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
          job_id
          job_id_lbl
          cron
          timezone
          timezone_lbl
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
  const models = data.findAllCronJob;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个定时任务
 * @param {CronJobSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: CronJobSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCronJob: Query["findOneCronJob"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CronJobSearch, $sort: [SortInput!]) {
        findOneCronJob(search: $search, sort: $sort) {
          id
          lbl
          job_id
          job_id_lbl
          cron
          timezone
          timezone_lbl
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
  const model = data.findOneCronJob;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找定时任务总数
 * @param {CronJobSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
 * 创建定时任务
 * @param {CronJobInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: CronJobInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CronJobId> {
  input = intoInput(input);
  const data: {
    createCronJob: Mutation["createCronJob"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: CronJobInput!, $unique_type: UniqueType) {
        createCronJob(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: CronJobId = data.createCronJob;
  return id;
}

/**
 * 根据 id 修改定时任务
 * @param {CronJobId} id
 * @param {CronJobInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: CronJobId,
  input: CronJobInput,
  opt?: GqlOpt,
): Promise<CronJobId> {
  input = intoInput(input);
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
 * 根据 id 查找定时任务
 * @param {CronJobId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: CronJobId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCronJob: Query["findByIdCronJob"];
  } = await query({
    query: /* GraphQL */ `
      query($id: CronJobId!) {
        findByIdCronJob(id: $id) {
          id
          lbl
          job_id
          job_id_lbl
          cron
          timezone
          timezone_lbl
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
  const model = data.findByIdCronJob;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除定时任务
 * @param {CronJobId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: CronJobId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用定时任务
 * @param {CronJobId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: CronJobId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁定时任务
 * @param {CronJobId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: CronJobId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原定时任务
 * @param {CronJobId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: CronJobId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除定时任务
 * @param {CronJobId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: CronJobId[],
  opt?: GqlOpt,
) {
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
    findAllJob: Query["findAllJob"];
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
  const res = data.findAllJob;
  return res;
}

export async function getJobList() {
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
      const sheetName = await nsAsync("定时任务");
      const buffer = await workerFn(
        `${ location.origin }/import_template/cron/cron_job.xlsx`,
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
    search?: CronJobSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: CronJobSearch, $sort: [SortInput!]) {
            findAllCronJob(search: $search, sort: $sort) {
              id
              lbl
              job_id
              job_id_lbl
              cron
              timezone
              timezone_lbl
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
      try {
        const sheetName = await nsAsync("定时任务");
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
 * @param {CronJobInput[]} models
 */
export async function importModels(
  models: CronJobInput[],
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
 * 查找 定时任务 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CronJobInput = {
    timezone: "Asia/Shanghai",
    is_locked: 1,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
