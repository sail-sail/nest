import {
  type Query,
  type Mutation,
  type PageInput,
  type Background_TaskModel,
  type Background_TaskSearch,
  type Background_TaskInput,
} from "#/types";

import saveAs from "file-saver";

import {
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {Background_TaskSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: Background_TaskSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllBackground_task: Query["findAllBackground_task"];
  } = await query({
    query: /* GraphQL */ `
      query($search: Background_TaskSearch, $page: PageInput, $sort: [SortInput]) {
        findAllBackground_task(search: $search, page: $page, sort: $sort) {
          id
          lbl
          state
          _state
          type
          _type
          result
          err_msg
          begin_time
          end_time
          rem
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllBackground_task;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {Background_TaskSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: Background_TaskSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountBackground_task: Query["findCountBackground_task"];
  } = await query({
    query: /* GraphQL */ `
      query($search: Background_TaskSearch) {
        findCountBackground_task(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountBackground_task;
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
    findByIdBackground_task: Query["findByIdBackground_task"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdBackground_task(id: $id) {
          id
          lbl
          state
          _state
          type
          _type
          result
          err_msg
          begin_time
          end_time
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdBackground_task;
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
    deleteByIdsBackground_task: Mutation["deleteByIdsBackground_task"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsBackground_task(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsBackground_task;
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
    revertByIdsBackground_task: Mutation["revertByIdsBackground_task"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsBackground_task(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsBackground_task;
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
    forceDeleteByIdsBackground_task: Mutation["forceDeleteByIdsBackground_task"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsBackground_task(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsBackground_task;
  return result;
}

/**
 * 导出Excel
 * @export useExportExcel
 * @param {Background_TaskSearch} search?
 * @param {Sort[]} sort?
 */
export function useExportExcel(
  search?: Background_TaskSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const queryStr = getQueryUrl({
    query: /* GraphQL */ `
      query($search: Background_TaskSearch, $sort: [SortInput]) {
        findAllBackground_task(search: $search, sort: $sort) {
          id
          lbl
          state
          _state
          type
          _type
          result
          err_msg
          begin_time
          end_time
          rem
        }
        getFieldCommentsBackground_task {
          lbl
          state
          _state
          type
          _type
          result
          err_msg
          begin_time
          end_time
          rem
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const buffer = await workerFn(
      `${ location.origin }/excel_template/background_task.xlsx`,
      `${ location.origin }${ queryStr }`,
    );
    const blob = new Blob([ buffer ], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "后台任务");
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}
