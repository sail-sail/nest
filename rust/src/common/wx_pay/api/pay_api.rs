#![allow(dead_code)]

use super::ReqMethod;
use super::super::wx_pay::WxPay;

/// 支付的请求内容
#[derive(Debug)]
pub(crate) struct PayReq {
  pub method: ReqMethod,
  pub path: String,
}

/// 支付接口类别
#[derive(Debug)]
pub(crate) enum PayApi<'a> {
  Jsapi,
  GetTransactionsById { transaction_id: &'a str },
  GetTransactionsByOutTradeNo { out_trade_no: &'a str },
  Close { out_trade_no: &'a str },
  Refund,
  GetRefund { out_refund_no: &'a str },
}

impl PayApi<'_> {
  pub(crate) fn get_pay_path(&self, wx_pay: &WxPay) -> PayReq {
    match &self {
        PayApi::Jsapi => PayReq {
          method: ReqMethod::Post,
          path: "/v3/pay/transactions/jsapi".to_string(),
        },
        PayApi::GetTransactionsById { transaction_id } => PayReq {
          method: ReqMethod::Get,
          path: "/v3/pay/transactions/id/".to_string()
            + transaction_id
            + "?mchid="
            + wx_pay.mchid,
        },
        PayApi::GetTransactionsByOutTradeNo { out_trade_no } => PayReq {
          method: ReqMethod::Get,
          path: "/v3/pay/transactions/out-trade-no/".to_string()
            + out_trade_no
            + "?mchid="
            + wx_pay.mchid,
        },
        PayApi::Close { out_trade_no } => PayReq {
          method: ReqMethod::Post,
          path: "/v3/pay/transactions/out-trade-no/".to_string() + out_trade_no + "/close",
        },
        PayApi::Refund => PayReq {
          method: ReqMethod::Post,
          path: "/v3/refund/domestic/refunds".to_string(),
        },
        PayApi::GetRefund { out_refund_no } => PayReq {
          method: ReqMethod::Get,
          path: "/v3/refund/domestic/refunds/".to_string() + out_refund_no,
        },
    }
  }
}
