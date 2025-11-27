

import {
  PayTransactionsJsapiTradeState,
  PayTransactionsJsapiCurrency,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  payTransactionsJsapiQueryField,
} from "./Model.ts";

export async function setLblByIdPayTransactionsJsapi(
  model?: PayTransactionsJsapiModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputPayTransactionsJsapi(
  model?: PayTransactionsJsapiInput,
) {
  const input: PayTransactionsJsapiInput = {
    // ID
    id: model?.id,
    // 开发者ID
    appid: model?.appid,
    // 商户号
    mchid: model?.mchid,
    // 商品描述
    description: model?.description,
    // 商户订单号
    out_trade_no: model?.out_trade_no,
    // 微信支付订单号
    transaction_id: model?.transaction_id,
    // 交易状态
    trade_state: model?.trade_state,
    trade_state_lbl: model?.trade_state_lbl,
    // 交易状态描述
    trade_state_desc: model?.trade_state_desc,
    // 支付完成时间
    success_time: model?.success_time,
    success_time_lbl: model?.success_time_lbl,
    success_time_save_null: model?.success_time_save_null,
    // 交易限制时间
    time_expire: model?.time_expire,
    // 附加数据
    attach: model?.attach,
    // 开发票
    receipt: model?.receipt,
    // 分账
    profit_sharing: model?.profit_sharing,
    // 订单金额(分)
    total_fee: model?.total_fee,
    // 货币类型
    currency: model?.currency,
    currency_lbl: model?.currency_lbl,
    // 用户标识
    openid: model?.openid,
  };
  return input;
}

/**
 * 根据搜索条件查找 微信JSAPI下单 列表
 */
export async function findAllPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPayTransactionsJsapi: PayTransactionsJsapiModel[];
  } = await query({
    query: `
      query($search: PayTransactionsJsapiSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPayTransactionsJsapi(search: $search, page: $page, sort: $sort) {
          ${ payTransactionsJsapiQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllPayTransactionsJsapi;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdPayTransactionsJsapi(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 微信JSAPI下单
 */
export async function findOnePayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOnePayTransactionsJsapi?: PayTransactionsJsapiModel;
  } = await query({
    query: `
      query($search: PayTransactionsJsapiSearch, $sort: [SortInput!]) {
        findOnePayTransactionsJsapi(search: $search, sort: $sort) {
          ${ payTransactionsJsapiQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOnePayTransactionsJsapi;
  
  await setLblByIdPayTransactionsJsapi(model);
  
  return model;
}

/**
 * 根据条件查找第一个 微信JSAPI下单, 如果不存在则抛错
 */
export async function findOneOkPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkPayTransactionsJsapi?: PayTransactionsJsapiModel;
  } = await query({
    query: `
      query($search: PayTransactionsJsapiSearch, $sort: [SortInput!]) {
        findOneOkPayTransactionsJsapi(search: $search, sort: $sort) {
          ${ payTransactionsJsapiQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkPayTransactionsJsapi;
  
  await setLblByIdPayTransactionsJsapi(model);
  
  return model;
}

/**
 * 根据搜索条件查找 微信JSAPI下单 总数
 */
export async function findCountPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPayTransactionsJsapi: Query["findCountPayTransactionsJsapi"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PayTransactionsJsapiSearch) {
        findCountPayTransactionsJsapi(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountPayTransactionsJsapi;
  return count;
}

/**
 * 根据 id 查找 微信JSAPI下单
 */
export async function findByIdPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
  opt?: GqlOpt,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdPayTransactionsJsapi?: PayTransactionsJsapiModel;
  } = await query({
    query: `
      query($id: PayTransactionsJsapiId!) {
        findByIdPayTransactionsJsapi(id: $id) {
          ${ payTransactionsJsapiQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdPayTransactionsJsapi;
  
  await setLblByIdPayTransactionsJsapi(model);
  
  return model;
}

/**
 * 根据 id 查找 微信JSAPI下单, 如果不存在则抛错
 */
export async function findByIdOkPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
  opt?: GqlOpt,
): Promise<PayTransactionsJsapiModel> {
  
  const data: {
    findByIdOkPayTransactionsJsapi: PayTransactionsJsapiModel;
  } = await query({
    query: `
      query($id: PayTransactionsJsapiId!) {
        findByIdOkPayTransactionsJsapi(id: $id) {
          ${ payTransactionsJsapiQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkPayTransactionsJsapi;
  
  await setLblByIdPayTransactionsJsapi(model);
  
  return model;
}

/**
 * 根据 ids 查找 微信JSAPI下单
 */
export async function findByIdsPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
  opt?: GqlOpt,
): Promise<PayTransactionsJsapiModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsPayTransactionsJsapi: PayTransactionsJsapiModel[];
  } = await query({
    query: `
      query($ids: [PayTransactionsJsapiId!]!) {
        findByIdsPayTransactionsJsapi(ids: $ids) {
          ${ payTransactionsJsapiQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsPayTransactionsJsapi;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdPayTransactionsJsapi(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 微信JSAPI下单, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
  opt?: GqlOpt,
): Promise<PayTransactionsJsapiModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkPayTransactionsJsapi: PayTransactionsJsapiModel[];
  } = await query({
    query: `
      query($ids: [PayTransactionsJsapiId!]!) {
        findByIdsOkPayTransactionsJsapi(ids: $ids) {
          ${ payTransactionsJsapiQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkPayTransactionsJsapi;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdPayTransactionsJsapi(model);
  }
  
  return models;
}

/**
 * 导出Excel
 */
export function useExportExcelPayTransactionsJsapi() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: PayTransactionsJsapiSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: PayTransactionsJsapiSearch, $sort: [SortInput!]) {
            findAllPayTransactionsJsapi(search: $search, page: null, sort: $sort) {
              ${ payTransactionsJsapiQueryField }
            }
            getDict(codes: [
              "wx_pay_notice_trade_state",
              "wx_pay_notice_currency",
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
      for (const model of data.findAllPayTransactionsJsapi) {
        await setLblByIdPayTransactionsJsapi(model, true);
      }
      try {
        const sheetName = "微信JSAPI下单";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/pay_transactions_jsapi.xlsx`,
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
 * 获取 微信JSAPI下单 字段注释
 */
export async function getFieldCommentsPayTransactionsJsapi(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsPayTransactionsJsapi: Query["getFieldCommentsPayTransactionsJsapi"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsPayTransactionsJsapi {
          id,
          appid,
          mchid,
          description,
          out_trade_no,
          transaction_id,
          trade_state,
          trade_state_lbl,
          trade_state_desc,
          success_time,
          success_time_lbl,
          time_expire,
          attach,
          receipt,
          profit_sharing,
          total_fee,
          currency,
          currency_lbl,
          openid,
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
  
  const field_comments = data.getFieldCommentsPayTransactionsJsapi as PayTransactionsJsapiFieldComment;
  
  return field_comments;
}

export function getPagePathPayTransactionsJsapi() {
  return "/wx/pay_transactions_jsapi";
}

/** 新增时的默认值 */
export async function getDefaultInputPayTransactionsJsapi() {
  const defaultInput: PayTransactionsJsapiInput = {
    trade_state: PayTransactionsJsapiTradeState.Notpay,
    trade_state_desc: "未支付",
    receipt: "N",
    profit_sharing: "N",
    total_fee: 0,
    currency: PayTransactionsJsapiCurrency.Cny,
  };
  return defaultInput;
}
