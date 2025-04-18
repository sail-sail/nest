#![allow(dead_code)]

use color_eyre::eyre::Result;

use base64::{engine, Engine};
use chrono::Local;
use pkcs8::DecodePrivateKey;
use reqwest::header::{HeaderMap, ACCEPT, AUTHORIZATION, CONTENT_TYPE, USER_AGENT};
use rsa::{
  sha2::{Digest, Sha256},
  Pkcs1v15Sign, RsaPrivateKey,
};
use serde::{de::DeserializeOwned, Serialize};
use uuid::Uuid;

use super::api::PayReq;
use super::WxPay;

/// 获取当前时间戳
pub(crate) fn get_timestamp() -> i64 {
  let dt = Local::now();
  dt.timestamp()
}
/// 生成32位随机字符串
pub(crate) fn gen_rand_str() -> String {
  Uuid::new_v4().to_string().replace("-", "")
}

/// 签名
pub(crate) fn sha_rsa_sign<T>(private_key: &str, content: T) -> Result<String>
where
  T: AsRef<str>,
{
  // 获取私钥对象
  let private_key = RsaPrivateKey::from_pkcs8_pem(private_key)?;
  let mut hasher = <Sha256 as Digest>::new();
  hasher.update(content.as_ref());
  let hash256 = hasher.finalize();
  let padding = Pkcs1v15Sign::new::<Sha256>();
  let sign_result = private_key.sign(padding, &hash256)?;
  Ok(engine::general_purpose::STANDARD.encode(sign_result))
}

/// 获取请求头
pub(crate) fn get_headers<T>(
  wx_pay: &WxPay,
  pay_req: &PayReq,
  body: Option<&T>,
) -> Result<HeaderMap>
where
  T: Serialize + DeserializeOwned,
{
  let timestamp = get_timestamp();
  let onece_str = gen_rand_str();
  let method = pay_req.method.as_str();
  let body_string = if let Some(b) = body {
    serde_json::to_string(b)?
  } else {
    "".to_string()
  };

  // 获取签名
  let signature = sha_rsa_sign(
    wx_pay.private_key,
    method.to_string()
      + "\n"
      + pay_req.path.as_str()
      + "\n"
      + timestamp.to_string().as_str()
      + "\n"
      + onece_str.as_str()
      + "\n"
      + body_string.as_str()
      + "\n",
  )?;
  // 组装header
  let authorization = "WECHATPAY2-SHA256-RSA2048 mchid=\"".to_string()
    + wx_pay.mchid
    + "\",nonce_str=\""
    + onece_str.as_str()
    + "\",timestamp=\""
    + timestamp.to_string().as_str()
    + "\",signature=\""
    + signature.as_str()
    + "\",serial_no=\""
    + wx_pay.serial_no
    + "\"";

  let mut headers = HeaderMap::new();
  headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());
  headers.insert(ACCEPT, "application/json".parse().unwrap());
  headers.insert(AUTHORIZATION, authorization.parse().unwrap());
  headers.insert(
    USER_AGENT,
    "Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101 Firefox/28.0"
      .parse()
      .unwrap(),
  );

  Ok(headers)
}

#[cfg(test)]
mod test {
  use super::sha_rsa_sign;
  use rsa::sha2::{Digest, Sha256};
  #[test]
  fn test_sha2() {
    let mut hasher = <Sha256 as Digest>::new();
    hasher.update("niang");
    let hash256 = hasher.finalize();
    println!("ha   {:?}", hash256);
  }

  #[test]
  fn test_rsa_sign() {
    /// 微信支付 v3 密钥
    pub const WECHAT_PRIVATE_KEY: &str = "-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDwLFD7xpaiEIxq
ijFoyoXaGrER4orr9m/9Syx+1MplJxuPIhj/w1i8ThGJe1RWV0q0FbVSPs1s1JYM
0JIYhFIV/Eh/fFQA209XYyw=
-----END PRIVATE KEY-----";

    let data = sha_rsa_sign(WECHAT_PRIVATE_KEY, "contentabc4").unwrap();
    println!("rsa签名   {:?}", data);
  }
}
