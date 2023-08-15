

import type {
  Query,
  Mutation,
  PageInput,
  DictDetailSearch,
  DictDetailInput,
} from "#/types";

import type {
  DictSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {DictDetailSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: DictDetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictDetail: Query["findAllDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictDetail(search: $search, page: $page, sort: $sort) {
          id
          dict_id
          dict_id_lbl
          lbl
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
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
  const res = data.findAllDictDetail;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {DictDetailSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: DictDetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictDetail: Query["findCountDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictDetailSearch) {
        findCountDictDetail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountDictDetail;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {DictDetailInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DictDetailInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
  const data: {
    createDictDetail: Mutation["createDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DictDetailInput!, $unique_type: UniqueType) {
        createDictDetail(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const res = data.createDictDetail;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {DictDetailInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: DictDetailInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdDictDetail: Mutation["updateByIdDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: DictDetailInput!) {
        updateByIdDictDetail(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdDictDetail;
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
    findByIdDictDetail: Query["findByIdDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdDictDetail(id: $id) {
          id
          dict_id
          dict_id_lbl
          lbl
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdDictDetail;
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
    deleteByIdsDictDetail: Mutation["deleteByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsDictDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDictDetail;
  return res;
}

/**
 * 根据 ids 启用或禁用数据
 * @export enableByIds
 * @param {string[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsDictDetail: Mutation["enableByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_enabled: Int!) {
        enableByIdsDictDetail(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDictDetail;
  return res;
}

/**
 * 根据 ids 锁定或解锁数据
 * @export lockByIds
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDictDetail: Mutation["lockByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_locked: Int!) {
        lockByIdsDictDetail(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsDictDetail;
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
    revertByIdsDictDetail: Mutation["revertByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsDictDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDictDetail;
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
    forceDeleteByIdsDictDetail: Mutation["forceDeleteByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsDictDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDictDetail;
  return res;
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
      query($search: DictSearch, $page: PageInput, $sort: [SortInput!]) {
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
  const res = data.findAllDict;
  return res;
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
    search?: DictDetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: DictDetailSearch, $sort: [SortInput!]) {
          findAllDictDetail(search: $search, sort: $sort) {
            id
            dict_id
            dict_id_lbl
            lbl
            val
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
            order_by
            rem
          }
          getFieldCommentsDictDetail {
            dict_id
            dict_id_lbl
            lbl
            val
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
            order_by
            rem
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
        `${ location.origin }/excel_template/base/dict_detail.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("系统字典明细"));
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
 * @param {DictDetailInput[]} models
 * @export importModels
 */
export async function importModels(
  models: DictDetailInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  for (let i = 0; i < models.length; i++) {
    if (isCancel.value) {
      break;
    }
    
    const item = models[i];
    
    opt = opt || { };
    opt.showErrMsg = false;
    opt.notLoading = true;
    
    try {
      await create(
        item,
        UniqueType.Update,
        opt,
      );
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
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
    findLastOrderByDictDetail: Query["findLastOrderByDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictDetail
      }
    `,
  }, opt);
  const res = data.findLastOrderByDictDetail;
  return res;
}
