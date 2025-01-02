

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  operationRecordQueryField,
} from "./Model";

async function setLblById(
  model?: OperationRecordModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: OperationRecordInput,
) {
  const input: OperationRecordInput = {
    // ID
    id: model?.id,
    // 模块
    module: model?.module,
    // 模块名称
    module_lbl: model?.module_lbl,
    // 方法
    method: model?.method,
    // 方法名称
    method_lbl: model?.method_lbl,
    // 操作
    lbl: model?.lbl,
    // 耗时(毫秒)
    time: model?.time,
    // 操作前数据
    old_data: model?.old_data,
    // 操作后数据
    new_data: model?.new_data,
  };
  return input;
}

/**
 * 根据搜索条件查找操作记录列表
 */
export async function findAll(
  search?: OperationRecordSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOperationRecord: OperationRecordModel[];
  } = await query({
    query: `
      query($search: OperationRecordSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOperationRecord(search: $search, page: $page, sort: $sort) {
          ${ operationRecordQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllOperationRecord;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个操作记录
 */
export async function findOne(
  search?: OperationRecordSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneOperationRecord?: OperationRecordModel;
  } = await query({
    query: `
      query($search: OperationRecordSearch, $sort: [SortInput!]) {
        findOneOperationRecord(search: $search, sort: $sort) {
          ${ operationRecordQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneOperationRecord;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找操作记录总数
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
  const count = data.findCountOperationRecord;
  return count;
}

/**
 * 根据 id 查找操作记录
 */
export async function findById(
  id: OperationRecordId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdOperationRecord?: OperationRecordModel;
  } = await query({
    query: `
      query($id: OperationRecordId!) {
        findByIdOperationRecord(id: $id) {
          ${ operationRecordQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdOperationRecord;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除操作记录
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
 * 根据 ids 还原操作记录
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
 * 下载操作记录导入模板
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
          getFieldCommentsOperationRecord {
            module
            module_lbl
            method
            method_lbl
            lbl
            time
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("操作记录");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/operation_record.xlsx`,
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
    search?: OperationRecordSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: OperationRecordSearch, $sort: [SortInput!]) {
            findAllOperationRecord(search: $search, page: null, sort: $sort) {
              ${ operationRecordQueryField }
            }
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAllOperationRecord) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("操作记录");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/operation_record.xlsx`,
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

export function getPagePath() {
  return "/base/operation_record";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: OperationRecordInput = {
    time: 0,
  };
  return defaultInput;
}
