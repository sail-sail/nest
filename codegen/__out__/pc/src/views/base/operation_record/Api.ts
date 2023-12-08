import type {
  OperationRecordId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  OperationRecordSearch,
} from "#/types";

/**
 * 根据搜索条件查找操作记录列表
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
 * 根据搜索条件查找第一个操作记录
 * @export findOne
 * @param {OperationRecordSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: OperationRecordSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneOperationRecord: Query["findOneOperationRecord"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OperationRecordSearch, $sort: [SortInput!]) {
        findOneOperationRecord(search: $search, sort: $sort) {
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
      sort,
    },
  }, opt);
  const model = data.findOneOperationRecord;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找操作记录总数
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
 * 通过ID查找一条操作记录
 * @export findById
 * @param {OperationRecordId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: OperationRecordId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdOperationRecord: Query["findByIdOperationRecord"];
  } = await query({
    query: /* GraphQL */ `
      query($id: OperationRecordId!) {
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
 * 根据 ids 删除操作记录
 * @export deleteByIds
 * @param {OperationRecordId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: OperationRecordId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsOperationRecord: Mutation["deleteByIdsOperationRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OperationRecordId!]!) {
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
 * 根据 ids 从回收站还原操作记录
 * @export revertByIds
 * @param {OperationRecordId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: OperationRecordId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsOperationRecord: Mutation["revertByIdsOperationRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OperationRecordId!]!) {
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
 * 根据 ids 彻底删除操作记录
 * @export forceDeleteByIds
 * @param {OperationRecordId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: OperationRecordId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsOperationRecord: Mutation["forceDeleteByIdsOperationRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OperationRecordId!]!) {
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
          getFieldCommentsOperationRecord {
            module
            module_lbl
            method
            method_lbl
            lbl
            old_data
            new_data
            rem
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/operation_record.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("操作记录") }${ await nsAsync("导入") }`);
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
    search?: OperationRecordSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
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
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
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
        {
          data,
        },
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
