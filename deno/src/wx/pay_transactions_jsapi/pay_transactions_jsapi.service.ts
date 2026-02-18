import {
  log,
} from "/lib/context.ts";

import {
  findOnePayTransactionsJsapi,
  validateOptionPayTransactionsJsapi,
} from "/gen/wx/pay_transactions_jsapi/pay_transactions_jsapi.dao.ts";

import {
  PayTransactionsJsapiTradeState,
} from "/gen/types.ts";

import * as pay_transactions_jsapiSrcDao from "./pay_transactions_jsapi.dao.ts";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 微信支付测试, requestPayment 所需参数
 */
export async function getTestPayOpt(
  appid: string,
) {
  const result = await pay_transactions_jsapiSrcDao.transactions_jsapi(
    appid,
    {
      description: "测试支付",
      amount: {
        total: 1,
      },
    },
  );
  return result;
}

/**
 * 通过 out_trade_no 查询支付状态
 * 轮询最多20次, 每次间隔500ms, 等待微信回调到达
 */
export async function tradeStatePayTransactionsJsapi(
  out_trade_no: string,
) {
  const model = await validateOptionPayTransactionsJsapi(
    await findOnePayTransactionsJsapi({
      out_trade_no,
    }),
  );
  
  if (model.trade_state !== PayTransactionsJsapiTradeState.Notpay) {
    return {
      trade_state: model.trade_state,
      trade_state_desc: model.trade_state_desc,
    };
  }
  
  // 轮询检查支付状态, 最多20次, 每次间隔500ms
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    
    const model2 = await validateOptionPayTransactionsJsapi(
      await findOnePayTransactionsJsapi({
        out_trade_no,
      }),
    );
    
    log(`tradeStatePayTransactionsJsapi polling ${ i + 1 }: ${ model2.trade_state }`);
    
    if (model2.trade_state !== PayTransactionsJsapiTradeState.Notpay) {
      return {
        trade_state: model2.trade_state,
        trade_state_desc: model2.trade_state_desc,
      };
    }
  }
  
  return {
    trade_state: model.trade_state,
    trade_state_desc: model.trade_state_desc,
  };
}
