import {
  UniqueType,
} from "#/types";

import type {
  DictbizId,
} from "@/typings/ids";

import {
  DictbizType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  DictbizSearch,
  DictbizInput,
  DictbizModel,
} from "#/types";

async function setLblById(
  model?: DictbizModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找业务字典列表
 * @param {DictbizSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
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
          code
          lbl
          type
          type_lbl
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
          dictbiz_detail_models {
            id
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
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDictbiz;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个业务字典
 * @param {DictbizSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: DictbizSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDictbiz: Query["findOneDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch, $sort: [SortInput!]) {
        findOneDictbiz(search: $search, sort: $sort) {
          id
          code
          lbl
          type
          type_lbl
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
          dictbiz_detail_models {
            id
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
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDictbiz;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找业务字典总数
 * @param {DictbizSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: DictbizSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictbiz: Query["findCountDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch) {
        findCountDictbiz(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDictbiz;
  return count;
}

/**
 * 创建业务字典
 * @param {DictbizInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DictbizInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictbizId> {
  const data: {
    createDictbiz: Mutation["createDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DictbizInput!, $unique_type: UniqueType) {
        createDictbiz(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: DictbizId = data.createDictbiz;
  return id;
}

/**
 * 根据 id 修改业务字典
 * @param {DictbizId} id
 * @param {DictbizInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DictbizId,
  model: DictbizInput,
  opt?: GqlOpt,
): Promise<DictbizId> {
  const data: {
    updateByIdDictbiz: Mutation["updateByIdDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DictbizId!, $model: DictbizInput!) {
        updateByIdDictbiz(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: DictbizId = data.updateByIdDictbiz;
  return id2;
}

/**
 * 根据 id 查找业务字典
 * @param {DictbizId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: DictbizId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDictbiz: Query["findByIdDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($id: DictbizId!) {
        findByIdDictbiz(id: $id) {
          id
          code
          lbl
          type
          type_lbl
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
          dictbiz_detail_models {
            id
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
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdDictbiz;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除业务字典
 * @param {DictbizId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: DictbizId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsDictbiz: Mutation["deleteByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!) {
        deleteByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDictbiz;
  return res;
}

/**
 * 根据 ids 启用或禁用业务字典
 * @param {DictbizId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: DictbizId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsDictbiz: Mutation["enableByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!, $is_enabled: Int!) {
        enableByIdsDictbiz(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDictbiz;
  return res;
}

/**
 * 根据 ids 锁定或解锁业务字典
 * @param {DictbizId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: DictbizId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDictbiz: Mutation["lockByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!, $is_locked: Int!) {
        lockByIdsDictbiz(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsDictbiz;
  return res;
}

/**
 * 根据 ids 还原业务字典
 * @param {DictbizId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: DictbizId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsDictbiz: Mutation["revertByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!) {
        revertByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDictbiz;
  return res;
}

/**
 * 根据 ids 彻底删除业务字典
 * @param {DictbizId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: DictbizId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsDictbiz: Mutation["forceDeleteByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!) {
        forceDeleteByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDictbiz;
  return res;
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
  const res = data.findAllDictbiz;
  return res;
}

export async function getDictbizList() {
  const data = await findAllDictbiz(
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
          getFieldCommentsDictbiz {
            code
            lbl
            type_lbl
            order_by
            rem
          }
          getDict(codes: [
            "dict_type",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/dictbiz.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("业务字典") }${ await nsAsync("导入") }`);
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
    search?: DictbizSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: DictbizSearch, $sort: [SortInput!]) {
          findAllDictbiz(search: $search, sort: $sort) {
            id
            code
            lbl
            type
            type_lbl
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
          getFieldCommentsDictbiz {
            code
            lbl
            type_lbl
            is_locked_lbl
            is_enabled_lbl
            order_by
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          getDict(codes: [
            "dict_type",
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
        `${ location.origin }/excel_template/base/dictbiz.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("业务字典"));
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
 * @param {DictbizInput[]} models
 */
export async function importModels(
  models: DictbizInput[],
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
 * 查找 业务字典 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDictbiz: Query["findLastOrderByDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictbiz
      }
    `,
  }, opt);
  const res = data.findLastOrderByDictbiz;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: DictbizInput = {
    type: DictbizType.String,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
