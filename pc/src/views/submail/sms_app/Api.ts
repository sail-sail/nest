
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  smsAppQueryField,
} from "./Model.ts";

async function setLblById(
  model?: SmsAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputSmsApp(
  model?: SmsAppInput,
) {
  const input: SmsAppInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // appid
    appid: model?.appid,
    // appkey
    appkey: model?.appkey,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 暂停发送
    is_paused: model?.is_paused,
    is_paused_lbl: model?.is_paused_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 短信应用 列表
 */
export async function findAllSmsApp(
  search?: SmsAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllSmsApp: SmsAppModel[];
  } = await query({
    query: `
      query($search: SmsAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllSmsApp(search: $search, page: $page, sort: $sort) {
          ${ smsAppQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllSmsApp;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 短信应用
 */
export async function findOneSmsApp(
  search?: SmsAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneSmsApp?: SmsAppModel;
  } = await query({
    query: `
      query($search: SmsAppSearch, $sort: [SortInput!]) {
        findOneSmsApp(search: $search, sort: $sort) {
          ${ smsAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneSmsApp;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 短信应用, 如果不存在则抛错
 */
export async function findOneOkSmsApp(
  search?: SmsAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkSmsApp?: SmsAppModel;
  } = await query({
    query: `
      query($search: SmsAppSearch, $sort: [SortInput!]) {
        findOneOkSmsApp(search: $search, sort: $sort) {
          ${ smsAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkSmsApp;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 短信应用 总数
 */
export async function findCountSmsApp(
  search?: SmsAppSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountSmsApp: Query["findCountSmsApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: SmsAppSearch) {
        findCountSmsApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountSmsApp;
  return count;
}

/**
 * 创建 短信应用
 */
export async function createSmsApp(
  input: SmsAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SmsAppId> {
  const ids = await createsSmsApp(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 短信应用
 */
export async function createsSmsApp(
  inputs: SmsAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SmsAppId[]> {
  inputs = inputs.map(intoInputSmsApp);
  const data: {
    createsSmsApp: Mutation["createsSmsApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [SmsAppInput!]!, $unique_type: UniqueType) {
        createsSmsApp(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsSmsApp;
  return ids;
}

/**
 * 根据 id 修改 短信应用
 */
export async function updateByIdSmsApp(
  id: SmsAppId,
  input: SmsAppInput,
  opt?: GqlOpt,
): Promise<SmsAppId> {
  input = intoInputSmsApp(input);
  const data: {
    updateByIdSmsApp: Mutation["updateByIdSmsApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: SmsAppId!, $input: SmsAppInput!) {
        updateByIdSmsApp(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: SmsAppId = data.updateByIdSmsApp;
  return id2;
}

/**
 * 根据 id 查找 短信应用
 */
export async function findByIdSmsApp(
  id: SmsAppId,
  opt?: GqlOpt,
): Promise<SmsAppModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdSmsApp?: SmsAppModel;
  } = await query({
    query: `
      query($id: SmsAppId!) {
        findByIdSmsApp(id: $id) {
          ${ smsAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdSmsApp;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 短信应用, 如果不存在则抛错
 */
export async function findByIdOkSmsApp(
  id: SmsAppId,
  opt?: GqlOpt,
): Promise<SmsAppModel> {
  
  const data: {
    findByIdOkSmsApp: SmsAppModel;
  } = await query({
    query: `
      query($id: SmsAppId!) {
        findByIdOkSmsApp(id: $id) {
          ${ smsAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkSmsApp;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 短信应用
 */
export async function findByIdsSmsApp(
  ids: SmsAppId[],
  opt?: GqlOpt,
): Promise<SmsAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsSmsApp: SmsAppModel[];
  } = await query({
    query: `
      query($ids: [SmsAppId!]!) {
        findByIdsSmsApp(ids: $ids) {
          ${ smsAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsSmsApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 短信应用, 出现查询不到的 id 则报错
 */
export async function findByIdsOkSmsApp(
  ids: SmsAppId[],
  opt?: GqlOpt,
): Promise<SmsAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkSmsApp: SmsAppModel[];
  } = await query({
    query: `
      query($ids: [SmsAppId!]!) {
        findByIdsOkSmsApp(ids: $ids) {
          ${ smsAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkSmsApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 短信应用
 */
export async function deleteByIdsSmsApp(
  ids: SmsAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsSmsApp: Mutation["deleteByIdsSmsApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsAppId!]!) {
        deleteByIdsSmsApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsSmsApp;
  return res;
}

/**
 * 根据 ids 启用或禁用 短信应用
 */
export async function enableByIdsSmsApp(
  ids: SmsAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsSmsApp: Mutation["enableByIdsSmsApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsAppId!]!, $is_enabled: Int!) {
        enableByIdsSmsApp(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsSmsApp;
  return res;
}

/**
 * 根据 ids 锁定或解锁 短信应用
 */
export async function lockByIdsSmsApp(
  ids: SmsAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsSmsApp: Mutation["lockByIdsSmsApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsAppId!]!, $is_locked: Int!) {
        lockByIdsSmsApp(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsSmsApp;
  return res;
}

/**
 * 根据 ids 还原 短信应用
 */
export async function revertByIdsSmsApp(
  ids: SmsAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsSmsApp: Mutation["revertByIdsSmsApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsAppId!]!) {
        revertByIdsSmsApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsSmsApp;
  return res;
}

/**
 * 根据 ids 彻底删除 短信应用
 */
export async function forceDeleteByIdsSmsApp(
  ids: SmsAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsSmsApp: Mutation["forceDeleteByIdsSmsApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsAppId!]!) {
        forceDeleteByIdsSmsApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsSmsApp;
  return res;
}

/**
 * 下载 短信应用 导入模板
 */
export function useDownloadImportTemplateSmsApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsSmsApp {
            lbl
            appid
            appkey
            is_paused_lbl
            order_by
            rem
          }
          getDict(codes: [
            "yes_no",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "短信应用";
      const buffer = await workerFn(
        `${ location.origin }/import_template/submail/sms_app.xlsx`,
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
export function useExportExcelSmsApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: SmsAppSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: SmsAppSearch, $sort: [SortInput!]) {
            findAllSmsApp(search: $search, page: null, sort: $sort) {
              ${ smsAppQueryField }
            }
            getDict(codes: [
              "is_locked",
              "is_enabled",
              "yes_no",
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
      for (const model of data.findAllSmsApp) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "短信应用";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/submail/sms_app.xlsx`,
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
 * 批量导入 短信应用
 */
export async function importModelsSmsApp(
  inputs: SmsAppInput[],
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
      await createsSmsApp(
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
 * 查找 短信应用 order_by 字段的最大值
 */
export async function findLastOrderBySmsApp(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderBySmsApp: Query["findLastOrderBySmsApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderBySmsApp
      }
    `,
  }, opt);
  const res = data.findLastOrderBySmsApp;
  return res;
}

export function getPagePathSmsApp() {
  return "/submail/sms_app";
}

/** 新增时的默认值 */
export async function getDefaultInputSmsApp() {
  const defaultInput: SmsAppInput = {
    is_locked: 0,
    is_enabled: 1,
    is_paused: 0,
    order_by: 1,
  };
  return defaultInput;
}
