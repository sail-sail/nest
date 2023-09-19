import * as wx_payDao from "/gen/wx/wx_pay/wx_pay.dao.ts";

import * as ossDao from "/lib/oss/oss.dao.ts"

/**
 * 获取微信支付实例
 */
export async function getWxPay(
  appid: string,
) {
  const wx_payModel = await wx_payDao.findOne({
    appid,
  });
  if (!wx_payModel) {
    throw `appid:${ appid }, 未配置微信支付`;
  }
  if (!wx_payModel.mchid) {
    throw `appid:${ appid }, 未配置 微信支付 - 商户号`;
  }
  // 公钥
  {
    if (!wx_payModel.publicKey) {
      throw `appid:${ appid }, 未配置 微信支付 - 公钥`;
    }
    const objInfo = await ossDao.getObject(wx_payModel.publicKey);
    if (!objInfo || !objInfo.body) {
      throw `appid:${ appid }, 未配置 微信支付 - 公钥`;
    }
    const res = new Response(objInfo.body);
    wx_payModel.publicKey = await res.text();
  }
  // 私钥
  {
    if (!wx_payModel.privateKey) {
      throw `appid:${ appid }, 未配置 微信支付 - 私钥`;
    }
    const objInfo = await ossDao.getObject(wx_payModel.privateKey);
    if (!objInfo || !objInfo.body) {
      throw `appid:${ appid }, 未配置 微信支付 - 私钥`;
    }
    const res = new Response(objInfo.body);
    wx_payModel.privateKey = await res.text();
  }
  return wx_payModel;
}
