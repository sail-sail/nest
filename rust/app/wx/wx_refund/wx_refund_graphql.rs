use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use generated::common::context::Ctx;

use generated::wx::wx_refund::wx_refund_model::{
  WxRefundSearch,
  WxRefundModel,
};

use super::wx_refund_resolver;

#[derive(Default)]
pub struct WxRefundQuery;

#[Object(rename_args = "snake_case")]
impl WxRefundQuery {
  
  /// 查询退款状态
  #[graphql(name = "tradeStateWxRefund")]
  async fn trade_state_wx_refund(
    &self,
    ctx: &Context<'_>,
    search: Option<WxRefundSearch>,
  ) -> Result<WxRefundModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wx_refund_resolver::trade_state_wx_refund(
          search,
          None,
        )
      }).await
  }
  
}
