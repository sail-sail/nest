/**
 * 微信支付测试, requestPayment 所需参数
 */
export async function getTestPayOpt(
  appid: string,
) {
  const {
    getTestPayOpt,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const data = await getTestPayOpt(appid);
  
  return data;
}

/**
 * 通过 out_trade_no 查询支付状态
 */
export async function tradeStatePayTransactionsJsapi(
  out_trade_no: string,
) {
  const {
    tradeStatePayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  return await tradeStatePayTransactionsJsapi(out_trade_no);
}
