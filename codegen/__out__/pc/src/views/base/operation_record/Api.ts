import {
  type Query,
  type Mutation,
  type PageInput,
  type OperationRecordModel,
  type OperationRecordSearch,
  type OperationRecordInput,
} from "#/types";

import {
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {OperationRecordSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: OperationRecordSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOperation_record: Query["findAllOperation_record"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OperationRecordSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOperation_record(search: $search, page: $page, sort: $sort) {
          id
          mod
          mod_lbl
          method
          method_lbl
          lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          update_usr_id
          update_usr_id_lbl
          update_time
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllOperation_record;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {OperationRecordSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: OperationRecordSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOperation_record: Query["findCountOperation_record"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OperationRecordSearch) {
        findCountOperation_record(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountOperation_record;
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
    findByIdOperation_record: Query["findByIdOperation_record"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdOperation_record(id: $id) {
          id
          mod
          mod_lbl
          method
          method_lbl
          lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          update_usr_id
          update_usr_id_lbl
          update_time
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdOperation_record;
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
    deleteByIdsOperation_record: Mutation["deleteByIdsOperation_record"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsOperation_record(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsOperation_record;
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
    revertByIdsOperation_record: Mutation["revertByIdsOperation_record"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsOperation_record(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsOperation_record;
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
    forceDeleteByIdsOperation_record: Mutation["forceDeleteByIdsOperation_record"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsOperation_record(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsOperation_record;
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
    search?: OperationRecordSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: OperationRecordSearch, $sort: [SortInput!]) {
          findAllOperation_record(search: $search, sort: $sort) {
            id
            mod
            mod_lbl
            method
            method_lbl
            lbl
            rem
            create_usr_id
            create_usr_id_lbl
            create_time
            update_usr_id
            update_usr_id_lbl
            update_time
          }
          getFieldCommentsOperation_record {
            mod
            mod_lbl
            method
            method_lbl
            lbl
            rem
            create_usr_id
            create_usr_id_lbl
            create_time
            update_usr_id
            update_usr_id_lbl
            update_time
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
        `${ location.origin }/excel_template/base/operation_record.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("操作记录"));
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
