
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxPayQueryField,
} from "./Model";

async function setLblById(
  model?: WxPayModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: WxPayInput,
) {
  const input: WxPayInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 开发者ID
    appid: model?.appid,
    // 商户号
    mchid: model?.mchid,
    // 公钥
    public_key: model?.public_key,
    // 私钥
    private_key: model?.private_key,
    // APIv3密钥
    v3_key: model?.v3_key,
    // 支付终端IP
    payer_client_ip: model?.payer_client_ip,
    // 通知地址
    notify_url: model?.notify_url,
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
 * 根据搜索条件查找微信支付设置列表
 */
export async function findAll(
  search?: WxPaySearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxPay: WxPayModel[];
  } = await query({
    query: `
      query($search: WxPaySearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxPay(search: $search, page: $page, sort: $sort) {
          ${ wxPayQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxPay;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个微信支付设置
 */
export async function findOne(
  search?: WxPaySearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxPay?: WxPayModel;
  } = await query({
    query: `
      query($search: WxPaySearch, $sort: [SortInput!]) {
        findOneWxPay(search: $search, sort: $sort) {
          ${ wxPayQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneWxPay;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找微信支付设置总数
 */
export async function findCount(
  search?: WxPaySearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxPay: Query["findCountWxPay"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxPaySearch) {
        findCountWxPay(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxPay;
  return count;
}

/**
 * 创建微信支付设置
 * @param {WxPayInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: WxPayInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxPayId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建微信支付设置
 */
export async function creates(
  inputs: WxPayInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxPayId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsWxPay: Mutation["createsWxPay"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxPayInput!]!, $unique_type: UniqueType) {
        createsWxPay(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxPay;
  return ids;
}

/**
 * 根据 id 修改微信支付设置
 */
export async function updateById(
  id: WxPayId,
  input: WxPayInput,
  opt?: GqlOpt,
): Promise<WxPayId> {
  input = intoInput(input);
  const data: {
    updateByIdWxPay: Mutation["updateByIdWxPay"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxPayId!, $input: WxPayInput!) {
        updateByIdWxPay(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxPayId = data.updateByIdWxPay;
  return id2;
}

/**
 * 根据 id 查找微信支付设置
 */
export async function findById(
  id?: WxPayId,
  opt?: GqlOpt,
): Promise<WxPayModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdWxPay?: WxPayModel;
  } = await query({
    query: `
      query($id: WxPayId!) {
        findByIdWxPay(id: $id) {
          ${ wxPayQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdWxPay;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找微信支付设置
 */
export async function findByIds(
  ids: WxPayId[],
  opt?: GqlOpt,
): Promise<WxPayModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: WxPayModel[] = [ ];
  try {
    const data: {
      findByIdsWxPay: WxPayModel[];
    } = await query({
      query: `
        query($ids: [WxPayId!]!) {
          findByIdsWxPay(ids: $ids) {
            ${ wxPayQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsWxPay;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除微信支付设置
 */
export async function deleteByIds(
  ids: WxPayId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxPay: Mutation["deleteByIdsWxPay"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxPayId!]!) {
        deleteByIdsWxPay(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxPay;
  return res;
}

/**
 * 根据 ids 启用或禁用微信支付设置
 */
export async function enableByIds(
  ids: WxPayId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsWxPay: Mutation["enableByIdsWxPay"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxPayId!]!, $is_enabled: Int!) {
        enableByIdsWxPay(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsWxPay;
  return res;
}

/**
 * 根据 ids 锁定或解锁微信支付设置
 */
export async function lockByIds(
  ids: WxPayId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsWxPay: Mutation["lockByIdsWxPay"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxPayId!]!, $is_locked: Int!) {
        lockByIdsWxPay(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsWxPay;
  return res;
}

/**
 * 根据 ids 还原微信支付设置
 */
export async function revertByIds(
  ids: WxPayId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxPay: Mutation["revertByIdsWxPay"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxPayId!]!) {
        revertByIdsWxPay(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxPay;
  return res;
}

/**
 * 根据 ids 彻底删除微信支付设置
 */
export async function forceDeleteByIds(
  ids: WxPayId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxPay: Mutation["forceDeleteByIdsWxPay"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxPayId!]!) {
        forceDeleteByIdsWxPay(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxPay;
  return res;
}

/**
 * 下载微信支付设置导入模板
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
          getFieldCommentsWxPay {
            lbl
            appid
            mchid
            v3_key
            payer_client_ip
            notify_url
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "微信支付设置";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wx_pay.xlsx`,
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
    search?: WxPaySearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxPaySearch, $sort: [SortInput!]) {
            findAllWxPay(search: $search, page: null, sort: $sort) {
              ${ wxPayQueryField }
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
      for (const model of data.findAllWxPay) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "微信支付设置";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wx_pay.xlsx`,
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
 * 批量导入微信支付设置
 */
export async function importModels(
  inputs: WxPayInput[],
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
 * 查找 微信支付设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByWxPay: Query["findLastOrderByWxPay"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByWxPay
      }
    `,
  }, opt);
  const res = data.findLastOrderByWxPay;
  return res;
}

export function getPagePath() {
  return "/wx/wx_pay";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxPayInput = {
    is_locked: 1,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
