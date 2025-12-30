
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxPayQueryField,
} from "./Model.ts";

export async function setLblByIdWxPay(
  model?: WxPayModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxPay(
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
    // 证书序列号
    serial_no: model?.serial_no,
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
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 微信支付设置 列表
 */
export async function findAllWxPay(
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
    await setLblByIdWxPay(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 微信支付设置
 */
export async function findOneWxPay(
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
  
  await setLblByIdWxPay(model);
  
  return model;
}

/**
 * 根据条件查找第一个 微信支付设置, 如果不存在则抛错
 */
export async function findOneOkWxPay(
  search?: WxPaySearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxPay?: WxPayModel;
  } = await query({
    query: `
      query($search: WxPaySearch, $sort: [SortInput!]) {
        findOneOkWxPay(search: $search, sort: $sort) {
          ${ wxPayQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxPay;
  
  await setLblByIdWxPay(model);
  
  return model;
}

/**
 * 根据搜索条件查找 微信支付设置 总数
 */
export async function findCountWxPay(
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
 * 创建 微信支付设置
 */
export async function createWxPay(
  input: WxPayInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxPayId> {
  const ids = await createsWxPay(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 微信支付设置
 */
export async function createsWxPay(
  inputs: WxPayInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxPayId[]> {
  inputs = inputs.map(intoInputWxPay);
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
 * 根据 id 修改 微信支付设置
 */
export async function updateByIdWxPay(
  id: WxPayId,
  input: WxPayInput,
  opt?: GqlOpt,
): Promise<WxPayId> {
  input = intoInputWxPay(input);
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
 * 根据 id 查找 微信支付设置
 */
export async function findByIdWxPay(
  id: WxPayId,
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
  
  await setLblByIdWxPay(model);
  
  return model;
}

/**
 * 根据 id 查找 微信支付设置, 如果不存在则抛错
 */
export async function findByIdOkWxPay(
  id: WxPayId,
  opt?: GqlOpt,
): Promise<WxPayModel> {
  
  const data: {
    findByIdOkWxPay: WxPayModel;
  } = await query({
    query: `
      query($id: WxPayId!) {
        findByIdOkWxPay(id: $id) {
          ${ wxPayQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxPay;
  
  await setLblByIdWxPay(model);
  
  return model;
}

/**
 * 根据 ids 查找 微信支付设置
 */
export async function findByIdsWxPay(
  ids: WxPayId[],
  opt?: GqlOpt,
): Promise<WxPayModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
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
  
  const models = data.findByIdsWxPay;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxPay(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 微信支付设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxPay(
  ids: WxPayId[],
  opt?: GqlOpt,
): Promise<WxPayModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxPay: WxPayModel[];
  } = await query({
    query: `
      query($ids: [WxPayId!]!) {
        findByIdsOkWxPay(ids: $ids) {
          ${ wxPayQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxPay;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxPay(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 微信支付设置
 */
export async function deleteByIdsWxPay(
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
 * 根据 ids 启用或禁用 微信支付设置
 */
export async function enableByIdsWxPay(
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
 * 根据 ids 锁定或解锁 微信支付设置
 */
export async function lockByIdsWxPay(
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
 * 根据 ids 还原 微信支付设置
 */
export async function revertByIdsWxPay(
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
 * 根据 ids 彻底删除 微信支付设置
 */
export async function forceDeleteByIdsWxPay(
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
 * 下载 微信支付设置 导入模板
 */
export function useDownloadImportTemplateWxPay() {
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
            serial_no
            v3_key
            payer_client_ip
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
export function useExportExcelWxPay() {
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
          query($search: WxPaySearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllWxPay(search: $search, page: $page, sort: $sort) {
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
          page: {
            isResultLimit: false,
          },
          sort,
        },
      }, opt);
      for (const model of data.findAllWxPay) {
        await setLblByIdWxPay(model, true);
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
 * 批量导入 微信支付设置
 */
export async function importModelsWxPay(
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
      await createsWxPay(
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
export async function findLastOrderByWxPay(
  search?: WxPaySearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByWxPay: Query["findLastOrderByWxPay"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxPaySearch) {
        findLastOrderByWxPay(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByWxPay;
  
  return order_by;
}

/**
 * 获取 微信支付设置 字段注释
 */
export async function getFieldCommentsWxPay(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxPay: Query["getFieldCommentsWxPay"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxPay {
          id,
          lbl,
          appid,
          mchid,
          serial_no,
          public_key,
          private_key,
          v3_key,
          payer_client_ip,
          notify_url,
          is_locked,
          is_locked_lbl,
          is_enabled,
          is_enabled_lbl,
          order_by,
          rem,
          create_usr_id,
          create_usr_id_lbl,
          create_time,
          create_time_lbl,
          update_usr_id,
          update_usr_id_lbl,
          update_time,
          update_time_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsWxPay as WxPayFieldComment;
  
  return field_comments;
}

export function getPagePathWxPay() {
  return "/wx/wx_pay";
}

/** 新增时的默认值 */
export async function getDefaultInputWxPay() {
  const defaultInput: WxPayInput = {
    notify_url: "/api/wx_pay/wx_pay_notify",
    is_locked: 1,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
