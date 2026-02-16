

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxRefundNoticeQueryField,
} from "./Model.ts";

export async function setLblByIdWxRefundNotice(
  model?: WxRefundNoticeModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxRefundNotice(
  model?: WxRefundNoticeInput,
) {
  const input: WxRefundNoticeInput = {
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
    // 退款状态
    refund_status: model?.refund_status,
    refund_status_lbl: model?.refund_status_lbl,
    // 退款成功时间
    success_time: model?.success_time,
    success_time_lbl: model?.success_time_lbl,
    success_time_save_null: model?.success_time_save_null,
    // 退款入账账户
    user_received_account: model?.user_received_account,
    // 订单金额(分)
    amount_total: model?.amount_total != null ? Number(model?.amount_total || 0) : undefined,
    // 退款金额(分)
    amount_refund: model?.amount_refund != null ? Number(model?.amount_refund || 0) : undefined,
    // 用户实际支付金额(分)
    amount_payer_total: model?.amount_payer_total != null ? Number(model?.amount_payer_total || 0) : undefined,
    // 用户退款金额(分)
    amount_payer_refund: model?.amount_payer_refund != null ? Number(model?.amount_payer_refund || 0) : undefined,
  };
  return input;
}

/**
 * 根据搜索条件查找 微信退款通知 列表
 */
export async function findAllWxRefundNotice(
  search?: WxRefundNoticeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxRefundNotice: WxRefundNoticeModel[];
  } = await query({
    query: `
      query($search: WxRefundNoticeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxRefundNotice(search: $search, page: $page, sort: $sort) {
          ${ wxRefundNoticeQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxRefundNotice;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxRefundNotice(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 微信退款通知
 */
export async function findOneWxRefundNotice(
  search?: WxRefundNoticeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxRefundNotice?: WxRefundNoticeModel;
  } = await query({
    query: `
      query($search: WxRefundNoticeSearch, $sort: [SortInput!]) {
        findOneWxRefundNotice(search: $search, sort: $sort) {
          ${ wxRefundNoticeQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxRefundNotice;
  
  await setLblByIdWxRefundNotice(model);
  
  return model;
}

/**
 * 根据条件查找第一个 微信退款通知, 如果不存在则抛错
 */
export async function findOneOkWxRefundNotice(
  search?: WxRefundNoticeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxRefundNotice?: WxRefundNoticeModel;
  } = await query({
    query: `
      query($search: WxRefundNoticeSearch, $sort: [SortInput!]) {
        findOneOkWxRefundNotice(search: $search, sort: $sort) {
          ${ wxRefundNoticeQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxRefundNotice;
  
  await setLblByIdWxRefundNotice(model);
  
  return model;
}

/**
 * 根据搜索条件查找 微信退款通知 总数
 */
export async function findCountWxRefundNotice(
  search?: WxRefundNoticeSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxRefundNotice: Query["findCountWxRefundNotice"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxRefundNoticeSearch) {
        findCountWxRefundNotice(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxRefundNotice;
  return count;
}

/**
 * 根据 id 查找 微信退款通知
 */
export async function findByIdWxRefundNotice(
  id: WxRefundNoticeId,
  opt?: GqlOpt,
): Promise<WxRefundNoticeModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxRefundNotice?: WxRefundNoticeModel;
  } = await query({
    query: `
      query($id: WxRefundNoticeId!) {
        findByIdWxRefundNotice(id: $id) {
          ${ wxRefundNoticeQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxRefundNotice;
  
  await setLblByIdWxRefundNotice(model);
  
  return model;
}

/**
 * 根据 id 查找 微信退款通知, 如果不存在则抛错
 */
export async function findByIdOkWxRefundNotice(
  id: WxRefundNoticeId,
  opt?: GqlOpt,
): Promise<WxRefundNoticeModel> {
  
  const data: {
    findByIdOkWxRefundNotice: WxRefundNoticeModel;
  } = await query({
    query: `
      query($id: WxRefundNoticeId!) {
        findByIdOkWxRefundNotice(id: $id) {
          ${ wxRefundNoticeQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxRefundNotice;
  
  await setLblByIdWxRefundNotice(model);
  
  return model;
}

/**
 * 根据 ids 查找 微信退款通知
 */
export async function findByIdsWxRefundNotice(
  ids: WxRefundNoticeId[],
  opt?: GqlOpt,
): Promise<WxRefundNoticeModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxRefundNotice: WxRefundNoticeModel[];
  } = await query({
    query: `
      query($ids: [WxRefundNoticeId!]!) {
        findByIdsWxRefundNotice(ids: $ids) {
          ${ wxRefundNoticeQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxRefundNotice;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxRefundNotice(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 微信退款通知, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxRefundNotice(
  ids: WxRefundNoticeId[],
  opt?: GqlOpt,
): Promise<WxRefundNoticeModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxRefundNotice: WxRefundNoticeModel[];
  } = await query({
    query: `
      query($ids: [WxRefundNoticeId!]!) {
        findByIdsOkWxRefundNotice(ids: $ids) {
          ${ wxRefundNoticeQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxRefundNotice;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxRefundNotice(model);
  }
  
  return models;
}

/**
 * 导出Excel
 */
export function useExportExcelWxRefundNotice() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxRefundNoticeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxRefundNoticeSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllWxRefundNotice(search: $search, page: $page, sort: $sort) {
              ${ wxRefundNoticeQueryField }
            }
            getDict(codes: [
              "wx_refund_status",
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
      for (const model of data.findAllWxRefundNotice) {
        await setLblByIdWxRefundNotice(model, true);
      }
      try {
        const sheetName = "微信退款通知";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wx_refund_notice.xlsx`,
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
 * 获取 微信退款通知 字段注释
 */
export async function getFieldCommentsWxRefundNotice(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxRefundNotice: Query["getFieldCommentsWxRefundNotice"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxRefundNotice {
          id,
          appid,
          mchid,
          out_trade_no,
          transaction_id,
          out_refund_no,
          refund_id,
          refund_status,
          refund_status_lbl,
          success_time,
          success_time_lbl,
          user_received_account,
          amount_total,
          amount_refund,
          amount_payer_total,
          amount_payer_refund,
          create_time,
          create_time_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsWxRefundNotice as WxRefundNoticeFieldComment;
  
  return field_comments;
}

export function getPagePathWxRefundNotice() {
  return "/wx/wx_refund_notice";
}

/** 新增时的默认值 */
export async function getDefaultInputWxRefundNotice() {
  const defaultInput: WxRefundNoticeInput = {
    refund_status: "PROCESSING",
    amount_total: 0,
    amount_refund: 0,
    amount_payer_total: 0,
    amount_payer_refund: 0,
  };
  return defaultInput;
}
