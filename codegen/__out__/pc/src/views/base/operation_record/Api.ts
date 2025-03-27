

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  operationRecordQueryField,
} from "./Model.ts";

async function setLblById(
  model?: OperationRecordModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputOperationRecord(
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
 * 根据搜索条件查找 操作记录 列表
 */
export async function findAllOperationRecord(
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
export async function findOneOperationRecord(
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
 * 根据搜索条件查找 操作记录 总数
 */
export async function findCountOperationRecord(
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
 * 根据 id 查找 操作记录
 */
export async function findByIdOperationRecord(
  id?: OperationRecordId,
  opt?: GqlOpt,
): Promise<OperationRecordModel | undefined> {
  if (!id) {
    return;
  }
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
 * 根据 ids 查找 操作记录
 */
export async function findByIdsOperationRecord(
  ids: OperationRecordId[],
  opt?: GqlOpt,
): Promise<OperationRecordModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: OperationRecordModel[] = [ ];
  try {
    const data: {
      findByIdsOperationRecord: OperationRecordModel[];
    } = await query({
      query: `
        query($ids: [OperationRecordId!]!) {
          findByIdsOperationRecord(ids: $ids) {
            ${ operationRecordQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsOperationRecord;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除 操作记录
 */
export async function deleteByIdsOperationRecord(
  ids: OperationRecordId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原 操作记录
 */
export async function revertByIdsOperationRecord(
  ids: OperationRecordId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除 操作记录
 */
export async function forceDeleteByIdsOperationRecord(
  ids: OperationRecordId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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

export function getPagePathOperationRecord() {
  return "/base/operation_record";
}

/** 新增时的默认值 */
export async function getDefaultInputOperationRecord() {
  const defaultInput: OperationRecordInput = {
    time: 0,
  };
  return defaultInput;
}
