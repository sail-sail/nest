#![allow(deprecated)]

use aes_gcm::{
  Aes256Gcm,
  aead::{Aead, KeyInit, Payload, generic_array::GenericArray},
};
use base64::{Engine, engine};
use serde::{Deserialize, Serialize};

use crate::{Payer, RefundStatus, Result, SceneInfo, TradeState, TradeType, WxPayError};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayNotifyResponse {
  pub code: String,
  pub message: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayResource {
  pub appid: String,
  pub mchid: String,
  pub out_trade_no: String,
  pub transaction_id: String,
  pub trade_type: TradeType,
  pub trade_state: TradeState,
  pub trade_state_desc: String,
  pub bank_type: String,
  pub attach: Option<String>,
  pub success_time: String,
  pub payer: Payer,
  pub amount: WxPayResourceAmount,
  pub scene_info: Option<SceneInfo>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayResourceAmount {
  pub total: u64,
  pub payer_total: u64,
  pub currency: String,
  pub payer_currency: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayNotifyResource {
  pub algorithm: String,
  pub ciphertext: String,
  pub associated_data: String,
  pub original_type: String,
  pub nonce: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayNotify {
  pub id: String,
  pub create_time: String,
  pub event_type: String,
  pub resource_type: String,
  pub resource: WxPayNotifyResource,
  pub summary: String,
}

pub fn decode_wx_pay(
  wx_pay_apiv3: &str,
  params: WxPayNotify,
) -> Result<WxPayResource> {
  let resource = params.resource;
  let key_bytes = fixed_bytes::<32>(wx_pay_apiv3, "api_v3_private_key")?;
  let key = GenericArray::from_slice(&key_bytes);
  let nonce_bytes = fixed_bytes::<12>(&resource.nonce, "resource.nonce")?;
  let nonce = GenericArray::from_slice(&nonce_bytes);
  let ciphertext_base = engine::general_purpose::STANDARD.decode(resource.ciphertext)?;
  let cipherdata_length = ciphertext_base
    .len()
    .checked_sub(16)
    .ok_or_else(|| WxPayError::InvalidResponse("ciphertext shorter than auth tag".to_string()))?;
  let mut ciphertext = ciphertext_base[..cipherdata_length].to_vec();
  ciphertext.extend_from_slice(&ciphertext_base[cipherdata_length..]);
  let associated_data = resource.associated_data.into_bytes();
  let payload = Payload {
    msg: ciphertext.as_slice(),
    aad: associated_data.as_slice(),
  };
  let cipher = Aes256Gcm::new(key);
  let plaintext = cipher.decrypt(nonce, payload)?;
  let content = std::str::from_utf8(&plaintext)?;
  let data = serde_json::from_str(content)?;
  Ok(data)
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundResource {
  pub mchid: String,
  pub out_trade_no: String,
  pub transaction_id: String,
  pub out_refund_no: String,
  pub refund_id: String,
  pub refund_status: RefundStatus,
  pub success_time: Option<String>,
  pub user_received_account: String,
  pub amount: WxRefundResourceAmount,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundResourceAmount {
  pub total: u64,
  pub refund: u64,
  pub payer_total: u64,
  pub payer_refund: u64,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundNotifyResource {
  pub algorithm: String,
  pub ciphertext: String,
  pub associated_data: String,
  pub original_type: String,
  pub nonce: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxRefundNotify {
  pub id: String,
  pub create_time: String,
  pub event_type: String,
  pub resource_type: String,
  pub resource: WxRefundNotifyResource,
  pub summary: String,
}

pub fn decode_wx_refund(
  wx_pay_apiv3: &str,
  params: WxRefundNotify,
) -> Result<WxRefundResource> {
  let resource = params.resource;
  let key_bytes = fixed_bytes::<32>(wx_pay_apiv3, "api_v3_private_key")?;
  let key = GenericArray::from_slice(&key_bytes);
  let nonce_bytes = fixed_bytes::<12>(&resource.nonce, "resource.nonce")?;
  let nonce = GenericArray::from_slice(&nonce_bytes);
  let ciphertext_base = engine::general_purpose::STANDARD.decode(resource.ciphertext)?;
  let cipherdata_length = ciphertext_base
    .len()
    .checked_sub(16)
    .ok_or_else(|| WxPayError::InvalidResponse("ciphertext shorter than auth tag".to_string()))?;
  let mut ciphertext = ciphertext_base[..cipherdata_length].to_vec();
  ciphertext.extend_from_slice(&ciphertext_base[cipherdata_length..]);
  let associated_data = resource.associated_data.into_bytes();
  let payload = Payload {
    msg: ciphertext.as_slice(),
    aad: associated_data.as_slice(),
  };
  let cipher = Aes256Gcm::new(key);
  let plaintext = cipher.decrypt(nonce, payload)?;
  let content = std::str::from_utf8(&plaintext)?;
  let data = serde_json::from_str(content)?;
  Ok(data)
}

fn fixed_bytes<const N: usize>(
  value: &str,
  field: &'static str,
) -> Result<[u8; N]> {
  let bytes = value.as_bytes();
  if bytes.len() != N {
    return Err(WxPayError::InvalidLength {
      field,
      expected: N,
      actual: bytes.len(),
    });
  }
  let mut out = [0u8; N];
  out.copy_from_slice(bytes);
  Ok(out)
}