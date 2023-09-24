import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  WxwUsrSearch,
  WxwUsrInput,
} from "#/types";

import type {
  WxwAppSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
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
          wxw_app_id
          wxw_app_id_lbl
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
  const res = data.findAllWxwUsr;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
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
  const res = data.findCountWxwUsr;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {WxwUsrInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: WxwUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
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
  const res = data.createWxwUsr;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {WxwUsrInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: WxwUsrInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdWxwUsr: Mutation["updateByIdWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: WxwUsrInput!) {
        updateByIdWxwUsr(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdWxwUsr;
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
    findByIdWxwUsr: Query["findByIdWxwUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdWxwUsr(id: $id) {
          id
          wxw_app_id
          wxw_app_id_lbl
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
  const res = data.findByIdWxwUsr;
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
    deleteByIdsWxwUsr: Mutation["deleteByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
    revertByIdsWxwUsr: Mutation["revertByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
    forceDeleteByIdsWxwUsr: Mutation["forceDeleteByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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

export async function findAllWxwApp(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwApp: Query["findAllWxwApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwApp(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllWxwApp;
  return res;
}

export async function getWxwAppList() {
  const data = await findAllWxwApp(
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
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxwUsr {
            wxw_app_id_lbl
            lbl
            userid
            rem
          }
          findAllWxwApp {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/wxwork/wxw_usr.xlsx`,
      `${ location.origin }${ queryStr }`,
    );
    saveAsExcel(buffer, `${ await nAsync("企业微信用户") }${ await nsAsync("导入模板") }`);
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
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: WxwUsrSearch, $sort: [SortInput!]) {
          findAllWxwUsr(search: $search, sort: $sort) {
            id
            wxw_app_id
            wxw_app_id_lbl
            lbl
            userid
            rem
          }
          getFieldCommentsWxwUsr {
            wxw_app_id_lbl
            lbl
            userid
            rem
          }
          findAllWxwApp {
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
        `${ location.origin }/excel_template/wxwork/wxw_usr.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("企业微信用户"));
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
 * @export importModels
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
