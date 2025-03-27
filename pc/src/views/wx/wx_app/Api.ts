
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxAppQueryField,
} from "./Model.ts";

async function setLblById(
  model?: WxAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxApp(
  model?: WxAppInput,
) {
  const input: WxAppInput = {
    // ID
    id: model?.id,
    // 原始ID
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 开发者ID
    appid: model?.appid,
    // 开发者密码
    appsecret: model?.appsecret,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 小程序设置 列表
 */
export async function findAllWxApp(
  search?: WxAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxApp: WxAppModel[];
  } = await query({
    query: `
      query($search: WxAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxApp(search: $search, page: $page, sort: $sort) {
          ${ wxAppQueryField }
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
 */
export async function findOneWxApp(
  search?: WxAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxApp?: WxAppModel;
  } = await query({
    query: `
      query($search: WxAppSearch, $sort: [SortInput!]) {
        findOneWxApp(search: $search, sort: $sort) {
          ${ wxAppQueryField }
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
 * 根据搜索条件查找 小程序设置 总数
 */
export async function findCountWxApp(
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
 * 创建 小程序设置
 */
export async function createWxApp(
  input: WxAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxAppId> {
  const ids = await createsWxApp(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 小程序设置
 */
export async function createsWxApp(
  inputs: WxAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxAppId[]> {
  inputs = inputs.map(intoInputWxApp);
  const data: {
    createsWxApp: Mutation["createsWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxAppInput!]!, $unique_type: UniqueType) {
        createsWxApp(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxApp;
  return ids;
}

/**
 * 根据 id 修改 小程序设置
 */
export async function updateByIdWxApp(
  id: WxAppId,
  input: WxAppInput,
  opt?: GqlOpt,
): Promise<WxAppId> {
  input = intoInputWxApp(input);
  const data: {
    updateByIdWxApp: Mutation["updateByIdWxApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxAppId!, $input: WxAppInput!) {
        updateByIdWxApp(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxAppId = data.updateByIdWxApp;
  return id2;
}

/**
 * 根据 id 查找 小程序设置
 */
export async function findByIdWxApp(
  id?: WxAppId,
  opt?: GqlOpt,
): Promise<WxAppModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdWxApp?: WxAppModel;
  } = await query({
    query: `
      query($id: WxAppId!) {
        findByIdWxApp(id: $id) {
          ${ wxAppQueryField }
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
 * 根据 ids 查找 小程序设置
 */
export async function findByIdsWxApp(
  ids: WxAppId[],
  opt?: GqlOpt,
): Promise<WxAppModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: WxAppModel[] = [ ];
  try {
    const data: {
      findByIdsWxApp: WxAppModel[];
    } = await query({
      query: `
        query($ids: [WxAppId!]!) {
          findByIdsWxApp(ids: $ids) {
            ${ wxAppQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsWxApp;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除 小程序设置
 */
export async function deleteByIdsWxApp(
  ids: WxAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 启用或禁用 小程序设置
 */
export async function enableByIdsWxApp(
  ids: WxAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 锁定或解锁 小程序设置
 */
export async function lockByIdsWxApp(
  ids: WxAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原 小程序设置
 */
export async function revertByIdsWxApp(
  ids: WxAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除 小程序设置
 */
export async function forceDeleteByIdsWxApp(
  ids: WxAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 下载 小程序设置 导入模板
 */
export function useDownloadImportTemplateWxApp() {
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
      const sheetName = "小程序设置";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wx_app.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName}导入`);
    } catch (err) {
      ElMessage.error("下载失败");
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
export function useExportExcelWxApp() {
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
        query: `
          query($search: WxAppSearch, $sort: [SortInput!]) {
            findAllWxApp(search: $search, page: null, sort: $sort) {
              ${ wxAppQueryField }
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
      for (const model of data.findAllWxApp) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "小程序设置";
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
        ElMessage.error("导出失败");
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
 * 批量导入 小程序设置
 */
export async function importModelsWxApp(
  inputs: WxAppInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  opt = opt || { };
  opt.showErrMsg = false;
  opt.notLoading = true;
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  const len = inputs.length;
  const inputsArr = splitCreateArr(inputs);
  
  let i = 0;
  for (const inputs of inputsArr) {
    if (isCancel.value) {
      break;
    }
    
    i += inputs.length;
    
    try {
      await createsWxApp(
        inputs,
        UniqueType.Update,
        opt,
      );
      succNum += inputs.length;
    } catch (err) {
      failNum += inputs.length;
      failErrMsgs.push(`批量导入第 ${ i + 1 - inputs.length } 至 ${ i + 1 } 行时失败: ${ err }`);
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 小程序设置 order_by 字段的最大值
 */
export async function findLastOrderByWxApp(
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

export function getPagePathWxApp() {
  return "/wx/wx_app";
}

/** 新增时的默认值 */
export async function getDefaultInputWxApp() {
  const defaultInput: WxAppInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
