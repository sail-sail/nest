import {
  type Query,
  type Mutation,
  type PageInput,
  type BackgroundTaskModel,
  type BackgroundTaskSearch,
  type BackgroundTaskInput,
} from "#/types";

import {
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
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
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllBackgroundTask;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
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
  const result = data.findCountBackgroundTask;
  return result;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findByIdBackgroundTask: Query["findByIdBackgroundTask"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
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
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdBackgroundTask;
  return result;
}

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsBackgroundTask: Mutation["deleteByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsBackgroundTask;
  return result;
}

/**
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsBackgroundTask: Mutation["revertByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsBackgroundTask;
  return result;
}

/**
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsBackgroundTask: Mutation["forceDeleteByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsBackgroundTask;
  return result;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: Query["findAllUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
  const result = data.findAllUsr;
  return result;
}

export async function getUsrList() {
  const data = await findAllUsr(
    undefined,
    {
    },
    [
      {
        prop: "",
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
  const route = useRoute();
  const {
    nAsync,
    nsAsync,
  } = useI18n(route.path);
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
    const queryStr = getQueryUrl({
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
          }
          getFieldCommentsBackgroundTask {
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
        `${ location.origin }${ queryStr }`,
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
