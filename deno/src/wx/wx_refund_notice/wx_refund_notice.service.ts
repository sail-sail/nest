import {
  error,
  log,
} from "/lib/context.ts";

import {
  getWxPayModel,
} from "/src/wx/wx_pay/wx_pay.dao.ts";

import {
  findOneWxPay,
} from "/gen/wx/wx_pay/wx_pay.dao.ts";

import {
  createWxRefundNotice,
  updateTenantByIdWxRefundNotice,
} from "/gen/wx/wx_refund_notice/wx_refund_notice.dao.ts";

import {
  findOneWxRefund,
  updateByIdWxRefund,
} from "/gen/wx/wx_refund/wx_refund.dao.ts";

import {
  WxRefundNoticeRefundStatus,
  WxRefundStatus,
} from "/gen/types.ts";

import {
  Decimal,
} from "decimal.js";

import WxPay from "wechatpay-node-v3";

import {
  Buffer,
} from "node:buffer";

import dayjs from "dayjs";

interface Ipay {
  appid: string;
  mchid: string;
  publicKey: string;
  privateKey: string;
  key?: string;
}

interface RefundNoticeResource {
  mchid: string;
  out_trade_no: string;
  transaction_id: string;
  out_refund_no: string;
  refund_id: string;
  refund_status: string;
  success_time?: string;
  user_received_account: string;
  amount: {
    total: number;
    refund: number;
    payer_total: number;
    payer_refund: number;
  };
}

async function fetchRefund_notice(
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
  const noticeBody = params.body;
  // 数据密文
  const ciphertext = noticeBody.resource.ciphertext;
  // 附加数据
  const associated_data = noticeBody.resource.associated_data;
  // 随机串
  const nonce = noticeBody.resource.nonce;
  // APIv3密钥
  const key = obj.key;
  const data = wxPay.decipher_gcm<RefundNoticeResource>(
    ciphertext,
    associated_data,
    nonce,
    key,
  );
  return data;
}

/**
 * 退款通知
 */
export async function refund_notice(
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
  log(`refund_notice_params: ${ JSON.stringify(params) }`);
  log(`refund_notice_body: ${ JSON.stringify(params.body) }`);
  
  const wx_pay_model0 = await findOneWxPay({
    refund_notify_url: notify_url,
  });
  if (!wx_pay_model0 || !wx_pay_model0.appid) {
    error(`退款回调地址: ${ notify_url } 未配置微信支付`);
    return;
  }
  const wx_pay_model = await getWxPayModel(wx_pay_model0);
  const appid = wx_pay_model.appid;
  const mchid = wx_pay_model.mchid;
  const public_key = wx_pay_model.public_key;
  const private_key = wx_pay_model.private_key;
  const v3_key = wx_pay_model.v3_key;
  
  const result = await fetchRefund_notice(
    {
      appid,
      mchid,
      publicKey: public_key,
      privateKey: private_key,
      key: v3_key,
    },
    params,
  );
  
  log(`refund_notice_result: ${ JSON.stringify(result) }`);
  
  const refund_id = result.refund_id;
  const out_refund_no = result.out_refund_no;
  const out_trade_no = result.out_trade_no;
  const transaction_id = result.transaction_id;
  const user_received_account = result.user_received_account;
  
  let success_time: string | undefined = undefined;
  if (result.success_time) {
    success_time = dayjs(result.success_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const amount_total = result.amount.total;
  const amount_refund = result.amount.refund;
  const amount_payer_total = result.amount.payer_total;
  const amount_payer_refund = result.amount.payer_refund;
  
  const refund_status = result.refund_status as unknown as WxRefundNoticeRefundStatus;
  
  // 根据 transaction_id 查询 wx_refund, 更新其状态
  const wx_refund_model = await findOneWxRefund({
    transaction_id,
  });
  
  if (!wx_refund_model) {
    error(`退款通知: 未找到 transaction_id=${ transaction_id } 的退款记录`);
    return;
  }
  
  const tenant_id = wx_refund_model.tenant_id;
  const attach2 = wx_refund_model.attach2;
  
  // 创建退款通知记录
  const wx_refund_notice_id = await createWxRefundNotice({
    appid: wx_refund_model.appid,
    mchid: wx_refund_model.mchid,
    refund_id,
    out_trade_no,
    transaction_id,
    out_refund_no,
    refund_status,
    success_time,
    user_received_account,
    amount_total,
    amount_refund,
    amount_payer_total,
    amount_payer_refund,
  });
  
  await updateTenantByIdWxRefundNotice(
    wx_refund_notice_id,
    tenant_id,
  );
  
  // 更新 wx_refund 的状态
  const wx_refund_status: WxRefundStatus = (() => {
    switch (refund_status) {
      case WxRefundNoticeRefundStatus.Success:
        return WxRefundStatus.Success;
      case WxRefundNoticeRefundStatus.Closed:
        return WxRefundStatus.Closed;
      case WxRefundNoticeRefundStatus.Processing:
        return WxRefundStatus.Processing;
      case WxRefundNoticeRefundStatus.Abnormal:
        return WxRefundStatus.Abnormal;
      default:
        return WxRefundStatus.NoRefund;
    }
  })();
  
  await updateByIdWxRefund(
    wx_refund_model.id,
    {
      refund_id,
      out_trade_no,
      status: wx_refund_status,
      success_time,
    },
  );
  
  if (refund_status !== WxRefundNoticeRefundStatus.Success) {
    error(`退款通知: 退款状态非成功: ${ refund_status }`);
    return;
  }
  
  if (!attach2) {
    error(`refund_notice_attach2: attach2 为空!`);
    return;
  }
  
  const attach2Obj = JSON.parse(attach2);
  const action = attach2Obj.action;
  
  const amt = new Decimal(amount_payer_refund).div(100);
  
  log(`refund_notice_attach2: action: ${ action } amt: ${ amt } ${ JSON.stringify(attach2Obj) }`);
  
  // TODO: handle action
}
