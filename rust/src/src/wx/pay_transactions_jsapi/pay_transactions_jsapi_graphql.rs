use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

use super::pay_transactions_jsapi_resolver;

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
        pay_transactions_jsapi_resolver::get_test_pay_opt(appid)
      }).await
  }
  
}
