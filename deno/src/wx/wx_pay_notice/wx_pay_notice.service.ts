import {
  error,
  log,
} from "/lib/context.ts";

import {
  getWxPayModel,
} from "/src/wx/wx_pay/wx_pay.dao.ts";

import {
  findOne as findOneWxPay,
} from "/gen/wx/wx_pay/wx_pay.dao.ts";

import {
  create as createWxPayNotice,
  updateById as updateByIdWxPayNotice,
} from "/gen/wx/wx_pay_notice/wx_pay_notice.dao.ts";

import {
  findOne as findOnePayTransactionsJsapi,
  validateOption as validateOptionTransactionsJsapi,
  updateById as updateByIdTransactionsJsapi,
} from "/gen/wx/pay_transactions_jsapi/pay_transactions_jsapi.dao.ts";

import dayjs from "dayjs";

import {
  Decimal,
} from "decimal.js";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import WxPay from "wechatpay-node-v3";

import {
  WxPayNoticeTradeType,
  WxPayNoticeTradeState,
  WxPayNoticeCurrency,
  WxPayNoticePayerCurrency,
  PayTransactionsJsapiTradeState,
} from "/gen/types.ts";

import {
  Buffer,
} from "node:buffer";

interface Ipay {
  appid: string; //  直连商户申请的公众号或移动应用appid。
  mchid: string; // 商户号
  serial_no?: string; // 证书序列号
  publicKey: string; // 公钥
  privateKey: string; // 密钥
  authType?: string; // 认证类型，目前为WECHATPAY2-SHA256-RSA2048
  userAgent?: string;
  key?: string;
}

/*
{
  "mchid": "1550006391",
  "appid": "wx28e52faff22e8837",
  "out_trade_no": "443aafc9179549ddacb75c95efdb7799",
  "transaction_id": "4200001740202302084175053914",
  "trade_type": "JSAPI",
  "trade_state": "SUCCESS",
  "trade_state_desc": "支付成功",
  "bank_type": "OTHERS",
  "attach": "",
  "success_time": "2023-02-08T18:52:29+08:00",
  "payer": {
    "openid": "o2tur4paomwplOlVeKL8z-cDkKFE"
  },
  "amount": {
    "total": 1,
    "payer_total": 1,
    "currency": "CNY",
    "payer_currency": "CNY"
  }
}
*/
interface PayNoticeBody {
  mchid: string;
  appid: string;
  out_trade_no: string;
  transaction_id: string;
  trade_type: string;
  trade_state: string;
  trade_state_desc: string;
  bank_type: string;
  attach: string;
  success_time: string;
  payer: {
    openid: string;
  };
  amount: {
    total: number;
    payer_total: number;
    currency: string;
    payer_currency: string;
  };
  device_id: string;
}

async function fetchPay_notice(
  obj: Ipay,
  params: {
    // deno-lint-ignore no-explicit-any
    body: any;
    signature: string;
    serial: string;
    nonce: string;
    timestamp: string;
  },
) {
  const wxPay = new WxPay({
    appid: obj.appid,
    mchid: obj.mchid,
    publicKey: Buffer.from(obj.publicKey),
    privateKey: Buffer.from(obj.privateKey),
    key: obj.key,
  });
  const ret = await wxPay.verifySign(params);
  if (!ret) {
    throw new Error("签名验证失败");
  }
  const pay_noticeBody = params.body;
  // 数据密文
  const ciphertext = pay_noticeBody.resource.ciphertext;
  // 附加数据
  const associated_data = pay_noticeBody.resource.associated_data;
  // 随机串
  const nonce = pay_noticeBody.resource.nonce;
  // APIv3密钥
  const key = obj.key;
  const data = wxPay.decipher_gcm<PayNoticeBody>(ciphertext, associated_data, nonce, key);
  return data;
}

