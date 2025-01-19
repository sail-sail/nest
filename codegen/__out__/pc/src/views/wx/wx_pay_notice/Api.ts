

import {
  WxPayNoticeTradeState,
  WxPayNoticeCurrency,
  WxPayNoticePayerCurrency,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxPayNoticeQueryField,
} from "./Model";

async function setLblById(
  model?: WxPayNoticeModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: WxPayNoticeInput,
) {
  const input: WxPayNoticeInput = {
    // ID
    id: model?.id,
    // 开发者ID
    appid: model?.appid,
    // 商户号
    mchid: model?.mchid,
    // 用户标识
    openid: model?.openid,
    // 商户订单号
    out_trade_no: model?.out_trade_no,
    // 微信支付订单号
    transaction_id: model?.transaction_id,
    // 交易类型
    trade_type: model?.trade_type,
    trade_type_lbl: model?.trade_type_lbl,
    // 交易状态
    trade_state: model?.trade_state,
    trade_state_lbl: model?.trade_state_lbl,
    // 交易状态描述
    trade_state_desc: model?.trade_state_desc,
    // 付款银行
    bank_type: model?.bank_type,
    // 附加数据
    attach: model?.attach,
    // 支付完成时间
    success_time: model?.success_time,
    success_time_lbl: model?.success_time_lbl,
    success_time_save_null: model?.success_time_save_null,
    // 总金额
    total: model?.total,
    // 用户支付金额
    payer_total: model?.payer_total,
    // 货币类型
    currency: model?.currency,
    currency_lbl: model?.currency_lbl,
    // 用户支付币种
    payer_currency: model?.payer_currency,
    payer_currency_lbl: model?.payer_currency_lbl,
    // 商户端设备号
    device_id: model?.device_id,
    // 备注
    rem: model?.rem,
    // 原始数据
    raw: model?.raw,
  };
  return input;
}

/**
 * 根据搜索条件查找微信支付通知列表
 */
export async function findAll(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxPayNotice: WxPayNoticeModel[];
  } = await query({
    query: `
      query($search: WxPayNoticeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxPayNotice(search: $search, page: $page, sort: $sort) {
          ${ wxPayNoticeQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxPayNotice;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个微信支付通知
 */
export async function findOne(
  search?: WxPayNoticeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxPayNotice?: WxPayNoticeModel;
  } = await query({
    query: `
      query($search: WxPayNoticeSearch, $sort: [SortInput!]) {
        findOneWxPayNotice(search: $search, sort: $sort) {
          ${ wxPayNoticeQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneWxPayNotice;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找微信支付通知总数
 */
export async function findCount(
  search?: WxPayNoticeSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxPayNotice: Query["findCountWxPayNotice"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxPayNoticeSearch) {
        findCountWxPayNotice(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxPayNotice;
  return count;
}

/**
 * 根据 id 查找微信支付通知
 */
export async function findById(
  id: WxPayNoticeId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxPayNotice?: WxPayNoticeModel;
  } = await query({
    query: `
      query($id: WxPayNoticeId!) {
        findByIdWxPayNotice(id: $id) {
          ${ wxPayNoticeQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdWxPayNotice;
  await setLblById(model);
  return model;
}

/**
 * 下载微信支付通知导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxPayNotice {
            appid
            mchid
            openid
            out_trade_no
            transaction_id
            trade_type_lbl
            trade_state_lbl
            trade_state_desc
            bank_type
            attach
            success_time_lbl
            total
            payer_total
            currency_lbl
            payer_currency_lbl
            device_id
            rem
            raw
          }
          getDict(codes: [
            "wx_unified_order_trade_type",
            "wx_pay_notice_trade_state",
            "wx_pay_notice_currency",
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
      const sheetName = "微信支付通知";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wx_pay_notice.xlsx`,
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
export function useExportExcel(routePath: string) {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxPayNoticeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxPayNoticeSearch, $sort: [SortInput!]) {
            findAllWxPayNotice(search: $search, page: null, sort: $sort) {
              ${ wxPayNoticeQueryField }
            }
            getDict(codes: [
              "wx_unified_order_trade_type",
              "wx_pay_notice_trade_state",
              "wx_pay_notice_currency",
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
      for (const model of data.findAllWxPayNotice) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "微信支付通知";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wx_pay_notice.xlsx`,
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

export function getPagePath() {
  return "/wx/wx_pay_notice";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxPayNoticeInput = {
    trade_state: WxPayNoticeTradeState.Notpay,
    trade_state_desc: "未支付",
    total: 0,
    payer_total: 0,
    currency: WxPayNoticeCurrency.Cny,
    payer_currency: WxPayNoticePayerCurrency.Cny,
  };
  return defaultInput;
}
