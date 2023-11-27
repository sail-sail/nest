import type {
  WxPayModel,
} from "/gen/wx/wx_pay/wx_pay.model.ts";

import * as ossDao from "/lib/oss/oss.dao.ts"

/**
 * 获取微信支付公钥和私钥
 */
export async function getWxPayModel(
  wx_payModel: WxPayModel,
) {
  const lbl = wx_payModel.lbl;
  // 公钥
  {
    if (!wx_payModel.public_key) {
      throw `${ lbl }, 未配置 微信支付 - 公钥`;
    }
    const objInfo = await ossDao.getObject(wx_payModel.public_key);
    if (!objInfo || !objInfo.body) {
      throw `${ lbl }, 未配置 微信支付 - 公钥`;
    }
    const res = new Response(objInfo.body);
    wx_payModel.public_key = await res.text();
  }
  // 私钥
  {
    if (!wx_payModel.private_key) {
      throw `${ lbl }, 未配置 微信支付 - 私钥`;
    }
    const objInfo = await ossDao.getObject(wx_payModel.private_key);
    if (!objInfo || !objInfo.body) {
      throw `${ lbl }, 未配置 微信支付 - 私钥`;
    }
    const res = new Response(objInfo.body);
    wx_payModel.private_key = await res.text();
  }
  return wx_payModel;
}
