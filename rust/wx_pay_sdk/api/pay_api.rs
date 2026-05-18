use crate::WxPay;

use super::ReqMethod;

#[derive(Debug)]
pub(crate) struct PayReq {
  pub method: ReqMethod,
  pub path: String,
}

#[derive(Debug)]
pub(crate) enum PayApi<'a> {
  Jsapi,
  GetTransactionsById {
    transaction_id: &'a str,
  },
  GetTransactionsByOutTradeNo {
    out_trade_no: &'a str,
  },
  Close {
    out_trade_no: &'a str,
  },
  Refund,
  GetRefund {
    out_refund_no: &'a str,
  },
}

impl PayApi<'_> {
  pub(crate) fn get_pay_path(
    &self,
    wx_pay: &WxPay<'_>,
  ) -> PayReq {
    let mchid = wx_pay.mchid;
    match self {
      Self::Jsapi => PayReq {
        method: ReqMethod::Post,
        path: "/v3/pay/transactions/jsapi".to_string(),
      },
      Self::GetTransactionsById { transaction_id } => PayReq {
        method: ReqMethod::Get,
        path: format!("/v3/pay/transactions/id/{transaction_id}?mchid={mchid}"),
      },
      Self::GetTransactionsByOutTradeNo { out_trade_no } => PayReq {
        method: ReqMethod::Get,
        path: format!("/v3/pay/transactions/out-trade-no/{out_trade_no}?mchid={mchid}"),
      },
      Self::Close { out_trade_no } => PayReq {
        method: ReqMethod::Post,
        path: format!("/v3/pay/transactions/out-trade-no/{out_trade_no}/close"),
      },
      Self::Refund => PayReq {
        method: ReqMethod::Post,
        path: "/v3/refund/domestic/refunds".to_string(),
      },
      Self::GetRefund { out_refund_no } => PayReq {
        method: ReqMethod::Get,
        path: format!("/v3/refund/domestic/refunds/{out_refund_no}"),
      },
    }
  }
}