/**
 * 支付通知
**/
export async function pay_notice(
  notify_url: string,
  params: {
    // deno-lint-ignore no-explicit-any
    body: any;
    signature: string;
    serial: string;
    nonce: string;
    timestamp: string;
  },
) {
  log(`pay_notice_params: ${ JSON.stringify(params) }`);
  /*
  {
    "id": "19784e48-5800-57c1-a9e7-ea5ec6cc3e2c",
    "create_time": "2023-02-08T18:50:07+08:00",
    "resource_type": "encrypt-resource",
    "event_type": "TRANSACTION.SUCCESS",
    "summary": "支付成功",
    "resource": {
      "original_type": "transaction",
      "algorithm": "AEAD_AES_256_GCM",
      "ciphertext": "goMqsaZa+OH/70QLKZFh7hl+mXkI6V9HGkHFOQw7V4f9l2zm1JdVZeiVXnUuhfo3vMlklZGztjdGd+wi8TF8afC5BFB1v2TG6g+pr6h0xUU2r7sjaG4Cv2ZfWiRrB1guA6UZH1nkrVCsO61hb8uuq0OMMuWNCxGGAWrYg5A1CHsdAeQPbiAyxE+hlkt6cRonp20fSnrsk1ofoiBAPs+I1PGG9w5WOfuy+kgvjLRwLXWv6QFyMkSijFUYCTrVmp7U8833x8NdPDfone1nsAUlHgXidGvvC3QKGhuBTycLHiC8EcwFGcktzUUSKucmXSeI/ggptKUxwmoLoHBUo49x8PKQj9oiYNiPhQbm7rHJPC5LuF/u3HaiNV7ijRgvJuJ1Ctk1KuxlxCes8YGUASuxPmrcgVEpZQXvzIV5w6wrIJ+4lcFSUtycDU0rfNC77usJT7bjpndi+7opdEbjf488CcGIRy7EJ7YL2uqlXDEnZGXuY3Kl/o4w4yspiTTfm6Qo633crhH9DQ4DRQj45gsCIYmP8VjK/HkaG0mUzLF3gqe8nxgh9CWgMLOCsDVtHpiCfspAOfFk2cQrfqC/f9a9",
      "associated_data": "transaction",
      "nonce": "p1dNx5tmwsyk"
    }
  }
  */
  log(`pay_notice_body: ${ JSON.stringify(params.body) }`);
  const wx_payModel0 = await findOneWxPay({
    notify_url,
  });
  if (!wx_payModel0 || !wx_payModel0.appid) {
    error(`回调地址: ${ notify_url } 未配置微信支付`);
    return;
  }
  const wx_payModel = await getWxPayModel(wx_payModel0);
  const appid = wx_payModel.appid;
  const mchid = wx_payModel.mchid;
  const public_key = wx_payModel.public_key;
  const private_key = wx_payModel.private_key;
  const v3_key = wx_payModel.v3_key;
  
  const result = await fetchPay_notice(
    {
      appid,
      mchid,
      publicKey: public_key,
      privateKey: private_key,
      key: v3_key,
    },
    params,
  );
  log(`pay_notice_result: ${ JSON.stringify(result) }`);
  let success_time: string | undefined = undefined;
  if (result.success_time) {
    success_time = dayjs(result.success_time).format("YYYY-MM-DD HH:mm:ss");
  }
  /*
  {
    "mchid": "1550006391",
    "appid": "wx28e52faff22e8837",
    "out_trade_no": "443aafc9179549ddacb75c95efdb7799",
    "transaction_id": "4200001740202302084175053914",
    "trade_type": "JSAPI",
    "trade_state": "SUCCESS",
    "trade_state_desc": "支付成功",
    "bank_type": "OTHERS",
    "attach": "",
    "success_time": "2023-02-08T18:52:29+08:00",
    "payer": {
      "openid": "o2tur4paomwplOlVeKL8z-cDkKFE"
    },
    "amount": {
      "total": 1,
      "payer_total": 1,
      "currency": "CNY",
      "payer_currency": "CNY"
    }
  }
  */
  // 记录订单
  const wx_pay_noticeId: WxPayNoticeId = await createWxPayNotice({
    appid: result.appid,
    mchid: result.mchid,
    openid: result.payer.openid,
    out_trade_no: result.out_trade_no,
    transaction_id: result.transaction_id,
    trade_type: result.trade_type as unknown as WxPayNoticeTradeType,
    trade_state: result.trade_state as unknown as WxPayNoticeTradeState,
    trade_state_desc: result.trade_state_desc,
    bank_type: result.bank_type,
    attach: result.attach,
    success_time,
    total: result.amount.total,
    payer_total: result.amount.payer_total,
    currency: result.amount.currency as unknown as WxPayNoticeCurrency,
    payer_currency: result.amount.payer_currency as unknown as WxPayNoticePayerCurrency,
    device_id: result.device_id,
    raw: JSON.stringify(result),
  });
  const transaction_id = result.transaction_id;
  const trade_state = result.trade_state as unknown as PayTransactionsJsapiTradeState;
  const trade_type = result.trade_type;
  const out_trade_no = result.out_trade_no;
  const trade_state_desc = result.trade_state_desc;
  const total = result.amount.total;
  
  const pay_transactions_jsapiModel = await validateOptionTransactionsJsapi(
    await findOnePayTransactionsJsapi({
      out_trade_no,
    }),
  );
  const pay_transactions_jsapi_id: PayTransactionsJsapiId = pay_transactions_jsapiModel.id;
  const tenant_id: TenantId = pay_transactions_jsapiModel.tenant_id;
  const attach2 = pay_transactions_jsapiModel.attach2;
  
  if (trade_state === "SUCCESS" && trade_type === "JSAPI") {
    await updateByIdWxPayNotice(
      wx_pay_noticeId,
      {
        tenant_id,
      },
    );
    
    await updateByIdTransactionsJsapi(
      pay_transactions_jsapi_id,
      {
        transaction_id,
        trade_state,
        trade_state_desc,
        success_time,
      },
    );
  } else {
    error(`支付回调失败: ${ JSON.stringify(result) }`);
    return;
  }
  if (isEmpty(attach2)) {
    error(`pay_notice_attach2: attach2 为空!`);
    return;
  }
  const attach2Obj = JSON.parse(attach2);
  const action = attach2Obj.action;
  
  const amt = new Decimal(total / 100);
  const integral = Math.floor(total / 100);
  // if (action === "recharge_card") {
  // }
}
