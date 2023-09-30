import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  PayTransactionsJsapiSearch,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
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
  const res = data.findAllPayTransactionsJsapi;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
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
  const res = data.findCountPayTransactionsJsapi;
  return res;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPayTransactionsJsapi: Query["findByIdPayTransactionsJsapi"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
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
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdPayTransactionsJsapi;
  return res;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: Query["findAllUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllUsr;
  return res;
}

export async function getUsrList() {
  const data = await findAllUsr(
    undefined,
    {
    },
    [
      {
        prop: "update_time",
        order: "descending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

/**
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nAsync,
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
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "is_enabled",
          ]) {
            code
            lbl
          }
          getDictbiz(codes: [
            "wx_pay_notice_trade_state",
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/wx/pay_transactions_jsapi.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("微信JSAPI下单") }${ await nsAsync("导入") }`);
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
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: PayTransactionsJsapiSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
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
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllUsr {
            lbl
          }
          getDict(codes: [
            "is_enabled",
          ]) {
            code
            lbl
          }
          getDictbiz(codes: [
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
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/wx/pay_transactions_jsapi.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("微信JSAPI下单"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
      throw err;
    }
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}
