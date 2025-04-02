use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::PayTransactionsJsapiModel;

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

use super::pay_transactions_jsapi_resolver;

#[derive(Default)]
pub struct PayTransactionsJsapiQuery;

#[derive(Default)]
pub struct PayTransactionsJsapiMutation;

#[Object(rename_args = "snake_case")]
impl PayTransactionsJsapiMutation {
  
  /// 微信支付测试, requestPayment 所需参数
  async fn get_test_pay_opt(
    &self,
    ctx: &Context<'_>,
    appid: String,
  ) -> Result<RequestPaymentOptions> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::get_test_pay_opt(
          appid,
          None,
        )
      }).await
  }
  
}

#[Object(name = "snake_case")]
impl PayTransactionsJsapiQuery {
  
  /// 通过 out_trade_no 查询支付状态
  async fn trade_state_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "out_trade_no")]
    out_trade_no: String,
  ) -> Result<PayTransactionsJsapiModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::trade_state_pay_transactions_jsapi(
          out_trade_no,
          None,
        )
      }).await
  }
  
}
