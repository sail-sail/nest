import type {
  WxPayNoticeId,
} from "@/typings/ids";

import {
  WxPayNoticeTradeState,
  WxPayNoticeCurrency,
  WxPayNoticePayerCurrency,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  WxPayNoticeSearch,
  WxPayNoticeInput,
  WxPayNoticeModel,
} from "#/types";

async function setLblById(
  model?: WxPayNoticeModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: WxPayNoticeInput = {
    id: model?.id,
    appid: model?.appid,
    mchid: model?.mchid,
    openid: model?.openid,
    out_trade_no: model?.out_trade_no,
    transaction_id: model?.transaction_id,
    trade_type: model?.trade_type,
    trade_type_lbl: model?.trade_type_lbl,
    trade_state: model?.trade_state,
    trade_state_lbl: model?.trade_state_lbl,
    trade_state_desc: model?.trade_state_desc,
    bank_type: model?.bank_type,
    attach: model?.attach,
    success_time: model?.success_time,
    success_time_lbl: model?.success_time_lbl,
    total: model?.total,
    payer_total: model?.payer_total,
    currency: model?.currency,
    currency_lbl: model?.currency_lbl,
    payer_currency: model?.payer_currency,
    payer_currency_lbl: model?.payer_currency_lbl,
    device_id: model?.device_id,
    rem: model?.rem,
    raw: model?.raw,
  };
  return input;
}

/**
 * 根据搜索条件查找微信支付通知列表
 * @param {WxPayNoticeSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxPayNotice: Query["findAllWxPayNotice"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxPayNoticeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxPayNotice(search: $search, page: $page, sort: $sort) {
          id
          appid
          mchid
          openid
          out_trade_no
          transaction_id
          trade_type
          trade_type_lbl
          trade_state
          trade_state_lbl
          trade_state_desc
          bank_type
          attach
          success_time
          success_time_lbl
          total
          payer_total
          currency
          currency_lbl
          payer_currency
          payer_currency_lbl
          device_id
          rem
          raw
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
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
 * @param {WxPayNoticeSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxPayNoticeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxPayNotice: Query["findOneWxPayNotice"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxPayNoticeSearch, $sort: [SortInput!]) {
        findOneWxPayNotice(search: $search, sort: $sort) {
          id
          appid
          mchid
          openid
          out_trade_no
          transaction_id
          trade_type
          trade_type_lbl
          trade_state
          trade_state_lbl
          trade_state_desc
          bank_type
          attach
          success_time
          success_time_lbl
          total
          payer_total
          currency
          currency_lbl
          payer_currency
          payer_currency_lbl
          device_id
          rem
          raw
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
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
 * @param {WxPayNoticeSearch} search?
 * @param {GqlOpt} opt?
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
 * @param {WxPayNoticeId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxPayNoticeId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxPayNotice: Query["findByIdWxPayNotice"];
  } = await query({
    query: /* GraphQL */ `
      query($id: WxPayNoticeId!) {
        findByIdWxPayNotice(id: $id) {
          id
          appid
          mchid
          openid
          out_trade_no
          transaction_id
          trade_type
          trade_type_lbl
          trade_state
          trade_state_lbl
          trade_state_desc
          bank_type
          attach
          success_time
          success_time_lbl
          total
          payer_total
          currency
          currency_lbl
          payer_currency
          payer_currency_lbl
          device_id
          rem
          raw
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
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
 * 下载导入模板
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
      const sheetName = await nsAsync("微信支付通知");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wx_pay_notice.xlsx`,
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
    search?: WxPayNoticeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: WxPayNoticeSearch, $sort: [SortInput!]) {
            findAllWxPayNotice(search: $search, sort: $sort) {
              id
              appid
              mchid
              openid
              out_trade_no
              transaction_id
              trade_type
              trade_type_lbl
              trade_state
              trade_state_lbl
              trade_state_desc
              bank_type
              attach
              success_time
              success_time_lbl
              total
              payer_total
              currency
              currency_lbl
              payer_currency
              payer_currency_lbl
              device_id
              rem
              raw
              create_usr_id
              create_usr_id_lbl
              create_time
              create_time_lbl
              update_usr_id
              update_usr_id_lbl
              update_time
              update_time_lbl
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
      try {
        const sheetName = await nsAsync("微信支付通知");
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
