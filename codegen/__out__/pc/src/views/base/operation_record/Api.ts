import {
  UniqueType,
  type Query,
  type Mutation,
  type PageInput,
  type OperationRecordSearch,
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
    findAllOperationRecord: Query["findAllOperationRecord"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OperationRecordSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOperationRecord(search: $search, page: $page, sort: $sort) {
          id
          module
          module_lbl
          method
          method_lbl
          lbl
          old_data
          new_data
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
  const res = data.findAllOperationRecord;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
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
    findCountOperationRecord: Query["findCountOperationRecord"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OperationRecordSearch) {
        findCountOperationRecord(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountOperationRecord;
  return res;
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
    findByIdOperationRecord: Query["findByIdOperationRecord"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdOperationRecord(id: $id) {
          id
          module
          module_lbl
          method
          method_lbl
          lbl
          old_data
          new_data
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
  const res = data.findByIdOperationRecord;
  return res;
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
    deleteByIdsOperationRecord: Mutation["deleteByIdsOperationRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsOperationRecord(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsOperationRecord;
  return res;
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
    revertByIdsOperationRecord: Mutation["revertByIdsOperationRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsOperationRecord(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsOperationRecord;
  return res;
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
    forceDeleteByIdsOperationRecord: Mutation["forceDeleteByIdsOperationRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsOperationRecord(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsOperationRecord;
  return res;
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
  const res = data.findAllUsr;
  return res;
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
    search?: OperationRecordSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: OperationRecordSearch, $sort: [SortInput!]) {
          findAllOperationRecord(search: $search, sort: $sort) {
            id
            module
            module_lbl
            method
            method_lbl
            lbl
            old_data
            new_data
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
          getFieldCommentsOperationRecord {
            module
            module_lbl
            method
            method_lbl
            lbl
            old_data
            new_data
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
