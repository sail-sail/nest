import type {
  PayTransactionsJsapiId,
} from "@/typings/ids";

import {
  PayTransactionsJsapiTradeState,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  PayTransactionsJsapiSearch,
  PayTransactionsJsapiInput,
  PayTransactionsJsapiModel,
} from "#/types";

async function setLblById(
  model?: PayTransactionsJsapiModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找微信JSAPI下单列表
 * @param {PayTransactionsJsapiSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PayTransactionsJsapiSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPayTransactionsJsapi: Query["findAllPayTransactionsJsapi"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PayTransactionsJsapiSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPayTransactionsJsapi(search: $search, page: $page, sort: $sort) {
          id
          appid
          mchid
          description
          out_trade_no
          transaction_id
          trade_state
          trade_state_lbl
          trade_state_desc
          success_time
          success_time_lbl
          time_expire
          attach
          attach2
          notify_url
          support_fapiao
          support_fapiao_lbl
          total_fee
          currency
          currency_lbl
          openid
          prepay_id
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
  const models = data.findAllPayTransactionsJsapi;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个微信JSAPI下单
 * @param {PayTransactionsJsapiSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: PayTransactionsJsapiSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePayTransactionsJsapi: Query["findOnePayTransactionsJsapi"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PayTransactionsJsapiSearch, $sort: [SortInput!]) {
        findOnePayTransactionsJsapi(search: $search, sort: $sort) {
          id
          appid
          mchid
          description
          out_trade_no
          transaction_id
          trade_state
          trade_state_lbl
          trade_state_desc
          success_time
          success_time_lbl
          time_expire
          attach
          attach2
          notify_url
          support_fapiao
          support_fapiao_lbl
          total_fee
          currency
          currency_lbl
          openid
          prepay_id
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
  const model = data.findOnePayTransactionsJsapi;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找微信JSAPI下单总数
 * @param {PayTransactionsJsapiSearch} search?
 * @param {GqlOpt} opt?
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
 * @param {PayTransactionsJsapiId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: PayTransactionsJsapiId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPayTransactionsJsapi: Query["findByIdPayTransactionsJsapi"];
  } = await query({
    query: /* GraphQL */ `
      query($id: PayTransactionsJsapiId!) {
        findByIdPayTransactionsJsapi(id: $id) {
          id
          appid
          mchid
          description
          out_trade_no
          transaction_id
          trade_state
          trade_state_lbl
          trade_state_desc
          success_time
          success_time_lbl
          time_expire
          attach
          attach2
          notify_url
          support_fapiao
          support_fapiao_lbl
          total_fee
          currency
          currency_lbl
          openid
          prepay_id
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
  const model = data.findByIdPayTransactionsJsapi;
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
        query: /* GraphQL */ `
          query($search: PayTransactionsJsapiSearch, $sort: [SortInput!]) {
            findAllPayTransactionsJsapi(search: $search, sort: $sort) {
              id
              appid
              mchid
              description
              out_trade_no
              transaction_id
              trade_state
              trade_state_lbl
              trade_state_desc
              success_time
              success_time_lbl
              time_expire
              attach
              attach2
              notify_url
              support_fapiao
              support_fapiao_lbl
              total_fee
              currency
              currency_lbl
              openid
              prepay_id
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: PayTransactionsJsapiInput = {
    trade_state: PayTransactionsJsapiTradeState.NOTPAY,
    trade_state_desc: "未支付",
    support_fapiao: 0,
    total_fee: 0,
  };
  return defaultInput;
}
