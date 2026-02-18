import {
  log,
} from "/lib/context.ts";

import {
  getWxPayModel,
} from "/src/wx/wx_pay/wx_pay.dao.ts";

import {
  findOneWxPay,
  validateOptionWxPay,
  validateIsEnabledWxPay,
} from "/gen/wx/wx_pay/wx_pay.dao.ts";

import {
  findByIdTenant,
  validateOptionTenant,
  validateIsEnabledTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findByIdOkDomain,
  validateIsEnabledDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  createWxRefund,
  updateTenantByIdWxRefund,
} from "/gen/wx/wx_refund/wx_refund.dao.ts";

import {
  findOneOkPayTransactionsJsapi,
} from "/gen/wx/pay_transactions_jsapi/pay_transactions_jsapi.dao.ts";

import {
  WxRefundAmountCurrency,
} from "/gen/types.ts";

import type {
  WxRefundChannel,
  WxRefundStatus,
  WxRefundFundsAccount,
} from "/gen/types.ts";

import WxPay from "wechatpay-node-v3";

import {
  Buffer,
} from "node:buffer";

import dayjs from "dayjs";

interface RefundInput {
  /** 微信支付订单号 */
  transaction_id: string;
  /** 退款金额(分) */
  amount_refund: number;
  /** 订单总金额(分) */
  amount_total: number;
  /** 退款原因 */
  reason?: string;
  /** 附加数据2 (业务标识) */
  attach2?: string;
}

/**
 * 发起退款申请
 */
export async function refund(
  input: RefundInput,
): Promise<WxRefundId> {
  
  log(`wx_refund.refund: ${ JSON.stringify(input) }`);
  
  const {
    transaction_id,
    amount_refund,
    amount_total,
    reason,
    attach2,
  } = input;
  
  if (!transaction_id) {
    throw "微信支付订单号不能为空";
  }
  if (!amount_refund || amount_refund <= 0) {
    throw "退款金额必须大于0";
  }
  if (!amount_total || amount_total <= 0) {
    throw "订单总金额必须大于0";
  }
  
  // 通过 transaction_id 查找微信商户订单
  const pay_transactions_jsapi_model = await findOneOkPayTransactionsJsapi(
    {
      transaction_id,
    },
  );
  
  const out_trade_no = pay_transactions_jsapi_model.out_trade_no;
  if (!out_trade_no) {
    throw "微信支付订单号对应的商户订单号不能为空";
  }
  
  const appid = pay_transactions_jsapi_model.appid;
  
  // 查找微信支付配置
  const wx_pay_model0 = await validateOptionWxPay(
    await findOneWxPay({
      appid,
    }),
  );
  await validateIsEnabledWxPay(wx_pay_model0);
  
  const wx_pay_model = await getWxPayModel(wx_pay_model0);
  
  const tenant_id = wx_pay_model.tenant_id;
  if (!tenant_id) {
    throw "tenant_id 不能为空";
  }
  
  const tenant_model = await validateOptionTenant(
    await findByIdTenant(tenant_id),
  );
  await validateIsEnabledTenant(tenant_model);
  
  const domain_ids = tenant_model.domain_ids;
  if (!domain_ids || domain_ids.length === 0) {
    throw "domain_ids 不能为空";
  }
  
  const domain_model = await findByIdOkDomain(domain_ids[0]);
  await validateIsEnabledDomain(domain_model);
  
  const domain_protocol = domain_model.protocol || "https";
  const domain_lbl = domain_model.lbl;
  
  if (!domain_lbl) {
    throw "domain_lbl 不能为空";
  }
  
  const refund_notify_url_path = wx_pay_model.refund_notify_url;
  if (!refund_notify_url_path) {
    throw "refund_notify_url 不能为空";
  }
  
  const refund_notify_url = `${ domain_protocol }://${ domain_lbl }${ refund_notify_url_path }`;
  
  const mchid = wx_pay_model.mchid;
  const public_key = wx_pay_model.public_key;
  const private_key = wx_pay_model.private_key;
  const v3_key = wx_pay_model.v3_key;
  
  const wxPay = new WxPay({
    appid,
    mchid,
    publicKey: Buffer.from(new TextEncoder().encode(public_key)),
    privateKey: Buffer.from(new TextEncoder().encode(private_key)),
    key: v3_key,
  });
  
  const out_refund_no = crypto.randomUUID().replaceAll("-", "");
  
  const refundParams = {
    transaction_id,
    out_trade_no,
    out_refund_no,
    reason,
    notify_url: refund_notify_url,
    amount: {
      refund: amount_refund,
      total: amount_total,
      currency: "CNY",
    },
  };
  
  log(`wx_refund.refund.params: ${ JSON.stringify(refundParams) }`);
  
  const res = await wxPay.refunds(refundParams);
  
  log(`wx_refund.refund.result: ${ JSON.stringify(res) }`);
  
  const data = res.data;
  
  if (!data) {
    throw "微信退款接口返回数据为空: " + JSON.stringify(res);
  }
  
  // deno-lint-ignore no-explicit-any
  if ((data as any).code) {
    // deno-lint-ignore no-explicit-any
    throw `${ (data as any).code }: ${ (data as any).message }`;
  }
  
  const status: WxRefundStatus = data.status as unknown as WxRefundStatus;
  const channel: WxRefundChannel = (data.channel || "") as unknown as WxRefundChannel;
  const funds_account: WxRefundFundsAccount | undefined = data.funds_account
    ? data.funds_account as unknown as WxRefundFundsAccount
    : undefined;
  
  let create_time: string | undefined = undefined;
  if (data.create_time) {
    create_time = dayjs(data.create_time).format("YYYY-MM-DD HH:mm:ss");
  }
  let success_time: string | undefined = undefined;
  if (data.success_time) {
    success_time = dayjs(data.success_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const wx_refund_id = await createWxRefund({
    appid,
    mchid,
    out_trade_no: data.out_trade_no || out_trade_no,
    transaction_id: data.transaction_id || transaction_id,
    out_refund_no: data.out_refund_no || out_refund_no,
    refund_id: data.refund_id,
    reason,
    attach2,
    notify_url: refund_notify_url,
    channel,
    user_received_account: data.user_received_account || "",
    success_time,
    status,
    funds_account,
    amount_total: data.amount?.total ?? amount_total,
    amount_refund: data.amount?.refund ?? amount_refund,
    amount_payer_total: data.amount?.payer_total,
    amount_payer_refund: data.amount?.payer_refund,
    amount_settlement_refund: data.amount?.settlement_refund,
    amount_discount_refund: data.amount?.discount_refund,
    amount_currency: WxRefundAmountCurrency.Cny,
    amount_refund_fee: data.amount?.refund_fee,
    create_time,
  });
  
  await updateTenantByIdWxRefund(
    wx_refund_id,
    tenant_id,
  );
  
  return wx_refund_id;
}
