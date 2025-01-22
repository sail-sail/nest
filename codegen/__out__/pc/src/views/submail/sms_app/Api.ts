
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  smsAppQueryField,
} from "./Model";

async function setLblById(
  model?: SmsAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找短信应用列表
 */
export async function findAll(
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
 * 根据条件查找第一个短信应用
 */
export async function findOne(
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
 * 根据搜索条件查找短信应用总数
 */
export async function findCount(
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
 * 创建短信应用
 * @param {SmsAppInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: SmsAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SmsAppId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建短信应用
 */
export async function creates(
  inputs: SmsAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SmsAppId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改短信应用
 */
export async function updateById(
  id: SmsAppId,
  input: SmsAppInput,
  opt?: GqlOpt,
): Promise<SmsAppId> {
  input = intoInput(input);
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
 * 根据 id 查找短信应用
 */
export async function findById(
  id: SmsAppId,
  opt?: GqlOpt,
) {
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
 * 根据 ids 删除短信应用
 */
export async function deleteByIds(
  ids: SmsAppId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用短信应用
 */
export async function enableByIds(
  ids: SmsAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁短信应用
 */
export async function lockByIds(
  ids: SmsAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原短信应用
 */
export async function revertByIds(
  ids: SmsAppId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除短信应用
 */
export async function forceDeleteByIds(
  ids: SmsAppId[],
  opt?: GqlOpt,
) {
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
 * 下载短信应用导入模板
 */
export function useDownloadImportTemplate() {
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
export function useExportExcel() {
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
 * 批量导入短信应用
 */
export async function importModels(
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
      await creates(
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
export async function findLastOrderBy(
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

export function getPagePath() {
  return "/submail/sms_app";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: SmsAppInput = {
    is_locked: 0,
    is_enabled: 1,
    is_paused: 0,
    order_by: 1,
  };
  return defaultInput;
}
