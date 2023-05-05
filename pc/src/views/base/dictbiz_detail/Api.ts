import {
  type Query,
  type Mutation,
  type PageInput,
  type DictbizDetailModel,
  type DictbizDetailSearch,
  type DictbizDetailInput,
} from "#/types";

import {
  type DictbizSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {DictbizDetailSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictbiz_detail: Query["findAllDictbiz_detail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictbiz_detail(search: $search, page: $page, sort: $sort) {
          id
          dictbiz_id
          dictbiz_id_lbl
          lbl
          val
          order_by
          is_enabled
          is_enabled_lbl
          rem
          is_locked
          is_locked_lbl
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
 * @param {DictbizDetailSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: DictbizDetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictbiz_detail: Query["findCountDictbiz_detail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizDetailSearch) {
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
 * @param {DictbizDetailInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DictbizDetailInput,
  opt?: GqlOpt,
) {
  const data: {
    createDictbiz_detail: Mutation["createDictbiz_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DictbizDetailInput!) {
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
 * @param {DictbizDetailInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: DictbizDetailInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdDictbiz_detail: Mutation["updateByIdDictbiz_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: DictbizDetailInput!) {
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
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdDictbiz_detail(id: $id) {
          id
          dictbiz_id
          dictbiz_id_lbl
          lbl
          val
          order_by
          is_enabled
          is_enabled_lbl
          rem
          is_locked
          is_locked_lbl
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
  } = await mutation({
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
  } = await mutation({
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
  } = await mutation({
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
  } = await mutation({
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
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch, $page: PageInput, $sort: [SortInput!]) {
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

export async function getDictbizList() {
  const data = await findAllDictbiz(
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
    search?: DictbizDetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: DictbizDetailSearch, $sort: [SortInput!]) {
          findAllDictbiz_detail(search: $search, sort: $sort) {
            id
            dictbiz_id
            dictbiz_id_lbl
            lbl
            val
            order_by
            is_enabled
            is_enabled_lbl
            rem
            is_locked
            is_locked_lbl
          }
          getFieldCommentsDictbiz_detail {
            dictbiz_id
            dictbiz_id_lbl
            lbl
            val
            order_by
            is_enabled
            is_enabled_lbl
            rem
            is_locked
            is_locked_lbl
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
        `${ location.origin }/excel_template/base/dictbiz_detail.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("业务字典明细"));
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

/**
 * 批量导入
 * @param {DictbizDetailInput[]} models
 * @export importModels
 */
export async function importModels(
  models: DictbizDetailInput[],
  opt?: GqlOpt,
) {
  const data: {
    importModelsDictbiz_detail: Mutation["importModelsDictbiz_detail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($models: [DictbizDetailInput!]!) {
        importModelsDictbiz_detail(models: $models)
      }
    `,
    variables: {
      models,
    },
  }, opt);
  const res = data.importModelsDictbiz_detail;
  return res;
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
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictbiz_detail
      }
    `,
  }, opt);
  const result = data.findLastOrderByDictbiz_detail;
  return result;
}
