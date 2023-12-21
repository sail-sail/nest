import {
  UniqueType,
} from "#/types";

import type {
  WxwUsrId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  WxwUsrSearch,
  WxwUsrInput,
} from "#/types";

async function setLblById(
  model?: WxwUsrModel,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找企微用户列表
 * @param {WxwUsrSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwUsr: Query["findAllWxwUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
          userid
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
  const models = data.findAllWxwUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个企微用户
 * @param {WxwUsrSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxwUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxwUsr: Query["findOneWxwUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwUsrSearch, $sort: [SortInput!]) {
        findOneWxwUsr(search: $search, sort: $sort) {
          id
          lbl
          userid
          rem
          is_deleted
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneWxwUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找企微用户总数
 * @param {WxwUsrSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: WxwUsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxwUsr: Query["findCountWxwUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwUsrSearch) {
        findCountWxwUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxwUsr;
  return count;
}

/**
 * 创建企微用户
 * @param {WxwUsrInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: WxwUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwUsrId> {
  const data: {
    createWxwUsr: Mutation["createWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: WxwUsrInput!, $unique_type: UniqueType) {
        createWxwUsr(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: WxwUsrId = data.createWxwUsr;
  return id;
}

/**
 * 根据 id 修改企微用户
 * @param {WxwUsrId} id
 * @param {WxwUsrInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: WxwUsrId,
  model: WxwUsrInput,
  opt?: GqlOpt,
): Promise<WxwUsrId> {
  const data: {
    updateByIdWxwUsr: Mutation["updateByIdWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxwUsrId!, $model: WxwUsrInput!) {
        updateByIdWxwUsr(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: WxwUsrId = data.updateByIdWxwUsr;
  return id2;
}

/**
 * 根据 id 查找企微用户
 * @param {WxwUsrId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxwUsrId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxwUsr: Query["findByIdWxwUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($id: WxwUsrId!) {
        findByIdWxwUsr(id: $id) {
          id
          lbl
          userid
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdWxwUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除企微用户
 * @param {WxwUsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: WxwUsrId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsWxwUsr: Mutation["deleteByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwUsrId!]!) {
        deleteByIdsWxwUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxwUsr;
  return res;
}

/**
 * 根据 ids 还原企微用户
 * @param {WxwUsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: WxwUsrId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsWxwUsr: Mutation["revertByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwUsrId!]!) {
        revertByIdsWxwUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxwUsr;
  return res;
}

/**
 * 根据 ids 彻底删除企微用户
 * @param {WxwUsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: WxwUsrId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsWxwUsr: Mutation["forceDeleteByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwUsrId!]!) {
        forceDeleteByIdsWxwUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxwUsr;
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
          getFieldCommentsWxwUsr {
            lbl
            userid
            rem
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/wxwork/wxw_usr.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("企微用户") }${ await nsAsync("导入") }`);
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
    search?: WxwUsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: WxwUsrSearch, $sort: [SortInput!]) {
          findAllWxwUsr(search: $search, sort: $sort) {
            id
            lbl
            userid
            rem
          }
          getFieldCommentsWxwUsr {
            lbl
            userid
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
        `${ location.origin }/excel_template/wxwork/wxw_usr.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("企微用户"));
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
 * @param {WxwUsrInput[]} models
 */
export async function importModels(
  models: WxwUsrInput[],
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
