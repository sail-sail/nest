import {
  UniqueType,
} from "#/types";

import type {
  WxAppId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  WxAppSearch,
  WxAppInput,
  WxAppModel,
} from "#/types";

async function setLblById(
  model?: WxAppModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找小程序设置列表
 * @param {WxAppSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: WxAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxApp: Query["findAllWxApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxApp(search: $search, page: $page, sort: $sort) {
          id
          code
          lbl
          appid
          appsecret
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
  const models = data.findAllWxApp;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个小程序设置
 * @param {WxAppSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxApp: Query["findOneWxApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxAppSearch, $sort: [SortInput!]) {
        findOneWxApp(search: $search, sort: $sort) {
          id
          code
          lbl
          appid
          appsecret
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
  const model = data.findOneWxApp;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找小程序设置总数
 * @param {WxAppSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: WxAppSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxApp: Query["findCountWxApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxAppSearch) {
        findCountWxApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxApp;
  return count;
}

/**
 * 创建小程序设置
 * @param {WxAppInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: WxAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxAppId> {
  const data: {
    createWxApp: Mutation["createWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: WxAppInput!, $unique_type: UniqueType) {
        createWxApp(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: WxAppId = data.createWxApp;
  return id;
}

/**
 * 根据 id 修改小程序设置
 * @param {WxAppId} id
 * @param {WxAppInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: WxAppId,
  model: WxAppInput,
  opt?: GqlOpt,
): Promise<WxAppId> {
  const data: {
    updateByIdWxApp: Mutation["updateByIdWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxAppId!, $model: WxAppInput!) {
        updateByIdWxApp(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: WxAppId = data.updateByIdWxApp;
  return id2;
}

/**
 * 根据 id 查找小程序设置
 * @param {WxAppId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxAppId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxApp: Query["findByIdWxApp"];
  } = await query({
    query: /* GraphQL */ `
      query($id: WxAppId!) {
        findByIdWxApp(id: $id) {
          id
          code
          lbl
          appid
          appsecret
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
      id,
    },
  }, opt);
  const model = data.findByIdWxApp;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除小程序设置
 * @param {WxAppId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: WxAppId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsWxApp: Mutation["deleteByIdsWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxAppId!]!) {
        deleteByIdsWxApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxApp;
  return res;
}

/**
 * 根据 ids 启用或禁用小程序设置
 * @param {WxAppId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: WxAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsWxApp: Mutation["enableByIdsWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxAppId!]!, $is_enabled: Int!) {
        enableByIdsWxApp(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsWxApp;
  return res;
}

/**
 * 根据 ids 锁定或解锁小程序设置
 * @param {WxAppId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: WxAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsWxApp: Mutation["lockByIdsWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxAppId!]!, $is_locked: Int!) {
        lockByIdsWxApp(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsWxApp;
  return res;
}

/**
 * 根据 ids 还原小程序设置
 * @param {WxAppId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: WxAppId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsWxApp: Mutation["revertByIdsWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxAppId!]!) {
        revertByIdsWxApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxApp;
  return res;
}

/**
 * 根据 ids 彻底删除小程序设置
 * @param {WxAppId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: WxAppId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsWxApp: Mutation["forceDeleteByIdsWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxAppId!]!) {
        forceDeleteByIdsWxApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxApp;
  return res;
}

/**
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
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
          getFieldCommentsWxApp {
            code
            lbl
            appid
            appsecret
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("小程序设置");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wx_app.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName }${ await nsAsync("导入") }`);
    } catch (err) {
      ElMessage.error(await nsAsync("下载失败"));
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
 * 导出Excel
 */
export function useExportExcel(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxAppSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: WxAppSearch, $sort: [SortInput!]) {
            findAllWxApp(search: $search, sort: $sort) {
              id
              code
              lbl
              appid
              appsecret
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
        const sheetName = await nsAsync("小程序设置");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wx_app.xlsx`,
          {
            sheetName,
            columns,
            data,
          },
        );
        saveAsExcel(buffer, sheetName);
      } catch (err) {
        ElMessage.error(await nsAsync("导出失败"));
        throw err;
      }
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 批量导入
 * @param {WxAppInput[]} models
 */
export async function importModels(
  models: WxAppInput[],
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
 * 查找 小程序设置 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByWxApp: Query["findLastOrderByWxApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByWxApp
      }
    `,
  }, opt);
  const res = data.findLastOrderByWxApp;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxAppInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
