import {
  type Query,
  type Mutation,
  type PageInput,
  type Dict_DetailModel,
  type Dict_DetailSearch,
  type Dict_DetailInput,
} from "#/types";

import {
  type DictSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {Dict_DetailSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: Dict_DetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDict_detail: Query["findAllDict_detail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: Dict_DetailSearch, $page: PageInput, $sort: [SortInput]) {
        findAllDict_detail(search: $search, page: $page, sort: $sort) {
          id
          dict_id
          _dict_id
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
  const result = data.findAllDict_detail;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {Dict_DetailSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: Dict_DetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDict_detail: Query["findCountDict_detail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: Dict_DetailSearch) {
        findCountDict_detail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountDict_detail;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {Dict_DetailInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: Dict_DetailInput,
  opt?: GqlOpt,
) {
  const data: {
    createDict_detail: Mutation["createDict_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: Dict_DetailInput!) {
        createDict_detail(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createDict_detail;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {Dict_DetailInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: Dict_DetailInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdDict_detail: Mutation["updateByIdDict_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: Dict_DetailInput!) {
        updateByIdDict_detail(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdDict_detail;
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
    findByIdDict_detail: Query["findByIdDict_detail"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdDict_detail(id: $id) {
          id
          dict_id
          _dict_id
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
  const result = data.findByIdDict_detail;
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
    deleteByIdsDict_detail: Mutation["deleteByIdsDict_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsDict_detail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsDict_detail;
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
    lockByIdsDict_detail: Mutation["lockByIdsDict_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIdsDict_detail(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result = data.lockByIdsDict_detail;
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
    revertByIdsDict_detail: Mutation["revertByIdsDict_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsDict_detail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsDict_detail;
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
    forceDeleteByIdsDict_detail: Mutation["forceDeleteByIdsDict_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsDict_detail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsDict_detail;
  return result;
}

export async function findAllDict(
  search?: DictSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDict: Query["findAllDict"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictSearch, $page: PageInput, $sort: [SortInput]) {
        findAllDict(search: $search, page: $page, sort: $sort) {
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
  const result = data.findAllDict;
  return result;
}

export async function getDictList() {
  const data = await findAllDict(
    undefined,
    {
    },
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
 * 导出Excel
 */
export function useExportExcel() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: Dict_DetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: Dict_DetailSearch, $sort: [SortInput]) {
          findAllDict_detail(search: $search, sort: $sort) {
            id
            dict_id
            _dict_id
            lbl
            val
            order_by
            is_enabled
            _is_enabled
            rem
            is_locked
            _is_locked
          }
          getFieldCommentsDict_detail {
            dict_id
            _dict_id
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
        sort,
      },
    }, opt);
    const buffer = await workerFn(
      `${ location.origin }/excel_template/dict_detail.xlsx`,
      `${ location.origin }${ queryStr }`,
    );
    saveAsExcel(buffer, "系统字典明细");
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
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
    importFileDict_detail: Mutation["importFileDict_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileDict_detail(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileDict_detail;
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
    findLastOrderByDict_detail: Query["findLastOrderByDict_detail"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDict_detail
      }
    `,
  }, opt);
  const result = data.findLastOrderByDict_detail;
  return result;
}
