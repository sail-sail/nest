use base64::{Engine, engine};
use chrono::Local;
use pkcs8::DecodePrivateKey;
use reqwest::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE, HeaderMap, USER_AGENT};
use rsa::{Pkcs1v15Sign, RsaPrivateKey, sha2::{Digest, Sha256}};
use serde::Serialize;
use uuid::Uuid;

use crate::Result;
use crate::WxPay;
use crate::api::PayReq;

pub(crate) fn get_timestamp() -> i64 {
  Local::now().timestamp()
}

pub(crate) fn gen_rand_str() -> String {
  Uuid::new_v4().to_string().replace('-', "")
}

pub(crate) fn sha_rsa_sign<T>(
  private_key: &str,
  content: T,
) -> Result<String>
where
  T: AsRef<str>,
{
  let private_key = RsaPrivateKey::from_pkcs8_pem(private_key)?;
  let mut hasher = <Sha256 as Digest>::new();
  hasher.update(content.as_ref());
  let hash256 = hasher.finalize();
  let padding = Pkcs1v15Sign::new::<Sha256>();
  let sign_result = private_key.sign(padding, &hash256)?;
  Ok(engine::general_purpose::STANDARD.encode(sign_result))
}

pub(crate) fn get_headers<T>(
  wx_pay: &WxPay<'_>,
  pay_req: &PayReq,
  body: Option<&T>,
) -> Result<HeaderMap>
where
  T: Serialize + ?Sized,
{
  let timestamp = get_timestamp();
  let nonce_str = gen_rand_str();
  let body_string = if let Some(body) = body {
    serde_json::to_string(body)?
  } else {
    String::new()
  };

  let signature = sha_rsa_sign(
    wx_pay.private_key,
    pay_req.method.as_str().to_string()
      + "\n"
      + pay_req.path.as_str()
      + "\n"
      + timestamp.to_string().as_str()
      + "\n"
      + nonce_str.as_str()
      + "\n"
      + body_string.as_str()
      + "\n",
  )?;

  let authorization = "WECHATPAY2-SHA256-RSA2048 mchid=\"".to_string()
    + wx_pay.mchid
    + "\",nonce_str=\""
    + nonce_str.as_str()
    + "\",timestamp=\""
    + timestamp.to_string().as_str()
    + "\",signature=\""
    + signature.as_str()
    + "\",serial_no=\""
    + wx_pay.serial_no
    + "\"";

  let mut headers = HeaderMap::new();
  headers.insert(CONTENT_TYPE, "application/json".parse()?);
  headers.insert(ACCEPT, "application/json".parse()?);
  headers.insert(AUTHORIZATION, authorization.parse()?);
  headers.insert(
    USER_AGENT,
    "Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101 Firefox/28.0".parse()?,
  );
  Ok(headers)
}