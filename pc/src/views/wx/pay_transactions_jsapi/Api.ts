

import {
  PayTransactionsJsapiTradeState,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  payTransactionsJsapiQueryField,
} from "./Model";

async function setLblById(
  model?: PayTransactionsJsapiModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
    // 附加数据2
    attach2: model?.attach2,
    // 通知地址
    notify_url: model?.notify_url,
    // 是否支持发票
    support_fapiao: model?.support_fapiao,
    support_fapiao_lbl: model?.support_fapiao_lbl,
    // 订单金额(分)
    total_fee: model?.total_fee,
    // 货币类型
    currency: model?.currency,
    currency_lbl: model?.currency_lbl,
    // 用户标识
    openid: model?.openid,
    // 预支付交易会话标识
    prepay_id: model?.prepay_id,
  };
  return input;
}

/**
 * 根据搜索条件查找微信JSAPI下单列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个微信JSAPI下单
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找微信JSAPI下单总数
 */
export async function findCount(
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
 * 根据 id 查找微信JSAPI下单
 */
export async function findById(
  id: PayTransactionsJsapiId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
}

/**
 * 下载微信JSAPI下单导入模板
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
          getFieldCommentsPayTransactionsJsapi {
            appid
            mchid
            description
            out_trade_no
            transaction_id
            trade_state_lbl
            trade_state_desc
            success_time_lbl
            time_expire
            attach
            attach2
            notify_url
            support_fapiao_lbl
            total_fee
            currency_lbl
            openid
            prepay_id
          }
          getDict(codes: [
            "wx_pay_notice_trade_state",
            "is_enabled",
            "wx_pay_notice_currency",
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
      const sheetName = await nsAsync("微信JSAPI下单");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/pay_transactions_jsapi.xlsx`,
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
              "is_enabled",
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
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("微信JSAPI下单");
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

export function getPagePath() {
  return "/wx/pay_transactions_jsapi";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: PayTransactionsJsapiInput = {
    trade_state: PayTransactionsJsapiTradeState.Notpay,
    trade_state_desc: "未支付",
    support_fapiao: 0,
    total_fee: 0,
  };
  return defaultInput;
}
