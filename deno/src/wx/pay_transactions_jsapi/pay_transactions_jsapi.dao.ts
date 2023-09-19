import {
  log,
} from "/lib/context.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as wx_usrDao from "/gen/wx/wx_usr/wx_usr.dao.ts";

import * as tenantDao from "/gen/base/tenant/tenant.dao.ts";

import * as wx_paySrcDao from "/src/wx/wx_pay/wx_pay.dao.ts";

import * as pay_transactions_jsapiDao from "/gen/wx/pay_transactions_jsapi/pay_transactions_jsapi.dao.ts";

import * as domainDao from "/gen/base/domain/domain.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  type RequestPaymentOptions,
} from "/gen/types.ts";

/** 订单金额信息 */
interface Iamount {
  /** 订单总金额，单位为分 */
  total: number;
  /** 货币类型 */
  currency?: string;
}

/** 支付者信息 */
interface Ipayer {
  openid: string;
}

/** 场景信息 */
interface IsceneInfoNative {
  /** 服务器IP地址 */
  payer_client_ip: string;
  /** 商户端设备号 */
  device_id?: string;
  store_info?: IstoreInfo;
}

// 商户门店信息
interface IstoreInfo {
  id: string;
  name?: string;
  area_code?: string;
  address?: string;
}

// 单品列表信息
interface IgoodsDetail {
  merchant_goods_id: string;
  wechatpay_goods_id?: string;
  goods_name?: string;
  quantity: number;
  unit_price: number;
}

// 优惠功能
interface Idetail {
  cost_price?: number;
  invoice_id?: string;
  goods_detail?: IgoodsDetail[];
}

interface Ijsapi {
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url: string;
  goods_tag?: string;
  amount: Iamount;
  payer: Ipayer;
  detail?: Idetail;
  scene_info?: IsceneInfoNative;
}

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

export async function transactions_jsapi(
  appid: string,
  params0: Partial<Ijsapi>,
  attachInfo?: {
    attach2?: string;
  },
): Promise<RequestPaymentOptions> {
  const {
    obj,
    params,
  } = await getJsapiObj(appid);
  Object.assign(params, params0);
  log(`transactions_jsapi.params: ${ JSON.stringify(params) } `);
  const res = await fetch(
    "http://localhost:30030/transactions_jsapi",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        obj,
        params,
      }),
    },
  );
  // const wxPay = new WxPay({
  //   appid: obj.appid,
  //   mchid: obj.mchid,
  //   publicKey: Buffer.from(obj.publicKey),
  //   privateKey: Buffer.from(obj.privateKey),
  //   key: obj.key,
  // });
  // const res = await wxPay.transactions_jsapi(params);
  const result = await res.json();
  /*
  {
    "status": 200,
    "appId": "wx28e52faff22e8837",
    "timeStamp": "1675853534",
    "nonceStr": "nhyc2alf7qt",
    "package": "prepay_id=wx08185215073441b9904f2b8ef267bf0000",
    "signType": "RSA",
    "paySign": "D7h2C0j2hWGdC3RG8lkBEv/b5GmEla9nzoJtRhSjREz5pCYbj1FEuibDTdyKQCGc9RjgU1Tf1YbZg9/9FPHns5FsZVghx9FqkqmwVs+xeT1jQs6V9PT50mb49kQjtw74nFXGvqI37APcLRIzTy2bbWk6eVnX0eB6oWzzBkQfKF31OXy7REZoTKRhQl/A/OT5DcjVIoLRR+DVYhGJ3Fn9c3YuI6/wQ+owENkgvpKibPzBgD9IMgN/UNzWb+9H7Ae/a8T594TIRsfAENbucqMHHLng7xvOon88LAzUZ5DuiyMTKQJyBoQ0x77eRPEuXMVkv9oXm9TiWUrFFxaoskDx3w=="
  }
  */
  type PayMsg = {
    code: string;
    message: string;
    status: number;
  };
  if ((result as unknown as PayMsg).status !== 200) {
    const data = result as unknown as PayMsg;
    throw `${ data.code }: ${ data.message }`;
  }
  result.orderInfo = obj.appid;
  log(`transactions_jsapi.result: ${ JSON.stringify(result) }`);
  const authModel = await authDao.getAuthModel();
  const wx_usrModel = (await wx_usrDao.findById(authModel.wx_usr_id))!;
  await pay_transactions_jsapiDao.create({
    appid: obj.appid,
    mchid: obj.mchid,
    description: params.description,
    out_trade_no: params.out_trade_no,
    transaction_id: "",
    trade_state: "NOTPAY",
    trade_state_desc: "未支付",
    time_expire: params.time_expire,
    attach: params.attach,
    attach2: attachInfo?.attach2,
    notify_url: params.notify_url,
    support_fapiao: params.detail?.invoice_id ? 1 : 0,
    total_fee: params.amount.total,
    currency: params.amount.currency,
    openid: params.payer.openid,
    prepay_id: result.package,
    tenant_id: wx_usrModel.tenant_id,
    org_id: wx_usrModel.org_id,
  });
  return result;
}

