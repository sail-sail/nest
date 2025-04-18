#![allow(dead_code)]

use color_eyre::eyre::Result;

use aes_gcm::{
  aead::{generic_array::GenericArray, Aead, KeyInit, Payload},
  Aes256Gcm,
};
use base64::{engine, Engine};
use serde::{Deserialize, Serialize};

use super::{
  api::{Payer, SceneInfo, TradeState, TradeType},
  RefundStatus,
};

/// 微信支付回调时，返回的 错误 通知应答格式
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayNotifyResponse {
  pub code: String,
  pub message: String,
}

/// 支付回调，#resource解密后字段
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayResource {
  /// 直连商户申请的公众号或移动应用AppID。
  pub appid: String,
  /// 商户的商户号，由微信支付生成并下发。
  pub mchid: String,
  /// 商户系统内部订单号，可以是数字、大小写字母_-*的任意组合且在同一个商户号下唯一。
  pub out_trade_no: String,
  /// 微信支付系统生成的订单号。
  pub transaction_id: String,
  /// 交易类型，枚举值：
  pub trade_type: TradeType,
  /// 交易状态，枚举值：
  pub trade_state: TradeState,
  /// 交易状态描述。
  pub trade_state_desc: String,
  /// 银行类型，采用字符串类型的银行标识。银行标识请参考《银行类型对照表》。
  pub bank_type: String,
  /// 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用，实际情况下只有支付完成状态才会返回该字段。
  pub attach: Option<String>,
  /// 支付完成时间，遵循rfc3339标准格式，格式为yyyy-MM-DDTHH:mm:ss+TIMEZONE，yyyy-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC 8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日 13点29分35秒。
  pub success_time: String,
  /// 支付者信息
  pub payer: Payer,
  /// 订单金额信息
  pub amount: WxPayResourceAmount,
  /// 支付场景信息描述
  pub scene_info: Option<SceneInfo>,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayResourceAmount {
  /// 订单总金额，单位为分。
  pub total: u64,
  /// 用户支付金额，单位为分。
  pub payer_total: u64,
  /// CNY：人民币，境内商户号仅支持人民币。
  pub currency: String,
  /// 用户支付币种。
  pub payer_currency: String,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayNotifyResource {
  /// 对开启结果数据进行加密的加密算法，目前只支持AEAD_AES_256_GCM。
  pub algorithm: String,
  /// Base64编码后的开启/停用结果数据密文。
  pub ciphertext: String,
  /// 附加数据。
  pub associated_data: String,
  /// 原始回调类型，为transaction。
  pub original_type: String,
  /// 加密使用的随机串。
  pub nonce: String,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayNotify {
  /// 通知的唯一ID。
  pub id: String,
  /// 通知创建的时间，遵循rfc3339标准格式，格式为yyyy-MM-DDTHH:mm:ss+TIMEZONE，yyyy-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss.表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC 8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示北京时间2015年05月20日13点29分35秒。
  pub create_time: String,
  /// 通知的类型，支付成功通知的类型为 TRANSACTION.SUCCESS。
  pub event_type: String,
  /// 通知的资源数据类型，支付成功通知为encrypt-resource。
  pub resource_type: String,
  /// 通知资源数据。
  pub resource: WxPayNotifyResource,
  /// 回调摘要
  pub summary: String,
}
/// 微信支付，通知应答解密
///
/// wx_pay_apiv3 为 apiv3 密钥
///
/// 使用示例 (actix-web为例，回调接口)
/// ```
/// #[post("/pay/notify_url/action")]
/// pub async fn pay_notify_url_action(params: web::Json<WxPayNotify>) -> Result<impl Responder> {
///   let params = params.0;  // params.event_type != "TRANSACTION.SUCCESS".to_string()
///   let data = decode_wx_pay(WECHAT_PAY_APIV3, params).unwrap();
///   if false { //  返回失败的 通知应答
///     return Err(
///       actix_web::error::ErrorInternalServerError("失败")
///     )
///   }
///   Ok(web::Json(()))
/// }
///
/// ```
///
pub fn decode_wx_pay(wx_pay_apiv3: &str, params: WxPayNotify) -> Result<WxPayResource> {
  let auth_key_length = 16;

  let mut t_key = [0u8; 32];
  hex::decode_to_slice(hex::encode(wx_pay_apiv3), &mut t_key as &mut [u8])?;
  let key = GenericArray::from_slice(&t_key);

  let mut t_nonce = [0u8; 12];
  hex::decode_to_slice(
    hex::encode(params.resource.nonce.clone()),
    &mut t_nonce as &mut [u8],
  )?;
  let nonce = GenericArray::from_slice(&t_nonce);

  let t_ciphertext_base =
    engine::general_purpose::STANDARD.decode(params.resource.ciphertext.clone())?;
  let cipherdata_length = t_ciphertext_base.len() - auth_key_length;

  let cipherdata = &t_ciphertext_base[0..cipherdata_length];
  let auth_tag = &t_ciphertext_base[cipherdata_length..];

  let mut ciphertext = Vec::from(cipherdata);
  ciphertext.extend_from_slice(auth_tag);

  // 注： AEAD_AES_256_GCM算法的接口细节，请参考rfc5116。微信支付使用的密钥key长度为32个字节，
  // 随机串nonce长度12个字节，associated_data长度小于16个字节并可能为空字符串。
  // 这里可能会根据返回值 associated_data 长度而不同，目前应该是固定为 "transaction"  ?/"certificate"。
  let t_add = get_slice_arr(params.resource.associated_data);
  let payload = Payload {
    msg: &ciphertext,
    aad: &t_add,
  };
  let cipher = Aes256Gcm::new(key);
  let plaintext = cipher.decrypt(nonce, payload).unwrap();
  let content = std::str::from_utf8(&plaintext)?;
  let data: WxPayResource = serde_json::from_str(content)?;

  Ok(data)
}

/// 支付回调，#resource解密后字段
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundResource {
  /// 商户的商户号，由微信支付生成并下发。
  pub mchid: String,
  /// 商户系统内部订单号，可以是数字、大小写字母_-*的任意组合且在同一个商户号下唯一。
  pub out_trade_no: String,
  /// 微信支付系统生成的订单号。
  pub transaction_id: String,
  /// 商户退款单号
  pub out_refund_no: String,
  /// 微信退款单号
  pub refund_id: String,
  /// 退款状态，枚举值：SUCCESS：退款成功
  /// CLOSED：退款关闭
  /// ABNORMAL：退款异常，退款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败，可前往【商户平台—>交易中心】，手动处理此笔退款
  pub refund_status: RefundStatus,
  /// 退款成功时间
  pub success_time: Option<String>,
  /// 取当前退款单的退款入账方。
  /// 1、退回银行卡：{银行名称}{卡类型}{卡尾号}
  /// 2、退回支付用户零钱: 支付用户零钱
  /// 3、退还商户: 商户基本账户、商户结算银行账户
  /// 4、退回支付用户零钱通：支付用户零钱通
  /// 5、退回用户经营账户：用户经营账户
  /// 6、退回支付用户银行电子账户：支付用户银行电子账户
  /// 7、退回支付用户零花钱：支付用户零花钱
  /// 8、退回支付用户来华零钱包：支付用户来华零钱包
  /// 9、退回企业支付商户：企业支付商户
  pub user_received_account: String,
  /// 订单金额信息
  pub amount: WxRefundResourceAmount,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundResourceAmount {
  /// 订单总金额，单位为分。
  pub total: u64,
  /// 退款金额，币种的最小单位，只能为整数，不能超过原订单支付金额，如果有使用券，后台会按比例退。
  pub refund: u64,
  /// 用户实际支付金额，单位为分，只能为整数
  pub payer_total: u64,
  /// 退款给用户的金额，不包含所有优惠券金额
  pub payer_refund: u64,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundNotifyResource {
  /// 对开启结果数据进行加密的加密算法，目前只支持AEAD_AES_256_GCM。
  pub algorithm: String,
  /// Base64编码后的开启/停用结果数据密文。
  pub ciphertext: String,
  /// 附加数据。
  pub associated_data: String,
  /// 原始回调类型，为transaction。
  pub original_type: String,
  /// 加密使用的随机串。
  pub nonce: String,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundNotify {
  /// 通知的唯一ID。
  pub id: String,
  /// 通知创建的时间，遵循rfc3339标准格式，格式为yyyy-MM-DDTHH:mm:ss+TIMEZONE，yyyy-MM-DD表示年月日，
  /// T出现在字符串中，表示time元素的开头，HH:mm:ss.表示时分秒，TIMEZONE表示时区
  /// （+08:00表示东八区时间，领先UTC 8小时，即北京时间）。
  /// 例如：2015-05-20T13:29:35+08:00表示北京时间2015年05月20日13点29分35秒。
  pub create_time: String,
  /// 通知的类型:
  /// REFUND.SUCCESS：退款成功通知
  /// REFUND.ABNORMAL：退款异常通知
  /// REFUND.CLOSED：退款关闭通知
  pub event_type: String,
  /// 通知的资源数据类型，支付成功通知为encr
  pub resource_type: String,
  /// 通知资源数据。
  pub resource: WxRefundNotifyResource,
  /// 回调摘要
  pub summary: String,
}
/// 微信支付退款，通知应答解密 使用方法 和 decode_wx_pay 类似
pub fn decode_wx_refund(
  wx_pay_apiv3: &str,
  params: WxRefundNotify,
) -> Result<WxRefundResource> {
  let auth_key_length = 16;

  let mut t_key = [0u8; 32];
  hex::decode_to_slice(hex::encode(wx_pay_apiv3), &mut t_key as &mut [u8])?;
  let key = GenericArray::from_slice(&t_key);

  let mut t_nonce = [0u8; 12];
  hex::decode_to_slice(
    hex::encode(params.resource.nonce.clone()),
    &mut t_nonce as &mut [u8],
  )?;
  let nonce = GenericArray::from_slice(&t_nonce);

  let t_ciphertext_base =
    engine::general_purpose::STANDARD.decode(params.resource.ciphertext.clone())?;
  let cipherdata_length = t_ciphertext_base.len() - auth_key_length;

  let cipherdata = &t_ciphertext_base[0..cipherdata_length];
  let auth_tag = &t_ciphertext_base[cipherdata_length..];

  let mut ciphertext = Vec::from(cipherdata);
  ciphertext.extend_from_slice(auth_tag);

  // 注： AEAD_AES_256_GCM算法的接口细节，请参考rfc5116。微信支付使用的密钥key长度为32个字节，
  // 随机串nonce长度12个字节，associated_data长度小于16个字节并可能为空字符串。
  // 这里可能会根据返回值 associated_data 长度而不同，目前应该是固定为 "transaction"  ?/"certificate"。
  let t_add = get_slice_arr(params.resource.associated_data);
  let payload = Payload {
    msg: &ciphertext,
    aad: &t_add,
  };
  let cipher = Aes256Gcm::new(key);
  let plaintext = cipher.decrypt(nonce, payload).unwrap();
  let content = std::str::from_utf8(&plaintext)?;
  let data: WxRefundResource = serde_json::from_str(content)?;

  Ok(data)
}

fn get_slice_arr(str_data: String) -> Box<[u8]> {
  let arr = match str_data.len() {
    1 => {
      let mut a = [0u8; 1];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    2 => {
      let mut a = [0u8; 2];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    3 => {
      let mut a = [0u8; 3];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    4 => {
      let mut a = [0u8; 4];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    5 => {
      let mut a = [0u8; 5];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    6 => {
      let mut a = [0u8; 6];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    7 => {
      let mut a = [0u8; 7];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    8 => {
      let mut a = [0u8; 8];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    9 => {
      let mut a = [0u8; 9];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    10 => {
      let mut a = [0u8; 10];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    11 => {
      let mut a = [0u8; 11];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    12 => {
      let mut a = [0u8; 12];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    13 => {
      let mut a = [0u8; 13];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    14 => {
      let mut a = [0u8; 14];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    15 => {
      let mut a = [0u8; 15];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    16 => {
      let mut a = [0u8; 16];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
    _ => {
      let mut a = [0u8; 0];
      hex::decode_to_slice(hex::encode(str_data), &mut a as &mut [u8]).unwrap();
      a.to_vec()
    }
  };
  arr.into_boxed_slice()
}

#[cfg(test)]
mod test {
  use serde::{Deserialize, Serialize};

  #[test]
  fn test_sha2() {
    #[derive(Serialize, Deserialize, Debug, Clone, Default)]
    pub enum TradeType {
      #[default]
      Jsapi,
      Native,
      JSAPI,
    }
    #[derive(Serialize, Deserialize, Debug, Clone, Default)]
    pub struct TT {
      pub total: u64,
      pub tt: TradeType,
    }
    let strs = r#"{"total": 23, "tt": "JSAPI"}"#;
    let mm: TT = serde_json::from_str(strs).unwrap();
    println!("{:?}", mm);
  }
}
