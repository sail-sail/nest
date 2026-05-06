use std::sync::OnceLock;

use serde::{Serialize, de::DeserializeOwned};

use crate::Result;
use crate::WxPay;
use crate::api::PayReq;
use crate::constants::WX_BASE_URL;
use crate::utils::get_headers;

fn http_client() -> &'static reqwest::Client {
  static HTTP_CLIENT: OnceLock<reqwest::Client> = OnceLock::new();

  HTTP_CLIENT.get_or_init(reqwest::Client::new)
}

pub(crate) async fn get<U>(
  wx_pay: &WxPay<'_>,
  pay_req: &PayReq,
) -> Result<U>
where
  U: DeserializeOwned,
{
  let headers = get_headers(wx_pay, pay_req, None::<&u8>)?;
  let url = format!("{WX_BASE_URL}{}", pay_req.path);
  let data = http_client()
    .get(url)
    .headers(headers)
    .send()
    .await?
    .json()
    .await?;
  Ok(data)
}

pub(crate) async fn post<T, U>(
  wx_pay: &WxPay<'_>,
  pay_req: &PayReq,
  body: &T,
) -> Result<U>
where
  T: Serialize + ?Sized,
  U: DeserializeOwned,
{
  let headers = get_headers(wx_pay, pay_req, Some(body))?;
  let url = format!("{WX_BASE_URL}{}", pay_req.path);
  let data = http_client()
    .post(url)
    .headers(headers)
    .json(body)
    .send()
    .await?
    .json()
    .await?;
  Ok(data)
}