export async function getJsapiObj(
  appid: string,
) {
  const wx_payModel = await wx_paySrcDao.getWxPay(appid);
  
  const authModel = await authDao.getAuthModel();
  const wx_usrModel = await wx_usrDao.findById(authModel.wx_usr_id);
  if (!wx_usrModel) {
    throw `未找到微信用户`;
  }
  if (!wx_usrModel.openid) {
    throw `微信用户未绑定 openid`;
  }
  if (wx_usrModel.is_enabled !== 1) {
    throw `微信用户 ${ wx_usrModel.openid } 未启用`;
  }
  if (!wx_payModel.payer_client_ip) {
    throw `appid:${ appid }, 未配置 微信支付 - 客户端 IP`;
  }
  if (!wx_payModel.notify_url) {
    throw `appid:${ appid }, 未配置 微信支付 - 通知地址`;
  }
  
  let notify_url = wx_payModel.notify_url;
  const tenant_id = wx_usrModel.tenant_id;
  const tenantModel = await tenantDao.findById(tenant_id);
  if (!tenantModel) {
    throw `未找到租户 ${ tenant_id }`;
  }
  const org_id = wx_usrModel.org_id;
  if (!org_id) {
    throw `用户 ${ wx_usrModel.lbl } 未绑定 门店`;
  }
  if (tenantModel.is_enabled !== 1) {
    throw `租户 ${ tenantModel.lbl } 未启用`;
  }
  const domain_ids = tenantModel.domain_ids;
  if (!domain_ids || domain_ids.length === 0) {
    throw `租户 ${ tenantModel.lbl } 未设置默认域名`;
  }
  const domainModel = await domainDao.findOne({
    ids: domain_ids,
    is_default: [ 1 ],
    is_enabled: [ 1 ],
  });
  if (!domainModel || isEmpty(domainModel.lbl)) {
    throw `租户 ${ tenantModel.lbl } 未设置默认域名`;
  }
  notify_url = `https://${ domainModel.lbl }${ notify_url }`;
  const openid = wx_usrModel.openid;
  const out_trade_no = crypto.randomUUID().replaceAll("-", "");
  const obj = {
    appid,
    mchid: wx_payModel.mchid,
    publicKey: wx_payModel.publicKey,
    privateKey: wx_payModel.privateKey,
    key: wx_payModel.key,
  };
  return {
    obj,
    params: {
      description: "商品描述", // 商品描述 会被替换
      amount: {
        total: 1, // 订单总金额，单位为分 会被替换
      },
      out_trade_no,
      notify_url,
      payer: {
        openid,
      },
      scene_info: {
        payer_client_ip: wx_payModel.payer_client_ip,
      },
    } as Ijsapi,
  };
}
