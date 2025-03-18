import {
  getObject as getObjectOss,
} from "/lib/oss/oss.dao.ts"

/**
 * 获取微信支付公钥和私钥
 */
export async function getWxPayModel(
  wx_pay_model: WxPayModel,
) {
  const lbl = wx_pay_model.lbl;
  // 公钥
  {
    if (!wx_pay_model.public_key) {
      throw `${ lbl }, 未配置 微信支付 - 公钥`;
    }
    const objInfo = await getObjectOss(wx_pay_model.public_key);
    if (!objInfo || !objInfo.body) {
      throw `${ lbl }, 未配置 微信支付 - 公钥`;
    }
    const res = new Response(objInfo.body);
    wx_pay_model.public_key = await res.text();
  }
  // 私钥
  {
    if (!wx_pay_model.private_key) {
      throw `${ lbl }, 未配置 微信支付 - 私钥`;
    }
    const objInfo = await getObjectOss(wx_pay_model.private_key);
    if (!objInfo || !objInfo.body) {
      throw `${ lbl }, 未配置 微信支付 - 私钥`;
    }
    const res = new Response(objInfo.body);
    wx_pay_model.private_key = await res.text();
  }
  return wx_pay_model;
}
