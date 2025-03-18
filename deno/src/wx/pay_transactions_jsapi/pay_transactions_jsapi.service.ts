import * as pay_transactions_jsapiSrcDao from "./pay_transactions_jsapi.dao.ts";

/**
 * 微信支付测试, requestPayment 所需参数
 */
export async function getTestPayOpt(
  appid: string,
) {
  const result = await pay_transactions_jsapiSrcDao.transactions_jsapi(
    appid,
    {
      description: "测试22",
      amount: {
        total: 1,
      },
    },
  );
  return result;
}
