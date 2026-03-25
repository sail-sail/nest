

import {
  WxRefundChannel,
  WxRefundStatus,
  WxRefundFundsAccount,
  WxRefundAmountCurrency,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxRefundQueryField,
} from "./Model.ts";

export async function setLblByIdWxRefund(
  model?: WxRefundModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxRefund(
  model?: WxRefundInput | null,
) {
  const input: WxRefundInput = {
    // ID
    id: model?.id,
    // 开发者ID
    appid: model?.appid,
    // 商户号
    mchid: model?.mchid,
    // 商户订单号
    out_trade_no: model?.out_trade_no,
    // 微信支付订单号
    transaction_id: model?.transaction_id,
    // 商户退款单号
    out_refund_no: model?.out_refund_no,
    // 微信退款单号
    refund_id: model?.refund_id,
    // 退款原因
    reason: model?.reason,
    // 退款渠道
    channel: model?.channel,
    channel_lbl: model?.channel_lbl,
    // 退款入账账户
    user_received_account: model?.user_received_account,
    // 退款成功时间
    success_time: model?.success_time,
    success_time_lbl: model?.success_time_lbl,
    success_time_save_null: model?.success_time_save_null,
    // 退款状态
    status: model?.status,
    status_lbl: model?.status_lbl,
    // 资金账户
    funds_account: model?.funds_account,
    funds_account_lbl: model?.funds_account_lbl,
    // 订单金额(分)
    amount_total: model?.amount_total != null ? Number(model?.amount_total || 0) : undefined,
    // 退款金额(分)
    amount_refund: model?.amount_refund != null ? Number(model?.amount_refund || 0) : undefined,
    // 用户实际支付金额(分)
    amount_payer_total: model?.amount_payer_total != null ? Number(model?.amount_payer_total || 0) : undefined,
    // 用户退款金额(分)
    amount_payer_refund: model?.amount_payer_refund != null ? Number(model?.amount_payer_refund || 0) : undefined,
    // 应结退款金额(分)
    amount_settlement_refund: model?.amount_settlement_refund != null ? Number(model?.amount_settlement_refund || 0) : undefined,
    // 优惠退款金额(分)
    amount_discount_refund: model?.amount_discount_refund != null ? Number(model?.amount_discount_refund || 0) : undefined,
    // 退款币种
    amount_currency: model?.amount_currency,
    amount_currency_lbl: model?.amount_currency_lbl,
    // 手续费退款金额(分)
    amount_refund_fee: model?.amount_refund_fee != null ? Number(model?.amount_refund_fee || 0) : undefined,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 微信退款申请 列表
 */
export async function findAllWxRefund(
  search?: WxRefundSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxRefund: WxRefundModel[];
  } = await query({
    query: `
      query($search: WxRefundSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxRefund(search: $search, page: $page, sort: $sort) {
          ${ wxRefundQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxRefund;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxRefund(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 微信退款申请
 */
export async function findOneWxRefund(
  search?: WxRefundSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxRefund?: WxRefundModel;
  } = await query({
    query: `
      query($search: WxRefundSearch, $sort: [SortInput!]) {
        findOneWxRefund(search: $search, sort: $sort) {
          ${ wxRefundQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxRefund;
  
  await setLblByIdWxRefund(model);
  
  return model;
}

/**
 * 根据条件查找第一个 微信退款申请, 如果不存在则抛错
 */
export async function findOneOkWxRefund(
  search?: WxRefundSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxRefund?: WxRefundModel;
  } = await query({
    query: `
      query($search: WxRefundSearch, $sort: [SortInput!]) {
        findOneOkWxRefund(search: $search, sort: $sort) {
          ${ wxRefundQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxRefund;
  
  await setLblByIdWxRefund(model);
  
  return model;
}

/**
 * 根据搜索条件查找 微信退款申请 总数
 */
export async function findCountWxRefund(
  search?: WxRefundSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxRefund: Query["findCountWxRefund"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxRefundSearch) {
        findCountWxRefund(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxRefund;
  return count;
}

/**
 * 根据 id 查找 微信退款申请
 */
export async function findByIdWxRefund(
  id: WxRefundId,
  opt?: GqlOpt,
): Promise<WxRefundModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxRefund?: WxRefundModel;
  } = await query({
    query: `
      query($id: WxRefundId!) {
        findByIdWxRefund(id: $id) {
          ${ wxRefundQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxRefund;
  
  await setLblByIdWxRefund(model);
  
  return model;
}

/**
 * 根据 id 查找 微信退款申请, 如果不存在则抛错
 */
export async function findByIdOkWxRefund(
  id: WxRefundId,
  opt?: GqlOpt,
): Promise<WxRefundModel> {
  
  const data: {
    findByIdOkWxRefund: WxRefundModel;
  } = await query({
    query: `
      query($id: WxRefundId!) {
        findByIdOkWxRefund(id: $id) {
          ${ wxRefundQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxRefund;
  
  await setLblByIdWxRefund(model);
  
  return model;
}

/**
 * 根据 ids 查找 微信退款申请
 */
export async function findByIdsWxRefund(
  ids: WxRefundId[],
  opt?: GqlOpt,
): Promise<WxRefundModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxRefund: WxRefundModel[];
  } = await query({
    query: `
      query($ids: [WxRefundId!]!) {
        findByIdsWxRefund(ids: $ids) {
          ${ wxRefundQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxRefund;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxRefund(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 微信退款申请, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxRefund(
  ids: WxRefundId[],
  opt?: GqlOpt,
): Promise<WxRefundModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxRefund: WxRefundModel[];
  } = await query({
    query: `
      query($ids: [WxRefundId!]!) {
        findByIdsOkWxRefund(ids: $ids) {
          ${ wxRefundQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxRefund;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxRefund(model);
  }
  
  return models;
}

/**
 * 导出Excel
 */
export function useExportExcelWxRefund() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxRefundSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxRefundSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllWxRefund(search: $search, page: $page, sort: $sort) {
              ${ wxRefundQueryField }
            }
            getDict(codes: [
              "wx_refund_channel",
              "wx_refund_status",
              "wx_refund_funds_account",
              "wx_pay_notice_currency",
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
      for (const model of data.findAllWxRefund) {
        await setLblByIdWxRefund(model, true);
      }
      try {
        const sheetName = "微信退款申请";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wx_refund.xlsx`,
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
 * 获取 微信退款申请 字段注释
 */
export async function getFieldCommentsWxRefund(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxRefund: Query["getFieldCommentsWxRefund"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxRefund {
          id,
          appid,
          mchid,
          out_trade_no,
          transaction_id,
          out_refund_no,
          refund_id,
          reason,
          channel,
          channel_lbl,
          user_received_account,
          success_time,
          success_time_lbl,
          status,
          status_lbl,
          funds_account,
          funds_account_lbl,
          amount_total,
          amount_refund,
          amount_payer_total,
          amount_payer_refund,
          amount_settlement_refund,
          amount_discount_refund,
          amount_currency,
          amount_currency_lbl,
          amount_refund_fee,
          rem,
          create_time,
          create_time_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsWxRefund as WxRefundFieldComment;
  
  return field_comments;
}

export function getPagePathWxRefund() {
  return "/wx/wx_refund";
}

/** 新增时的默认值 */
export async function getDefaultInputWxRefund() {
  const defaultInput: WxRefundInput = {
    channel: WxRefundChannel.Original,
    status: WxRefundStatus.Processing,
    funds_account: WxRefundFundsAccount.Unsettled,
    amount_total: 0,
    amount_refund: 0,
    amount_payer_total: 0,
    amount_payer_refund: 0,
    amount_settlement_refund: 0,
    amount_discount_refund: 0,
    amount_currency: WxRefundAmountCurrency.Cny,
    amount_refund_fee: 0,
  };
  return defaultInput;
}
