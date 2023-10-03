import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  WxPayNoticeSearch,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
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
  const res = data.findAllWxPayNotice;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
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
  const res = data.findCountWxPayNotice;
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
    findByIdWxPayNotice: Query["findByIdWxPayNotice"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
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
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdWxPayNotice;
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
        prop: "create_time",
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
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllUsr {
            id
            lbl
          }
          getDictbiz(codes: [
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/wx/wx_pay_notice.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("微信支付通知") }${ await nsAsync("导入") }`);
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
    search?: WxPayNoticeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
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
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllUsr {
            lbl
          }
          getDictbiz(codes: [
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
      const buffer = await workerFn(
        `${ location.origin }/excel_template/wx/wx_pay_notice.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("微信支付通知"));
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
