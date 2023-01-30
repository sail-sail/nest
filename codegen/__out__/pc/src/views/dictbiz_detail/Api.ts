import {
  type Query,
  type Mutation,
  type PageInput,
  type Dictbiz_DetailModel,
  type Dictbiz_DetailSearch,
  type Dictbiz_DetailInput,
} from "#/types";

import {
  type DictbizSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {Dictbiz_DetailSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: Dictbiz_DetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictbiz_detail: Query["findAllDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: Dictbiz_DetailSearch, $page: PageInput, $sort: [SortInput]) {
        findAllDictbiz_detail(search: $search, page: $page, sort: $sort) {
          id
          dictbiz_id
          _dictbiz_id
          lbl
          val
          order_by
          is_enabled
          _is_enabled
          rem
          is_locked
          _is_locked
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllDictbiz_detail;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {Dictbiz_DetailSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: Dictbiz_DetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictbiz_detail: Query["findCountDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: Dictbiz_DetailSearch) {
        findCountDictbiz_detail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountDictbiz_detail;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {Dictbiz_DetailInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: Dictbiz_DetailInput,
  opt?: GqlOpt,
) {
  const data: {
    createDictbiz_detail: Mutation["createDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: Dictbiz_DetailInput!) {
        createDictbiz_detail(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createDictbiz_detail;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {Dictbiz_DetailInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: Dictbiz_DetailInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdDictbiz_detail: Mutation["updateByIdDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: Dictbiz_DetailInput!) {
        updateByIdDictbiz_detail(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdDictbiz_detail;
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
    findByIdDictbiz_detail: Query["findByIdDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdDictbiz_detail(id: $id) {
          id
          dictbiz_id
          _dictbiz_id
          lbl
          val
          order_by
          is_enabled
          _is_enabled
          rem
          is_locked
          _is_locked
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdDictbiz_detail;
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
    deleteByIdsDictbiz_detail: Mutation["deleteByIdsDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsDictbiz_detail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsDictbiz_detail;
  return result;
}

/**
 * 根据 ids 删除数据
 * @export lockByIds
 * @param {string[]} ids
 * @param {0 | 1} lockByIds
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDictbiz_detail: Mutation["lockByIdsDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIdsDictbiz_detail(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result = data.lockByIdsDictbiz_detail;
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
    revertByIdsDictbiz_detail: Mutation["revertByIdsDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsDictbiz_detail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsDictbiz_detail;
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
    forceDeleteByIdsDictbiz_detail: Mutation["forceDeleteByIdsDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsDictbiz_detail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsDictbiz_detail;
  return result;
}

export async function findAllDictbiz(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictbiz: Query["findAllDictbiz"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: DictbizSearch, $page: PageInput, $sort: [SortInput]) {
        findAllDictbiz(search: $search, page: $page, sort: $sort) {
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
  const result = data.findAllDictbiz;
  return result;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {Dictbiz_DetailSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: Dictbiz_DetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    exportExcelDictbiz_detail: Query["exportExcelDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: Dictbiz_DetailSearch, $sort: [SortInput]) {
        exportExcelDictbiz_detail(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result = data.exportExcelDictbiz_detail;
  return result;
}

/**
 * 导入文件
 * @param {File} file
 * @export importFile
 */
export async function importFile(
  file: File,
  opt?: GqlOpt,
) {
  if (!file) return;
  const id = await uploadFile(file, undefined, { type: "tmpfile" });
  if (!id) return;
  const data: {
    importFileDictbiz_detail: Mutation["importFileDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileDictbiz_detail(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileDictbiz_detail;
  return result;
}

/**
 * 查找order_by字段的最大值
 * @export findLastOrderBy
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDictbiz_detail: Query["findLastOrderByDictbiz_detail"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictbiz_detail
      }
    `,
  }, opt);
  const result = data.findLastOrderByDictbiz_detail;
  return result;
}
