import type {
  BackgroundTaskId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  BackgroundTaskSearch,
  BackgroundTaskModel,
} from "#/types";

async function setLblById(
  model?: BackgroundTaskModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找后台任务列表
 * @param {BackgroundTaskSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllBackgroundTask: Query["findAllBackgroundTask"];
  } = await query({
    query: /* GraphQL */ `
      query($search: BackgroundTaskSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllBackgroundTask(search: $search, page: $page, sort: $sort) {
          id
          lbl
          state
          state_lbl
          type
          type_lbl
          result
          err_msg
          begin_time
          begin_time_lbl
          end_time
          end_time_lbl
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
  const models = data.findAllBackgroundTask;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个后台任务
 * @param {BackgroundTaskSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: BackgroundTaskSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneBackgroundTask: Query["findOneBackgroundTask"];
  } = await query({
    query: /* GraphQL */ `
      query($search: BackgroundTaskSearch, $sort: [SortInput!]) {
        findOneBackgroundTask(search: $search, sort: $sort) {
          id
          lbl
          state
          state_lbl
          type
          type_lbl
          result
          err_msg
          begin_time
          begin_time_lbl
          end_time
          end_time_lbl
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
  const model = data.findOneBackgroundTask;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找后台任务总数
 * @param {BackgroundTaskSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: BackgroundTaskSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountBackgroundTask: Query["findCountBackgroundTask"];
  } = await query({
    query: /* GraphQL */ `
      query($search: BackgroundTaskSearch) {
        findCountBackgroundTask(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountBackgroundTask;
  return count;
}

/**
 * 根据 id 查找后台任务
 * @param {BackgroundTaskId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: BackgroundTaskId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdBackgroundTask: Query["findByIdBackgroundTask"];
  } = await query({
    query: /* GraphQL */ `
      query($id: BackgroundTaskId!) {
        findByIdBackgroundTask(id: $id) {
          id
          lbl
          state
          state_lbl
          type
          type_lbl
          result
          err_msg
          begin_time
          begin_time_lbl
          end_time
          end_time_lbl
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
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdBackgroundTask;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除后台任务
 * @param {BackgroundTaskId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: BackgroundTaskId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsBackgroundTask: Mutation["deleteByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BackgroundTaskId!]!) {
        deleteByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsBackgroundTask;
  return res;
}

/**
 * 根据 ids 还原后台任务
 * @param {BackgroundTaskId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: BackgroundTaskId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsBackgroundTask: Mutation["revertByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BackgroundTaskId!]!) {
        revertByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsBackgroundTask;
  return res;
}

/**
 * 根据 ids 彻底删除后台任务
 * @param {BackgroundTaskId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: BackgroundTaskId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsBackgroundTask: Mutation["forceDeleteByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BackgroundTaskId!]!) {
        forceDeleteByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsBackgroundTask;
  return res;
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
          getFieldCommentsBackgroundTask {
            lbl
            state_lbl
            type_lbl
            result
            err_msg
            begin_time_lbl
            end_time_lbl
            rem
          }
          getDict(codes: [
            "background_task_state",
            "background_task_type",
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
      `${ location.origin }/import_template/base/background_task.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("后台任务") }${ await nsAsync("导入") }`);
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
    search?: BackgroundTaskSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: BackgroundTaskSearch, $sort: [SortInput!]) {
          findAllBackgroundTask(search: $search, sort: $sort) {
            id
            lbl
            state
            state_lbl
            type
            type_lbl
            result
            err_msg
            begin_time
            begin_time_lbl
            end_time
            end_time_lbl
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
          getFieldCommentsBackgroundTask {
            lbl
            state_lbl
            type_lbl
            result
            err_msg
            begin_time_lbl
            end_time_lbl
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          getDict(codes: [
            "background_task_state",
            "background_task_type",
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
        `${ location.origin }/excel_template/base/background_task.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("后台任务"));
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
