import {
  UniqueType,
} from "#/types";

import type {
  DictDetailId,
} from "@/typings/ids";

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
 * 根据搜索条件查找系统字典明细列表
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
  const res = data.findAllDictDetail;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据条件查找第一个系统字典明细
 * @param {DictDetailSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: DictDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDictDetail: Query["findOneDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictDetailSearch, $sort: [SortInput!]) {
        findOneDictDetail(search: $search, sort: $sort) {
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
  const model = data.findOneDictDetail;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找系统字典明细总数
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
 * 创建系统字典明细
 * @param {DictDetailInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DictDetailInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictDetailId> {
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
  const id: DictDetailId = data.createDictDetail;
  return id;
}

/**
 * 根据 id 修改系统字典明细
 * @param {DictDetailId} id
 * @param {DictDetailInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DictDetailId,
  model: DictDetailInput,
  opt?: GqlOpt,
): Promise<DictDetailId> {
  const data: {
    updateByIdDictDetail: Mutation["updateByIdDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DictDetailId!, $model: DictDetailInput!) {
        updateByIdDictDetail(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: DictDetailId = data.updateByIdDictDetail;
  return id2;
}

/**
 * 根据 id 查找系统字典明细
 * @param {DictDetailId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: DictDetailId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDictDetail: Query["findByIdDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($id: DictDetailId!) {
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
  const res = data.findByIdDictDetail;
  return res;
}

/**
 * 根据 ids 删除系统字典明细
 * @param {DictDetailId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: DictDetailId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsDictDetail: Mutation["deleteByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!) {
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
 * 根据 ids 启用或禁用系统字典明细
 * @param {DictDetailId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: DictDetailId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsDictDetail: Mutation["enableByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!, $is_enabled: Int!) {
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
 * 根据 ids 锁定或解锁系统字典明细
 * @param {DictDetailId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: DictDetailId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDictDetail: Mutation["lockByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!, $is_locked: Int!) {
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
 * 根据 ids 还原系统字典明细
 * @param {DictDetailId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: DictDetailId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsDictDetail: Mutation["revertByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!) {
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
 * 根据 ids 彻底删除系统字典明细
 * @param {DictDetailId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: DictDetailId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsDictDetail: Mutation["forceDeleteByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!) {
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
    {
      is_enabled: [ 1 ],
    },
    undefined,
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
          getFieldCommentsDictDetail {
            dict_id_lbl
            lbl
            val
            order_by
            rem
          }
          findAllDict {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/dict_detail.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("系统字典明细") }${ await nsAsync("导入") }`);
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
    search?: DictDetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
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
            create_usr_id
            create_usr_id_lbl
            create_time
            create_time_lbl
            update_usr_id
            update_usr_id_lbl
            update_time
            update_time_lbl
          }
          getFieldCommentsDictDetail {
            dict_id_lbl
            lbl
            val
            is_locked_lbl
            is_enabled_lbl
            order_by
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllDict {
            lbl
          }
          getDict(codes: [
            "is_locked",
            "is_enabled",
          ]) {
            code
            lbl
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
        {
          data,
        },
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
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
    
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
    
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 系统字典明细 order_by 字段的最大值
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
