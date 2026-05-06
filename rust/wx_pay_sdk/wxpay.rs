use serde::{Deserialize, Serialize};
use tracing::info;

use crate::api::{Jsapi, JsapiParams, PayApi, Refund, RefundDetail, TransactionDetail, WxPayData};
use crate::fetch::{get, post};
use crate::utils::{gen_rand_str, get_timestamp, sha_rsa_sign};
use crate::{Result, WxPayError};

#[derive(Debug)]
pub struct WxPay<'a> {
  pub appid: &'a str,
  pub mchid: &'a str,
  pub private_key: &'a str,
  pub serial_no: &'a str,
  pub api_v3_private_key: &'a str,
  pub notify_url: &'a str,
}

impl WxPay<'_> {
  pub async fn jsapi(
    &self,
    body: &Jsapi,
  ) -> Result<WxPayData> {
    let pay_api = PayApi::Jsapi;
    let pay_req = pay_api.get_pay_path(self);
    let jsapi_params = JsapiParams {
      appid: self.appid.to_string(),
      mchid: self.mchid.to_string(),
      notify_url: self.notify_url.to_string(),
      description: body.description.clone(),
      out_trade_no: body.out_trade_no.clone(),
      amount: body.amount.clone(),
      payer: body.payer.clone(),
      time_expire: body.time_expire.clone(),
      attach: body.attach.clone(),
      goods_tag: body.goods_tag.clone(),
      support_fapiao: body.support_fapiao,
      detail: body.detail.clone(),
      scene_info: body.scene_info.clone(),
      settle_info: body.settle_info.clone(),
    };

    #[derive(Serialize, Deserialize, Debug)]
    struct JsapiRes {
      pub prepay_id: Option<String>,
      pub code: Option<String>,
      pub message: Option<String>,
    }

    let pre_data: serde_json::Value = post(self, &pay_req, &jsapi_params).await?;
    info!("wxpay.jsapi pre_data: {pre_data:?}");
    let pre_data: JsapiRes = serde_json::from_value(pre_data)?;
    let code = pre_data.code;
    let prepay_id = pre_data.prepay_id;
    let message = pre_data.message;
    if (prepay_id.is_none() || prepay_id.as_ref().is_some_and(|value| value.is_empty())) ||
      code.as_deref().is_some_and(|value| value != "SUCCESS")
    {
      return Err(WxPayError::Api {
        code: code.unwrap_or_else(|| "FAIL".to_string()),
        message: message.unwrap_or_else(|| "预支付交易会话标识为空".to_string()),
      });
    }
    let prepay_id = prepay_id.unwrap_or_default();
    let package = format!("prepay_id={prepay_id}");
    let nonce_str = gen_rand_str();
    let time_stamp = get_timestamp();
    let pay_sign = sha_rsa_sign(
      self.private_key,
      self.appid.to_string()
        + "\n"
        + time_stamp.to_string().as_str()
        + "\n"
        + nonce_str.as_str()
        + "\n"
        + package.as_str()
        + "\n",
    )?;

    Ok(WxPayData {
      app_id: Some(self.appid.to_string()),
      sign_type: "RSA".into(),
      pay_sign,
      package,
      nonce_str,
      time_stamp,
    })
  }

  pub async fn get_transactions_by_id(
    &self,
    transaction_id: &str,
  ) -> Result<TransactionDetail> {
    let pay_api = PayApi::GetTransactionsById { transaction_id };
    let pay_req = pay_api.get_pay_path(self);
    get(self, &pay_req).await
  }

  pub async fn get_transactions_by_out_trade_no(
    &self,
    out_trade_no: &str,
  ) -> Result<TransactionDetail> {
    let pay_api = PayApi::GetTransactionsByOutTradeNo { out_trade_no };
    let pay_req = pay_api.get_pay_path(self);
    get(self, &pay_req).await
  }

  pub async fn close(
    &self,
    out_trade_no: &str,
  ) -> Result<()> {
    let pay_api = PayApi::Close { out_trade_no };
    let pay_req = pay_api.get_pay_path(self);

    #[derive(Serialize, Deserialize)]
    struct Mchid {
      mchid: String,
    }

    let body = Mchid {
      mchid: self.mchid.to_string(),
    };
    let _: () = post(self, &pay_req, &body).await?;
    Ok(())
  }

  pub async fn refund(
    &self,
    body: &Refund,
  ) -> Result<RefundDetail> {
    let pay_api = PayApi::Refund;
    let pay_req = pay_api.get_pay_path(self);
    info!("wxpay.refund request body: {body:?}");
    let data_val: serde_json::Value = post(self, &pay_req, body).await?;
    info!("wxpay.refund response data: {data_val:?}");
    if let Some(code) = data_val.get("code").and_then(|value| value.as_str()) {
      let message = data_val
        .get("message")
        .and_then(|value| value.as_str())
        .unwrap_or_default()
        .to_string();
      return Err(WxPayError::Api {
        code: code.to_string(),
        message,
      });
    }
    let data = serde_json::from_value(data_val)?;
    Ok(data)
  }

  pub async fn get_refund(
    &self,
    out_refund_no: &str,
  ) -> Result<RefundDetail> {
    let pay_api = PayApi::GetRefund { out_refund_no };
    let pay_req = pay_api.get_pay_path(self);
    get(self, &pay_req).await
  }
}