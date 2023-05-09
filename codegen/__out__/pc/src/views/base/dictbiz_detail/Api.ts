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
    findAllDictbizDetail: Query["findAllDictbizDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictbizDetail(search: $search, page: $page, sort: $sort) {
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
  const result = data.findAllDictbizDetail;
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
    findCountDictbizDetail: Query["findCountDictbizDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizDetailSearch) {
        findCountDictbizDetail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountDictbizDetail;
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
    createDictbizDetail: Mutation["createDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DictbizDetailInput!) {
        createDictbizDetail(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createDictbizDetail;
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
    updateByIdDictbizDetail: Mutation["updateByIdDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: DictbizDetailInput!) {
        updateByIdDictbizDetail(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdDictbizDetail;
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
    findByIdDictbizDetail: Query["findByIdDictbizDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdDictbizDetail(id: $id) {
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
  const result = data.findByIdDictbizDetail;
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
    deleteByIdsDictbizDetail: Mutation["deleteByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsDictbizDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsDictbizDetail;
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
    lockByIdsDictbizDetail: Mutation["lockByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIdsDictbizDetail(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result = data.lockByIdsDictbizDetail;
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
    revertByIdsDictbizDetail: Mutation["revertByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsDictbizDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsDictbizDetail;
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
    forceDeleteByIdsDictbizDetail: Mutation["forceDeleteByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsDictbizDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsDictbizDetail;
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
          findAllDictbizDetail(search: $search, sort: $sort) {
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
          getFieldCommentsDictbizDetail {
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
      await create(item, opt);
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
    findLastOrderByDictbizDetail: Query["findLastOrderByDictbizDetail"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictbizDetail
      }
    `,
  }, opt);
  const result = data.findLastOrderByDictbizDetail;
  return result;
}
