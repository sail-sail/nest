use color_eyre::eyre::Result;
use tracing::info;

use generated::common::context::{
  Options,
  get_req_id,
};

use generated::wx::wx_refund::wx_refund_model::{
  WxRefundSearch,
  WxRefundModel,
};

use super::wx_refund_service;

/// 查询退款状态
#[function_name::named]
pub async fn trade_state_wx_refund(
  search: Option<WxRefundSearch>,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let wx_refund_model = wx_refund_service::trade_state_wx_refund(
    search,
    options,
  ).await?;
  
  Ok(wx_refund_model)
}
