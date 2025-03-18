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
