import type {
  Query,
} from "#/types.ts";

/** 通过 out_trade_no 查询支付状态 */
export async function tradeStatePayTransactionsJsapi(
  out_trade_no: string,
) {
  const res: {
    tradeStatePayTransactionsJsapi: Query["tradeStatePayTransactionsJsapi"],
  } = await query({
    query: `
      query($out_trade_no: String!) {
        tradeStatePayTransactionsJsapi(out_trade_no: $out_trade_no) {
          trade_state
          trade_state_desc
        }
      }
    `,
    variables: {
      out_trade_no,
    },
  });
  
  const pay_transactions_jsapi_model = res.tradeStatePayTransactionsJsapi;
  
  return pay_transactions_jsapi_model;
}