#![allow(dead_code)]

use color_eyre::eyre::Result;
use serde::{de::DeserializeOwned, Serialize};

use super::api::PayReq;
use super::constants::WX_BASE_URL;
use super::utils::get_headers;
use super::WxPay;

use crate::common::util::http::client as reqwest_client;

#[allow(clippy::needless_lifetimes)]
pub(crate) async fn get<'a, U>(wx_pay: &WxPay<'a>, pay_req: &PayReq) -> Result<U>
where
  U: Serialize + DeserializeOwned,
{
  let headers = get_headers(wx_pay, pay_req, None::<&u8>)?;
  let url = WX_BASE_URL.to_string() + pay_req.path.as_str();
  let client = reqwest::Client::new();
  let data: U = client
    .get(url)
    .headers(headers)
    .send()
    .await?
    .json()
    .await?;
  Ok(data)
}

#[allow(clippy::needless_lifetimes)]
pub(crate) async fn post<'a, T, U>(
  wx_pay: &WxPay<'a>,
  pay_req: &PayReq,
  body: &T,
) -> Result<U>
where
  T: Serialize + DeserializeOwned,
  U: Serialize + DeserializeOwned,
{
  let headers = get_headers(wx_pay, pay_req, Some(body))?;
  // let client = reqwest::Client::new();
  let client = reqwest_client();
  let url = WX_BASE_URL.to_string() + pay_req.path.as_str();
  let data: U = client
    .post(url)
    .headers(headers)
    .json(body)
    .send()
    .await?
    .json()
    .await?;
  Ok(data)
}
