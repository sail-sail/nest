import {
  UniqueType,
} from "#/types";

import type {
  OptbizId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  OptbizSearch,
  OptbizInput,
  OptbizModel,
} from "#/types";

async function setLblById(
  model?: OptbizModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找业务选项列表
 * @param {OptbizSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: OptbizSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOptbiz: Query["findAllOptbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptbizSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOptbiz(search: $search, page: $page, sort: $sort) {
          id
          lbl
          ky
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          version
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
  const models = data.findAllOptbiz;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个业务选项
 * @param {OptbizSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: OptbizSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneOptbiz: Query["findOneOptbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptbizSearch, $sort: [SortInput!]) {
        findOneOptbiz(search: $search, sort: $sort) {
          id
          lbl
          ky
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          version
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
  const model = data.findOneOptbiz;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找业务选项总数
 * @param {OptbizSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: OptbizSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOptbiz: Query["findCountOptbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptbizSearch) {
        findCountOptbiz(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountOptbiz;
  return count;
}

/**
 * 创建业务选项
 * @param {OptbizInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: OptbizInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OptbizId> {
  const data: {
    createOptbiz: Mutation["createOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: OptbizInput!, $unique_type: UniqueType) {
        createOptbiz(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: OptbizId = data.createOptbiz;
  return id;
}

/**
 * 根据 id 修改业务选项
 * @param {OptbizId} id
 * @param {OptbizInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: OptbizId,
  model: OptbizInput,
  opt?: GqlOpt,
): Promise<OptbizId> {
  const data: {
    updateByIdOptbiz: Mutation["updateByIdOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: OptbizId!, $model: OptbizInput!) {
        updateByIdOptbiz(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: OptbizId = data.updateByIdOptbiz;
  return id2;
}

/**
 * 根据 id 查找业务选项
 * @param {OptbizId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: OptbizId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdOptbiz: Query["findByIdOptbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($id: OptbizId!) {
        findByIdOptbiz(id: $id) {
          id
          lbl
          ky
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          version
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
  const model = data.findByIdOptbiz;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除业务选项
 * @param {OptbizId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: OptbizId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsOptbiz: Mutation["deleteByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!) {
        deleteByIdsOptbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 启用或禁用业务选项
 * @param {OptbizId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: OptbizId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsOptbiz: Mutation["enableByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!, $is_enabled: Int!) {
        enableByIdsOptbiz(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 锁定或解锁业务选项
 * @param {OptbizId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: OptbizId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsOptbiz: Mutation["lockByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!, $is_locked: Int!) {
        lockByIdsOptbiz(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 还原业务选项
 * @param {OptbizId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: OptbizId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsOptbiz: Mutation["revertByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!) {
        revertByIdsOptbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 彻底删除业务选项
 * @param {OptbizId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: OptbizId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsOptbiz: Mutation["forceDeleteByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!) {
        forceDeleteByIdsOptbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsOptbiz;
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
          getFieldCommentsOptbiz {
            lbl
            ky
            val
            order_by
            rem
            version
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/optbiz.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("业务选项") }${ await nsAsync("导入") }`);
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
    search?: OptbizSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: OptbizSearch, $sort: [SortInput!]) {
          findAllOptbiz(search: $search, sort: $sort) {
            id
            lbl
            ky
            val
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
            order_by
            rem
            version
            create_usr_id
            create_usr_id_lbl
            create_time
            create_time_lbl
            update_usr_id
            update_usr_id_lbl
            update_time
            update_time_lbl
          }
          getFieldCommentsOptbiz {
            lbl
            ky
            val
            is_locked_lbl
            is_enabled_lbl
            order_by
            rem
            version
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
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
        `${ location.origin }/excel_template/base/optbiz.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("业务选项"));
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
 * @param {OptbizInput[]} models
 */
export async function importModels(
  models: OptbizInput[],
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
 * 查找 业务选项 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByOptbiz: Query["findLastOrderByOptbiz"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByOptbiz
      }
    `,
  }, opt);
  const res = data.findLastOrderByOptbiz;
  return res;
}
