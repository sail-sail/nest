// deno run -A ./lib/wechatpay-node-v3/test/mod_test.ts
import WxPay from "wechatpay-node-v3";
import fs from "node:fs";

const __filename = import.meta.url.replace("file:///","");
const __dirname = __filename.substring(0, __filename.lastIndexOf("/"));
 
const wxPay = new WxPay({
  appid: "wx28e52faff22e8837",
  mchid: "1550006391",
  publicKey: fs.readFileSync(`${ __dirname }/apiclient_cert.pem`),
  privateKey: fs.readFileSync(`${ __dirname }/apiclient_key.pem`),
  key: "bYU2inpj3Z87GMqRqTpfbkl9TEGLxfOt",
});
const params = {
  description: '测试',
  out_trade_no: '订单号',
  notify_url: '回调url',
  amount: {
    total: 1,
  },
  payer: {
    openid: 'drEc8QfY',
  },
  scene_info: {
    payer_client_ip: 'ip',
  },
};
 
// {
//   status: 400,
//   code: "PARAM_ERROR",
//   detail: {
//     location: "body",
//     value: "订单号",
//   },
//   message: "输入源“/body/out_trade_no”映射到值字段“商户订单号”字符串规则校验失败，字符串必须匹配正则表达式“^[0-9a-zA-Z_\\-\\|\\*]+$”",
// }
const res = await wxPay.transactions_jsapi(params);
console.log(res);
